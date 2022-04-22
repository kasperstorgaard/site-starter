package main

import (
	"context"
	"encoding/gob"
	"log"
	"site-starter/api/shared/mongodb"
	"site-starter/api/web/locations/claim"
	"site-starter/api/web/locations/list"
	"site-starter/api/web/locations/single"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo/options"

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

	u := mongodb.BuildURI()
	err := mgm.SetDefaultConfig(nil, "location", options.Client().ApplyURI(u))
	if err != nil {
		log.Fatalf("Unable to connect to mongodb")
	}

	rtr.Use(sessions.Sessions("auth-session", store))

	grp := rtr.Group("/api/locations")

	list.AddRoutes(grp)
	single.AddRoutes(grp)
	claim.AddRoutes(grp)

	ginLambda = ginadapter.New(rtr)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
