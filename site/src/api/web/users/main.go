package main

import (
	"context"
	"encoding/gob"
	"site-starter/api/web/locations/list"
	"site-starter/api/web/locations/single"

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

	grp := rtr.Group("/api/users")

	list.AddRoutes(grp)
	single.AddRoutes(grp)

	ginLambda = ginadapter.New(rtr)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
