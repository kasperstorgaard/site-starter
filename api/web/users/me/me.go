package me

import (
	"net/http"
	"site-starter/api/shared/authenticator"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type User struct {
	Name     string `json:"name"`
	Nickname string `json:"nickname"`
}

// Handler for our callback.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)
		d, ok := session.Get("profile").(map[string]interface{})

		if !ok {
			ctx.String(http.StatusUnauthorized, "Unauthorized")
			return
		}

		ctx.JSON(http.StatusOK, &User{
			Name:     d["name"].(string),
			Nickname: d["nickname"].(string),
		})
	}
}
