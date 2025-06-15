package db

import (
	"fmt"
	"log"
	"os"

	"github.com/janaxhbl/bim/bim-backend/db/models"
	"golang.org/x/crypto/bcrypt"

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

	err = DB.AutoMigrate(&models.User{})

	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}

	createAdminUser()
	// --- DEV ONLY END !!! ----------------------
}

// --- DEV ONLY !!! ------------------------------
func createAdminUser() {
	hashPw, err := bcrypt.GenerateFromPassword([]byte("Aa1!Aa1!"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to create admin user!")
		return
	}

	user := models.User{
		UserName: "admin",
		Email:    "admin@mail.com",
		Password: string(hashPw),
		IsAdmin:  true,
	}

	result := DB.Create(&user)
	if result.Error != nil {
		log.Fatal("Create admin error: ", result.Error.Error())
		return
	}
	log.Print("Created admin user successfully!")
}
