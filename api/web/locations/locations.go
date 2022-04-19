package locations

import (
	"site-starter/api/web/locations/claim"
	"site-starter/api/web/locations/list"
	"site-starter/api/web/locations/single"

	"github.com/gin-gonic/gin"
)

func AddRoutes(grp *gin.RouterGroup) {
	r := grp.Group("/locations")

	list.AddRoutes(r)
	single.AddRoutes(r)
	claim.AddRoutes(r)
}
