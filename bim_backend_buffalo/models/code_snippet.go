package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop/v6"
	"github.com/gobuffalo/validate/v3"
	"github.com/gobuffalo/validate/v3/validators"
)

// CodeSnippet is used by pop to map your code_snippets database table to your go code.
type CodeSnippet struct {
	ID        int       `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`

	Title     string `json:"title" db:"title"`
	Language  string `json:"language" db:"language"`
	Code      string `json:"code" db:"code"`
	IsPrivate bool   `json:"is_private" db:"is_private"`

	UserID int  `json:"user_id" db:"user_id"` // fk in db
	User   User `belongs_to:"user" json:"-"`  // relationship in go
}

// String is not required by pop and may be deleted
func (c CodeSnippet) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// CodeSnippets is not required by pop and may be deleted
type CodeSnippets []CodeSnippet

// String is not required by pop and may be deleted
func (c CodeSnippets) String() string {
	jc, _ := json.Marshal(c)
	return string(jc)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (c *CodeSnippet) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.Validate(
		&validators.StringIsPresent{Field: c.Title, Name: "Title"},
		&validators.StringIsPresent{Field: c.Code, Name: "Code"},
	), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (c *CodeSnippet) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (c *CodeSnippet) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
