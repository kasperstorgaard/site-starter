package login

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"site-starter/api/shared/authenticator"
)

type NextResponse struct {
	Next string `json:"next"`
}

// Handler for our login.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		state, err := generateRandomState()

		auth.SetRedirectUrl(ctx)

		if err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Save the state inside the session.
		session := sessions.Default(ctx)
		session.Set("state", state)

		if err := session.Save(); err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Multi value headers are still not working with netlify lambda,
		// so use client side response instead to call the url.
		authURL := auth.AuthCodeURL(state)
		authURL = strings.Replace(authURL, "\u0026", "&", -1)

		ctx.Header("Location", authURL)
		ctx.Header("Cache-Control", "no-cache")

		// Using our own json serializer bc. the auth code url contains html characters,
		// and we don't want those to be escaped here
		// TODO: figure out a better way to do this
		var resp bytes.Buffer

		enc := json.NewEncoder(&resp)
		enc.SetEscapeHTML(false)
		err = enc.Encode(&NextResponse{Next: authURL})

		if err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, "Failed")
			return
		}

		ctx.Header("Content-Type", "application/json")
		ctx.String(http.StatusFound, resp.String())
	}
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	state := base64.StdEncoding.EncodeToString(b)

	return state, nil
}
