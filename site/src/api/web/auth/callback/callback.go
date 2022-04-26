package callback

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"site-starter/api/shared/authenticator"
	"site-starter/api/shared/env"
)

// Handler for our callback.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		isDev := env.IsDev()

		auth.SetRedirectUrl(ctx)

		// TODO: figure out why we cant save "state" in session???
		session := sessions.Default(ctx)

		// Verify that the return state param matches our saved state value.
		// This is to protect against man in the middle attacks.
		if !isDev && ctx.Query("state") != session.Get("state") {
			ctx.Error(errors.New("invalid state parameter"))
			ctx.String(http.StatusBadRequest, fmt.Sprintf("Invalid state parameter. %s", session.Get("state")))
			return
		}

		// Exchange the authorization code for a token.
		token, err := auth.Exchange(ctx.Request.Context(), ctx.Query("code"))
		if err != nil {
			ctx.Error(err)
			ctx.String(http.StatusUnauthorized, "Failed to convert an authorization code into a token.")
			return
		}

		// Verify the exchanged token using open id (oidc)
		idToken, err := auth.VerifyIDToken(ctx.Request.Context(), token)
		if err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, "Failed to verify ID Token.")
			return
		}

		// Extract the profile data of the user
		// TODO: what is the role of "claims" here?
		var profile map[string]interface{}
		if err := idToken.Claims(&profile); err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Store the access token and profile on the session,
		// so we can retrieve those easily later without calling auth0
		session.Set("access_token", token.AccessToken)
		session.Set("profile", profile)
		if err := session.Save(); err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Multi value headers are still not working with netlify lambda,
		// so use client side response instead to call the url.
		ctx.Header("Location", "/")
		ctx.Header("Cache-Control", "no-cache")

		// TODO: get returnTo from state
		ctx.JSON(http.StatusFound, gin.H{
			"next": "/",
		})
	}
}
