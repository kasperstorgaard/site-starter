package config

import (
	"log"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ApiURL  string `json:"apiURL"`
	Context string `json:"context"`
}

var conf *Config

// simple singleton concept to minimize reads
func init() {
	godotenv.Load()

	conf = &Config{
		ApiURL:  os.Getenv("PUBLIC_API_URL"),
		Context: os.Getenv("PUBLIC_CONTEXT"),
	}

	if conf.ApiURL == "" {
		conf.ApiURL = os.Getenv("DEPLOY_URL")
	}

	if conf.Context == "" {
		conf.Context = os.Getenv("CONTEXT")
	}
}

func IsDev() bool {
	return conf.Context == "dev"
}

func ApiURL() *url.URL {
	u, err := url.Parse(conf.ApiURL)
	if err != nil {
		log.Fatal("Invalid url for ApiURL config")
	}

	return u
}
