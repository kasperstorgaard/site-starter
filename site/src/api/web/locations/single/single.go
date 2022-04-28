package single

import (
	"encoding/json"
	"net/http"
	"site-starter/api/shared/middleware"
	"site-starter/api/web/locations/models"

	"github.com/gin-gonic/gin"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddRoutes(grp *gin.RouterGroup) {
	grp.POST("", middleware.IsAuthenticated, create)
	grp.GET("/:id", middleware.IsAuthenticated, findById)
	grp.PUT("/:id", middleware.IsAuthenticated, updateById)
	grp.DELETE("/:id", middleware.IsAuthenticated, deleteById)
}

func create(ctx *gin.Context) {
	d := json.NewDecoder(ctx.Request.Body)
	d.DisallowUnknownFields() // catch unwanted fields

	in := &models.Location{}
	err := d.Decode(in)
	if err != nil {
		// TODO: set up error loggin middleware
		ctx.Error(err)
		ctx.String(http.StatusBadRequest, "Invalid location")
		return
	}

	// TODO: create + validate model based on POST body
	err = mgm.Coll(in).Create(in)

	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, in)
}

func findById(ctx *gin.Context) {
	r := &models.Location{}
	i, _ := ctx.Params.Get("id")

	err := mgm.Coll(r).FindByID(i, r)

	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusBadRequest, "Invalid location id")
		return
	}

	ctx.JSON(http.StatusOK, r)
}

func updateById(ctx *gin.Context) {
	i, _ := ctx.Params.Get("id")
	id, err := primitive.ObjectIDFromHex(i)
	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusBadRequest, "Invalid location id")
		return
	}

	d := json.NewDecoder(ctx.Request.Body)
	d.DisallowUnknownFields() // catch unwanted fields

	in := &models.Location{}
	err = d.Decode(in)

	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusBadRequest, "Invalid location")
		return
	}

	in.SetID(id)
	mgm.Coll(in).Update(in)

	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, in)
}

func deleteById(ctx *gin.Context) {
	i, _ := ctx.Params.Get("id")

	t := &models.Location{}
	_, err := t.PrepareID(i)
	if err != nil {
		ctx.String(http.StatusBadRequest, "Invalid location id")
	}

	err = mgm.Coll(t).Delete(t)
	if err != nil {
		ctx.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
