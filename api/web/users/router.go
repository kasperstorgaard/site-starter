package users

import (
	"site-starter/api/shared/authenticator"
	"site-starter/api/shared/middleware"
	"site-starter/api/web/users/me"

	"github.com/gin-gonic/gin"
)

func AddRoutes(root *gin.RouterGroup, auth *authenticator.Authenticator) {
	root.GET("/users/me", middleware.IsAuthenticated, me.Handler(auth))
}
