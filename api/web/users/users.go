package users

import (
	"site-starter/api/shared/authenticator"
	"site-starter/api/web/users/list"
	"site-starter/api/web/users/single"

	"github.com/gin-gonic/gin"
)

func AddRoutes(grp *gin.RouterGroup, auth *authenticator.Authenticator) {
	r := grp.Group("/users")

	list.AddRoutes(r)
	single.AddRoutes(r)
}
