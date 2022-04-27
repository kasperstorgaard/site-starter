package config

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"path"
)

type values struct {
	ApiURL  string `json:"apiURL"`
	Context string `json:"context"`
}

type Config struct {
	values
}

// simple singleton concept to minimize reads
var instance *Config

func readConfig() *Config {
	if instance != nil {
		return instance
	}

	// Open our jsonFile
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("unable to get working dir")
	}

	var f string

	// Load the checked in dev file here
	if os.Getenv("CONTEXT") == "dev" {
		f = "dev.config.json"
	} else {
		// Or the one written in build plugin "netlify-plugins-config-functions"
		f = "config.json"
	}

	p := path.Join(dir, "../../", f)
	file, err := os.Open(p)

	if err != nil {
		log.Fatalf("unable to open file at: %s", p)
	}

	// defer the closing of our jsonFile so that we can parse it later on
	defer file.Close()

	b, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("unable to read file contents")
	}

	var result values
	err = json.Unmarshal(b, &result)
	if err != nil {
		log.Fatalf("unable to unmarshal into json: %v", b)
	}

	instance = &Config{
		result,
	}

	return instance
}

func IsDev() bool {
	return readConfig().Context == "dev"
}

func ApiURL() *url.URL {
	u, err := url.Parse(readConfig().ApiURL)
	if err != nil {
		log.Fatal("Invalid url for ApiURL config")
	}

	return u
}
