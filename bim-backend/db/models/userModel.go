package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`

	UserName string `json:"user_name"`
	Email    string `json:"email" gorm:"unique;not null"`
	// Password string `json:"-" gorm:"not null"`
	Password string `gorm:"not null"`
	IsAdmin  bool   `json:"is_admin" gorm:"not null;default:false"`

	CodeSnippets []CodeSnippet `json:"code_snippets"` // one-to-many
}

func (User) TableName() string {
	return "users"
}
