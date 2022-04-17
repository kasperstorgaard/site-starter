package all

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler for our logged-in user page.
func Get(ctx *gin.Context) {
	ctx.String(http.StatusInternalServerError, "Not implemented")
}
