package main

import (
	"github.com/janaxhbl/bim/bim-backend/config"
	"github.com/janaxhbl/bim/bim-backend/db"
	"github.com/janaxhbl/bim/bim-backend/src/routes"
)

func main() {
	config.LoadEnv()
	db.Init()
	router := routes.SetupRouter()
	// router.Run(":8080")
	router.RunTLS(":8080", "localhost+1.pem", "localhost+1-key.pem")
}
