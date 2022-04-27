package config

import (
	"log"
	"net/url"
	"os"
)

type Config struct {
	ApiURL  string `json:"apiURL"`
	Context string `json:"context"`
}

var conf *Config

// simple singleton concept to minimize reads
func init() {
	conf = &Config{
		ApiURL:  os.Getenv("DEPLOY_URL"),
		Context: os.Getenv("CONTEXT"),
	}

	// Placeholder values, to be replaced at build time.
	// TODO: find a better way
	// Would _love_ for there to be a better/easier way to do this in netlify
	// with environment variables, but there doesn't seem to be any bc. of a
	// aws lambda env variables size restriction.
	if os.Getenv("CONTEXT") != "dev" {
		conf.ApiURL = "$$API_URL"
		conf.Context = "$$CONTEXT"
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
