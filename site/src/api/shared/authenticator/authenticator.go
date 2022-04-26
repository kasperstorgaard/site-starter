package authenticator

import (
	"context"
	"errors"
	"log"
	"net/url"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

// Authenticator is used to authenticate our users.
type Authenticator struct {
	*oidc.Provider
	oauth2.Config
}

type Profile struct {
	Username string `json:"username"`
	Nickname string `json:"nickname"`
}

// New instantiates the *Authenticator.
func New() (*Authenticator, error) {
	provider, err := oidc.NewProvider(
		context.Background(),
		"https://"+os.Getenv("AUTH0_DOMAIN")+"/",
	)
	if err != nil {
		return nil, err
	}

	redirUrl, err := url.Parse(os.Getenv("URL"))
	if err != nil {
		log.Fatalf("unable to parse environment variable URL")
	}

	redirUrl.Path = os.Getenv("AUTH0_CALLBACK_PATH")

	conf := oauth2.Config{
		ClientID:     os.Getenv("AUTH0_CLIENT_ID"),
		ClientSecret: os.Getenv("AUTH0_CLIENT_SECRET"),
		RedirectURL:  "",
		Endpoint:     provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID, "profile"},
	}

	return &Authenticator{
		Provider: provider,
		Config:   conf,
	}, nil
}

// VerifyIDToken verifies that an *oauth2.Token is a valid *oidc.IDToken.
func (a *Authenticator) VerifyIDToken(ctx context.Context, token *oauth2.Token) (*oidc.IDToken, error) {
	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		return nil, errors.New("no id_token field in oauth2 token")
	}

	oidcConfig := &oidc.Config{
		ClientID: a.ClientID,
	}

	return a.Verifier(oidcConfig).Verify(ctx, rawIDToken)
}

func (a *Authenticator) SetRedirectUrl(ctx *gin.Context) {
	// clone the url and build a new one
	u, _ := url.Parse(ctx.Request.URL.String())

	// TODO: find a better way to do this?
	if u.Host == "" {
		u.Host = "localhost:8888"
		u.Scheme = "http"
	}

	u.Path = "/api/auth/callback"
	a.Config.RedirectURL = u.String()
}
