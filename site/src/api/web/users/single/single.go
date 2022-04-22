package single

import (
	"net/http"
	"site-starter/api/shared/middleware"

	"github.com/gin-gonic/gin"
)

func AddRoutes(grp *gin.RouterGroup) {
	grp.GET("/:id", middleware.IsAuthenticated, findById)
	grp.GET("/me", middleware.IsAuthenticated, getMe)
}

func findById(ctx *gin.Context) {
	// Steps:
	// 1. Get user from auth0 using mgmt token
	ctx.String(http.StatusInternalServerError, "Not implemented")
}

type invalidSessionError struct {
	session interface{}
}

func (e *invalidSessionError) Error() string {
	return "invalid session"
}

func getMe(ctx *gin.Context) {
	// d, ok := session.Get("profile").(map[string]interface{})

	// TODO: get user from id in cookie

	// if !ok {
	ctx.Error(&invalidSessionError{session: ""})
	ctx.String(http.StatusUnauthorized, "Unauthorized")
	// 	return
	// }

	// ctx.JSON(http.StatusOK, &models.User{
	// 	Name:     d["name"].(string),
	// 	Nickname: d["nickname"].(string),
	// })
}
