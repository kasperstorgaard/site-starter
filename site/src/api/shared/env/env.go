package env

import (
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
