package auth

import (
	"site-starter/api/shared/authenticator"
	"site-starter/api/web/auth/callback"
	"site-starter/api/web/auth/login"
	"site-starter/api/web/auth/logout"

	"github.com/gin-gonic/gin"
)

func AddRoutes(grp *gin.RouterGroup, a *authenticator.Authenticator) {
	grp.GET("/auth/login", login.Handler(a))
	grp.GET("/auth/callback", callback.Handler(a))
	grp.GET("/auth/logout", logout.Handler)
}
