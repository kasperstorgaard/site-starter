package main

import (
	"context"
	"encoding/gob"
	"log"
	"site-starter/api/shared/authenticator"
	"site-starter/api/web/auth/callback"
	"site-starter/api/web/auth/login"
	"site-starter/api/web/auth/logout"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"

	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

func init() {
	rtr := gin.Default()

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})

	store := cookie.NewStore([]byte("secret"))
	rtr.Use(sessions.Sessions("auth-session", store))

	// Set up mongodb models (mgm)
	auth0, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	rtr.GET("/api/auth/login", login.Handler(auth0))
	rtr.GET("/api/auth/callback", callback.Handler(auth0))
	rtr.GET("/api/auth/logout", logout.Handler)

	ginLambda = ginadapter.New(rtr)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
