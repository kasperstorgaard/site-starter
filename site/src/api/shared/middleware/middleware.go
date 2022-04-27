package middleware

import (
	"net/http"
	"site-starter/api/shared/config"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// IsAuthenticated is a middleware that checks if
// the user has already been authenticated previously.
func IsAuthenticated(ctx *gin.Context) {
	// TODO: add role based auth configs (rbac) to this middleware,
	// so we have a shared way to set up what kind of users can access each endpoint.
	isDev := config.IsDev()

	if !isDev && sessions.Default(ctx).Get("profile") == nil {
		// return a more helpful error in dev mode?
		// TODO: logging
		ctx.String(http.StatusUnauthorized, "not authorized to access resource")
	} else {
		ctx.Next()
	}
}
