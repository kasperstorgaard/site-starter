package mongodb

import (
	"fmt"
	"os"
)

func BuildURI() string {
	return fmt.Sprintf(
		"mongodb+srv://%s:%s@%s",
		os.Getenv("MONGODB_USERNAME"),
		os.Getenv("MONGODB_PASSWORD"),
		os.Getenv("MONGODB_CLUSTER"),
	)
}
