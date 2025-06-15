package routes

import (
	"github.com/janaxhbl/bim/bim-backend/src/handlers"
	"github.com/janaxhbl/bim/bim-backend/src/util"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.SetTrustedProxies([]string{"127.0.0.1"})
	router.Use(cors.Default())

	api := router.Group("/api")

	// public routes
	{
		// test api
		api.GET("/ping", handlers.Ping)

		// login/register
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
	}

	// protected routes
	api.Use(util.JWTAuthUtil())
	{
		// user
		api.GET("/users", handlers.GetUsers)
		api.GET("/users/:id", handlers.GetUserById)
		api.POST("/users", handlers.CreateUser)
		api.PUT("/users/:id", handlers.UpdateUser)
		api.DELETE("/users/:id", handlers.DeleteUser)

		// code snippets
		api.GET("/code_snippets", handlers.GetCodeSnippets)
		api.GET("/code_snippets/:id", handlers.GetCodeSnippetsById)
		api.GET("/code_snippets/user/:user_id", handlers.GetCodeSnippetsByUserId)
		api.POST("/code_snippets", handlers.CreateCodeSnippet)
		api.PUT("/code_snippets/:id", handlers.UpdateCodeSnippet)
		api.DELETE("/code_snippets/:id", handlers.DeleteCodeSnippet)
	}

	return router
}
