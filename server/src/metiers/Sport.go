package metiers

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/daos"
	"errors"
)

type SportMetier struct {}

func (*SportMetier) Find (client *elastic.Client) ([]*models.Sport, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	sports, err := new(daos.SportDao).Find(client)

	if err != nil {
		return nil, err
	}

	return sports, nil
}

func (*SportMetier) Get (client *elastic.Client, idSport string) (*models.Sport, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSport) == 0 {
		return nil, errors.New("Erreur lors de la récupération de l'identifiant du sport")
	}

	sport, err := new(daos.SportDao).Get(client, idSport)

	if err != nil {
		return nil, err
	}

	return sport, nil
}