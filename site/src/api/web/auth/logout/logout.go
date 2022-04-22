package logout

import (
	"log"
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
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	scheme := "http"
	if ctx.Request.TLS != nil {
		scheme = "https"
	}

	log.Printf("scheme: %s, url: %s", scheme, ctx.Request.URL)

	// Not sure why gin-gonic + lambda can't find localhost in either
	// .Host or .URL (concerning...)
	u, err := url.Parse(os.Getenv("DEPLOY_URL") + "/api/auth/logout")
	// TODO: better handling of returnTo, if query param specified

	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
	}

	// Is this needed?
	session.Delete("state")
	session.Delete("profile")

	parameters := url.Values{}
	parameters.Add("returnTo", u.String())
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	ctx.Redirect(http.StatusTemporaryRedirect, logoutUrl.String())
}
