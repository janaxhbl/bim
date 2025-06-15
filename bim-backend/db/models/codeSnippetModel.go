package models

import (
	"time"

	"gorm.io/gorm"
)

type CodeSnippet struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"`

	Title     string `json:"title" gorm:"not null"`
	Language  string `json:"language"`
	Code      string `json:"code" gorm:"not null"`
	IsPrivate bool   `json:"is_private" gorm:"not null;default:false"`
	UserID    uint   `json:"user_id" gorm:"not null"` // fk
}

func (CodeSnippet) TableName() string {
	return "code_snippets"
}
