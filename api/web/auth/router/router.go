package router

import (
	"site-starter/api/shared/authenticator"
	"site-starter/api/web/auth/callback"
	"site-starter/api/web/auth/login"
	"site-starter/api/web/auth/logout"

	"github.com/gin-gonic/gin"
)

func AddRoutes(root *gin.RouterGroup, a *authenticator.Authenticator) {
	root.GET("/auth/login", login.Handler(a))
	root.GET("/auth/callback", callback.Handler(a))
	root.GET("/auth/logout", logout.Handler)
}
