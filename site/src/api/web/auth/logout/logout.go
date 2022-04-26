package logout

import (
	"net/http"
	"net/url"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for our logout.
func Handler(ctx *gin.Context) {
	session := sessions.Default(ctx)

	logoutUrl, err := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/v2/logout")

	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusInternalServerError, err.Error())
	}

	// Is this needed?
	session.Delete("state")
	session.Delete("profile")

	returnTo := ctx.Request.Referer()
	if returnTo == "" {
		returnTo = ctx.Request.URL.String()
	}

	parameters := url.Values{}
	parameters.Add("returnTo", returnTo)
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	// Multi value headers are still not working with netlify lambda,
	// so use client side response instead to call the url.
	ctx.Header("Location", logoutUrl.String())
	ctx.Header("Cache-Control", "no-cache")

	ctx.JSON(http.StatusFound, gin.H{
		"next": logoutUrl.String(),
	})
}
