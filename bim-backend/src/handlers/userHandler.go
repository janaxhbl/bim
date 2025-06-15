package handlers

import (
	"fmt"
	"net/http"

	"github.com/janaxhbl/bim/bim-backend/db"
	"github.com/janaxhbl/bim/bim-backend/db/models"
	"github.com/janaxhbl/bim/bim-backend/src/util"

	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []models.User
	db.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func GetUserById(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	result := db.DB.First(&user, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	var user models.User

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !util.IsPasswordStrong(user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters and include upper, lower case letters, a number, and a special character(!@#$%^&*()_+-=[]{};:,.<>?)!"})
		return
	}

	hashPw, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password!"})
		return
	}
	user.Password = string(hashPw)

	result := db.DB.Create(&user)
	fmt.Println("Create result error:", result.Error)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func UpdateUser(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	result := db.DB.First(&user, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found!"})
		return
	}

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	db.DB.Delete(&models.User{}, id)
	c.Status(http.StatusNoContent)
}
