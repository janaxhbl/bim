package util

import (
	"regexp"
	"strings"
)

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
