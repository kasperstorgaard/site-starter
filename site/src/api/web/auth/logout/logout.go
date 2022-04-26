package logout

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	"site-starter/api/shared/env"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type NextResponse struct {
	Next string `json:"next"`
}

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
		returnTo = env.ApiUrl().String() + "/api/auth/logout"
	}

	parameters := url.Values{}
	parameters.Add("returnTo", returnTo)
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	// Multi value headers are still not working with netlify lambda,
	// so use client side response instead to call the url.
	ctx.Header("Location", logoutUrl.String())
	ctx.Header("Cache-Control", "no-cache")

	// Using our own json serializer bc. the auth code url contains html characters,
	// and we don't want those to be escaped here
	// TODO: figure out a better way to do this
	var b bytes.Buffer

	enc := json.NewEncoder(&b)
	enc.SetEscapeHTML(false)
	err = enc.Encode(&NextResponse{Next: logoutUrl.String()})

	if err != nil {
		ctx.Error(err)
		ctx.String(http.StatusInternalServerError, "Failed")
		return
	}
	ctx.Header("Content-Type", "application/json")
	ctx.String(http.StatusFound, b.String())
}
