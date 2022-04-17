package main

import (
	"encoding/gob"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"site-starter/api/shared/authenticator"
	authRouter "site-starter/api/web/auth/router"
	usersRouter "site-starter/api/web/users"
)

type routes struct {
	router *gin.Engine
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Failed to load the env vars: %v", err)
	}

	rtr := gin.Default()

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})

	store := cookie.NewStore([]byte("secret"))
	rtr.Use(sessions.Sessions("auth-session", store))

	auth, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	api := rtr.Group("/api")

	authRouter.AddRoutes(api, auth)
	usersRouter.AddRoutes(api, auth)

	log.Print("Server listening on http://localhost:3003/")
	if err := http.ListenAndServe("0.0.0.0:3003", rtr); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
}
