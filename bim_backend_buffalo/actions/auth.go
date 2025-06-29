package actions

import (
	"bim_backend_buffalo/models"
	"database/sql"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v6"
	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("super-secret-key")

func Register(c buffalo.Context) error {
	user := &models.User{}

	if err := c.Bind(user); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(map[string]string{"error": "Invalid input"}))
	}

	tx := c.Value("tx").(*pop.Connection)

	user.Email = strings.TrimSpace(strings.ToLower(user.Email))

	// Check email uniqueness
	existing := &models.User{}
	err := tx.Where("email = ?", user.Email).First(existing)
	if err == nil {
		return c.Render(http.StatusBadRequest, r.JSON(map[string]string{"error": "Email already in use"}))
	}
	if err != sql.ErrNoRows {
		return c.Render(http.StatusInternalServerError, r.JSON(map[string]string{"error": "Database error"}))
	}

	// Set UserName if null
	if user.UserName == "" {
		user.UserName = user.Email
	}

	if !IsPasswordStrong(user.Password) {
		return c.Render(http.StatusBadRequest, r.JSON(map[string]string{"error": "Password must be at least 8 characters and include upper, lower case letters, a number, and a special character(!@#$%^&*()_+-=[]{};:,.<>?)!"}))
	}

	// Hash password before saving
	hashPw, err := models.HashPassword(user.Password)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(map[string]string{"error": "Failed to hash password"}))
	}
	user.Password = hashPw

	verrs, err := tx.ValidateAndCreate(user)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(map[string]string{"error": err.Error()}))
	}
	if verrs.HasAny() {
		return c.Render(http.StatusBadRequest, r.JSON(verrs))
	}

	// return c.Render(http.StatusCreated, r.JSON(user))
	return c.Render(http.StatusCreated, r.JSON(map[string]interface{}{
		"id":       user.ID,
		"username": user.UserName,
		"email":    user.Email,
	}))
}

func Login(c buffalo.Context) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&input); err != nil {
		return c.Render(http.StatusBadRequest, r.JSON(map[string]string{"error": "Invalid input"}))
	}

	tx := c.Value("tx").(*pop.Connection)

	user := &models.User{}
	err := tx.Where("email = ?", input.Email).First(user)
	if err != nil {
		return c.Render(http.StatusUnauthorized, r.JSON(map[string]string{"error": "Invalid credentials (user)"}))
	}

	if !models.ComparePasswordHash(user.Password, input.Password) {
		return c.Render(http.StatusUnauthorized, r.JSON(map[string]string{"error": "Invalid credentials (password)"}))
	}

	token, err := GenerateToken(user.ID)
	if err != nil {
		return c.Render(http.StatusInternalServerError, r.JSON(map[string]string{"error": "Failed to generate token"}))
	}

	return c.Render(http.StatusOK, r.JSON(map[string]interface{}{"token": token, "email": user.Email, "id": user.ID}))

}

func GenerateToken(userID int) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Minute * 30).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func JWTHandler(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Render(http.StatusUnauthorized, r.JSON(map[string]string{"error": "Missing or invalid Authorization header"}))
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			return c.Render(http.StatusUnauthorized, r.JSON(map[string]string{"error": "Invalid token"}))
		}

		claims := token.Claims.(jwt.MapClaims)
		userID := int(claims["sub"].(float64))

		c.Set("userID", userID)

		return next(c)
	}
}

func IsPasswordStrong(pw string) bool {
	if len(pw) < 8 {
		return false
	}

	if strings.Contains(pw, " ") {
		return false
	}

	var (
		hasUpper   = regexp.MustCompile(`[A-Z]`)
		hasLower   = regexp.MustCompile(`[a-z]`)
		hasNumber  = regexp.MustCompile(`[0-9]`)
		hasSpecial = regexp.MustCompile(`[!@#\$%\^&\*\(\)_\+\-=\[\]{};:,.<>?]`)
	)

	return hasUpper.MatchString(pw) &&
		hasLower.MatchString(pw) &&
		hasNumber.MatchString(pw) &&
		hasSpecial.MatchString(pw)
}
