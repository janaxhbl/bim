package db

import (
	"fmt"
	"log"
	"os"

	"github.com/janaxhbl/bim/bim-backend/db/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func Init() {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s sslmode=disable",
		user, password, dbname, host, port,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})

	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
		return
	}
	log.Println("Database connected successfully!")

	// --- DEV ONLY !!! --------------------------
	err = DB.Migrator().DropTable(&models.User{})
	if err != nil {
		log.Fatal("Failed to drop table users: ", err)
	}

	// --- DEV ONLY END !!! ----------------------

	err = DB.AutoMigrate(&models.User{})

	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}
}
