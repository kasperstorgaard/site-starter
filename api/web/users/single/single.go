package single

import (
	"fmt"
	"net/http"
	"site-starter/api/shared/middleware"
	"site-starter/api/web/users/models"

	"github.com/gin-contrib/sessions"
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
	return fmt.Sprintf("Invalid session")
}

func getMe(ctx *gin.Context) {
	session := sessions.Default(ctx)

	d, ok := session.Get("profile").(map[string]interface{})

	if !ok {
		ctx.Error(&invalidSessionError{session: d})
		ctx.String(http.StatusUnauthorized, "Unauthorized")
		return
	}

	ctx.JSON(http.StatusOK, &models.User{
		Name:     d["name"].(string),
		Nickname: d["nickname"].(string),
	})
}
