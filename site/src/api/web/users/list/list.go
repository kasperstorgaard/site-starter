package list

import (
	"net/http"
	"site-starter/api/shared/middleware"

	"github.com/gin-gonic/gin"
)

// Handler for our logged-in user page.
func AddRoutes(grp *gin.RouterGroup) {
	grp.GET("", middleware.IsAuthenticated, getAll)
}

func getAll(ctx *gin.Context) {
	// Steps:
	// 1. Get all users from auth0 using mgmt token
	ctx.String(http.StatusInternalServerError, "Not implemented")
}
