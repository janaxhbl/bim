package handlers

import (
	"net/http"

	"github.com/janaxhbl/bim/bim-backend/db"
	"github.com/janaxhbl/bim/bim-backend/db/models"

	"github.com/gin-gonic/gin"
)

func GetCodeSnippets(c *gin.Context) {
	var codeSnippets []models.CodeSnippet
	db.DB.Find(&codeSnippets)
	c.JSON(http.StatusOK, codeSnippets)
}

func GetCodeSnippetsById(c *gin.Context) {
	var codeSnippet models.CodeSnippet
	id := c.Param("id")

	result := db.DB.First(&codeSnippet, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Code snippet not found!"})
		return
	}

	c.JSON(http.StatusOK, codeSnippet)
}

func GetCodeSnippetsByUserId(c *gin.Context) {
	var codeSnippets []models.CodeSnippet
	userID := c.Param("user_id")

	result := db.DB.Where("user_id = ?", userID).Find(&codeSnippets)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Code snippets not found!"})
		return
	}

	c.JSON(http.StatusOK, codeSnippets)
}

func CreateCodeSnippet(c *gin.Context) {
	var codeSnippet models.CodeSnippet

	err := c.ShouldBindJSON(&codeSnippet)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.DB.Create(&codeSnippet)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, codeSnippet)
}

func UpdateCodeSnippet(c *gin.Context) {
	var codeSnippet models.CodeSnippet
	id := c.Param("id")

	result := db.DB.First(&codeSnippet, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Code snippet not found!"})
		return
	}

	err := c.ShouldBindJSON(&codeSnippet)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Save(&codeSnippet)
	c.JSON(http.StatusOK, codeSnippet)
}

func DeleteCodeSnippet(c *gin.Context) {
	id := c.Param("id")
	db.DB.Delete(&models.CodeSnippet{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Code snippet deleted!"})
}
