package main

import (
	"context"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"

	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

func init() {
	rtr := gin.Default()

	rtr.GET("/api/tester", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"deployURL":      os.Getenv("DEPLOY_URL"),
			"context":        os.Getenv("CONTEXT"),
			"url":            os.Getenv("URL"),
			"deployPrimeURL": os.Getenv("DEPLOY_PRIME_URL"),
			"siteName":       os.Getenv("SITE_NAME"),
			"siteId":         os.Getenv("SITE_ID"),
		})
	})

	ginLambda = ginadapter.New(rtr)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
