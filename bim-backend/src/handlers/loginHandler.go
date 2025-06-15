package handlers

import (
	"net/http"

	"github.com/janaxhbl/bim/bim-backend/db"
	"github.com/janaxhbl/bim/bim-backend/db/models"
	"github.com/janaxhbl/bim/bim-backend/src/util"
	"golang.org/x/crypto/bcrypt"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var err error
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err = c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	err = db.DB.Where("email = ?", input.Email).First(&user).Error
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials!"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials!"})
		return
	}

	token, err := util.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful!", "token": token})
}

func Register(c *gin.Context) {
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

	if user.UserName == "" {
		user.UserName = user.Email
	}
	user.Password = string(hashPw)

	result := db.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	token, err := util.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token!"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registerd successfully!", "token": token})
}
