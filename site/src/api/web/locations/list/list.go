package list

import (
	"net/http"
	"site-starter/api/shared/middleware"
	"site-starter/api/web/locations/models"

	"github.com/gin-gonic/gin"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func AddRoutes(grp *gin.RouterGroup) {
	grp.GET("", middleware.IsAuthenticated, getAll)
}

func getAll(ctx *gin.Context) {
	result := []models.Location{}

	mgm.Coll(&models.Location{}).SimpleFind(&result, bson.D{})
	ctx.JSON(http.StatusOK, result)
}
