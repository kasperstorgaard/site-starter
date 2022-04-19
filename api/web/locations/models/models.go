package models

import "github.com/kamva/mgm/v3"

type Address struct {
	Country  string `json:"country"`
	Street   string `json:"street"`
	FloorApt string `json:"floorApt"`
	Zipcode  string `json:"zipcode"`
}

type Location struct {
	mgm.DefaultModel `bson:",inline"`
	Name             string `json:"name" bson:"name"`
	// Owner            string  `json:"owner" bson: "name"`
	// Address          Address `json:"address" bson: "address"`
}

func (model *Location) Collection() *mgm.Collection {
	// Get default connection client
	_, client, _, err := mgm.DefaultConfigs()

	if err != nil {
		panic(err)
	}

	db := client.Database("locations")
	return mgm.NewCollection(db, "locations")
}

func NewLocation(name string) *Location {
	return &Location{
		Name: name,
	}
}
