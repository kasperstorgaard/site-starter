package claim

import (
	"net/http"
	"site-starter/api/shared/middleware"

	"github.com/gin-gonic/gin"
)

func AddRoutes(grp *gin.RouterGroup) {
	grp.GET("/:id/claim", middleware.IsAuthenticated, claim)
}

func claim(ctx *gin.Context) {
	// STEPS
	// Get the location
	// Check to see if location is already claimed
	// Claim if available
	// Error if already claimed
	ctx.String(http.StatusInternalServerError, "Not implemented yet")
}
