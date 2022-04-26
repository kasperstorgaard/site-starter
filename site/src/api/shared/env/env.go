package env

import "os"

func IsDev() bool {
	return os.Getenv("CONTEXT") == "dev"
}
