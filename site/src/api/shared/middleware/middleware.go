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
	if !config.IsDev() && sessions.Default(ctx).Get("profile") == nil {
		ctx.String(http.StatusUnauthorized, "not authorized to access resource")
		ctx.Abort()
	} else {
		ctx.Next()
	}
}
