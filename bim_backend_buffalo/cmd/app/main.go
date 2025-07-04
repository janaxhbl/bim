package main

import (
	"crypto/tls"
	"log"
	"net/http"
	"time"

	"bim_backend_buffalo/actions"
)

// main is the starting point for your Buffalo application.
// You can feel free and add to this `main` method, change
// what it does, etc...
// All we ask is that, at some point, you make sure to
// call `app.Serve()`, unless you don't want to start your
// application that is. :)
func main() {
	app := actions.App()

	if actions.ENV == "development" {
		server := &http.Server{
			Addr:         ":3000",
			Handler:      app,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
			TLSConfig: &tls.Config{
				MinVersion: tls.VersionTLS12,
			},
		}

		log.Println("Server running in devmode...")
		err := server.ListenAndServeTLS("./cert/localhost+1.pem", "./cert/localhost+1-key.pem")
		if err != nil {
			log.Fatal("Server failed to start:", err)
			return
		}
	} else {
		if err := app.Serve(); err != nil {
			log.Fatal(err)
		}
	}

}

/*
# Notes about `main.go`

## SSL Support

We recommend placing your application behind a proxy, such as
Apache or Nginx and letting them do the SSL heavy lifting
for you. https://gobuffalo.io/en/docs/proxy

## Buffalo Build

When `buffalo build` is run to compile your binary, this `main`
function will be at the heart of that binary. It is expected
that your `main` function will start your application using
the `app.Serve()` method.

*/
