package env

import (
	"fmt"
	"log"
	"net/url"
	"os"
)

func IsDev() bool {
	u, err := url.Parse(os.Getenv("API_URL"))
	if err != nil {
		log.Fatalf("unable to parse env variable")
	}

	return u.Hostname() == "localhost"
}

func ApiUrl() *url.URL {
	switch os.Getenv("CONTEXT") {
	case "deploy-preview":
		v := os.Getenv("DEPLOY_URL")

		// Special case/bug for deploy preview here,
		// instead building what should have been set for us already
		if v == "" {
			v := os.Getenv("DEPLOY_PRIME_URL")
			u, err := url.Parse(v)
			if err != nil {
				log.Fatalf("unable to parse environment variable DEPLOY_PRIME_URL")
			}
			u.Host = fmt.Sprintf("%s--%s", os.Getenv("DEPLOY_ID"), u.Host)
			return u
		}

		u, err := url.Parse(v)
		if err != nil {
			log.Fatalf("unable to parse environment variable  DEPLOY_URL")
		}
		return u
	case "branch-deploy":
		v := os.Getenv("DEPLOY_PRIME_URL")
		u, err := url.Parse(v)
		if err != nil {
			log.Fatalf("unable to parse environment variable  DEPLOY_PRIME_URL")
		}
		return u
	case "production":
		v := os.Getenv("URL")
		u, err := url.Parse(v)
		if err != nil {
			log.Fatalf("unable to parse environment variable URL")
		}
		return u
	default:
		v := os.Getenv("DEPLOY_URL")
		u, err := url.Parse(v)
		if err != nil {
			log.Fatalf("unable to parse environment variable DEPLOY_URL")
		}
		return u
	}
}
