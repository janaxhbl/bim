package actions

import (
	"log"
	"net/http"
	"sync"

	"bim_backend_buffalo/locales"
	"bim_backend_buffalo/models"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo-pop/v3/pop/popmw"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/middleware/contenttype"
	"github.com/gobuffalo/middleware/forcessl"
	"github.com/gobuffalo/middleware/i18n"
	"github.com/gobuffalo/middleware/paramlogger"
	"github.com/gobuffalo/x/sessions"
	"github.com/unrolled/secure"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")

var (
	app     *buffalo.App
	appOnce sync.Once
	T       *i18n.Translator
)

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
//
// Routing, middleware, groups, etc... are declared TOP -> DOWN.
// This means if you add a middleware to `app` *after* declaring a
// group, that group will NOT have that new middleware. The same
// is true of resource declarations as well.
//
// It also means that routes are checked in the order they are declared.
// `ServeFiles` is a CATCH-ALL route, so it should always be
// placed last in the route declarations, as it will prevent routes
// declared after it to never be called.
func App() *buffalo.App {
	appOnce.Do(func() {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			SessionName:  "_bim_backend_buffalo_session",
		})

		// Automatically redirect to SSL
		app.Use(forceSSL())

		// Log request parameters (filters apply).
		app.Use(paramlogger.ParameterLogger)

		// Use cors middleware
		app.Use(CORSMiddleware)

		// Set the request content type to JSON
		app.Use(contenttype.Set("application/json"))

		// Wraps each request in a transaction.
		//   c.Value("tx").(*pop.Connection)
		// Remove to disable this.
		app.Use(popmw.Transaction(models.DB))

		app.GET("/", HomeHandler)

		// Public routes
		app.POST("/register", Register)
		app.POST("/login", Login)
		app.OPTIONS("/{path:.+}", func(c buffalo.Context) error {
			log.Println("OPTIONS fallback triggered")
			return c.Render(204, nil)
		})

		// Protected routes
		api := app.Group("/api")
		api.Use(JWTHandler)

		api.GET("/cors-test", func(c buffalo.Context) error {
			log.Println("cors test successfull")
			return c.Render(200, r.JSON(map[string]string{"status": "ok"}))
		})

		api.Resource("/users", UsersResource{})
		api.Resource("/code_snippets", CodeSnippetsResource{})
		api.GET("code_snippets/user/{user_id}", CodeSnippetsResource{}.ListByUser)
	})

	return app
}

// translations will load locale files, set up the translator `actions.T`,
// and will return a middleware to use to load the correct locale for each
// request.
// for more information: https://gobuffalo.io/en/docs/localization
func translations() buffalo.MiddlewareFunc {
	var err error
	if T, err = i18n.New(locales.FS(), "en-US"); err != nil {
		app.Stop(err)
	}
	return T.Middleware()
}

// forceSSL will return a middleware that will redirect an incoming request
// if it is not HTTPS. "http://example.com" => "https://example.com".
// This middleware does **not** enable SSL. for your application. To do that
// we recommend using a proxy: https://gobuffalo.io/en/docs/proxy
// for more information: https://github.com/unrolled/secure/
func forceSSL() buffalo.MiddlewareFunc {
	return forcessl.Middleware(secure.Options{
		SSLRedirect:     ENV == "production",
		SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
	})
}

func CORSMiddleware(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {

		res := c.Response()
		req := c.Request()

		res.Header().Set("Access-Control-Allow-Origin", "https://localhost:4200")
		res.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		res.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		res.Header().Set("Vary", "Origin")
		res.Header().Set("Access-Control-Allow-Credentials", "true")

		if req.Method == http.MethodOptions {
			return c.Render(http.StatusNoContent, nil)
		}
		return next(c)
	}
}
