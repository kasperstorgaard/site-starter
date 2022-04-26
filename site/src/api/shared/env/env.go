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

// TODO: figure out why netlify DEPLOY_URL is not reliably usable in deploy preview context?
func ApiUrl() *url.URL {
	switch os.Getenv("CONTEXT") {
	case "branch-deploy":
		v := os.Getenv("DEPLOY_PRIME_URL")
		u, err := url.Parse(v)
		if err != nil {
			log.Fatalf("unable to parse environment variable DEPLOY_PRIME_URL")
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
		u, err := url.Parse(os.Getenv("DEPLOY_URL"))
		if err != nil {
			log.Fatalf("unable to parse environment variable DEPLOY_URL")
		}

		// primary fallback
		if u.String() == "" {
			u, err = url.Parse(os.Getenv("DEPLOY_PRIME_URL"))
			if err != nil {
				log.Fatalf("unable to parse environment variable DEPLOY_PRIME_URL")
			}
			id := os.Getenv("DEPLOY_ID")
			if id != "" {
				u.Host = fmt.Sprintf("%s--%s", id, u.Host)
			}
		}

		// secondary fallback
		if u.String() == "" {
			u, err = url.Parse(os.Getenv("URL"))
			if err != nil {
				log.Fatalf("unable to get environment variable URL")
			}
		}

		return u
	}
}
