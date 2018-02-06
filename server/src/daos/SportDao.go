package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"context"
	"errors"
	"encoding/json"
)

type SportDao struct{}

func (*SportDao) Find(client *elastic.Client) ([]*models.Sport, error) {
	ctx := context.Background()

	results, err := client.Search().
		Index(index).
		Type("sports").
		Size(250).
		Pretty(true).
		Do(ctx)

	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération des sports")
	}

	//Création du tableau de retour
	var sports []*models.Sport

	//Si on a aucun résultats, on retourne le tableau vide
	if results.Hits.TotalHits == 0 {
		return sports, nil
	}

	//On parcourt les résultats pour les ajouter au tableau des videos
	for _, hit := range results.Hits.Hits {
		sport := new(models.Sport)

		marshal, err := json.Marshal(hit)
		if err != nil {
			return nil, errors.New("Erreur lors de la récupération des sports")
		}

		//On regarde si on peut deserialiser le hit en video
		if err := json.Unmarshal(marshal, sport); err != nil {
			return nil, errors.New("Erreur lors de la récupération des sports")
		}

		sports = append(sports, sport)
	}

	return sports, nil
}

func (*SportDao) Get (client * elastic.Client, idSport string) (*models.Sport, error) {
	ctx := context.Background()

	result, err := client.Get().
		Index(index).
		Type("sports").
		Id(idSport).
		Pretty(true).
		Do(ctx)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération du sport")
	}

	sport := new(models.Sport)

	bytes, err := json.Marshal(result)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération du sport")
	}

	//On parse le json en objet
	if err_unmarshal := json.Unmarshal(bytes, &sport); err_unmarshal != nil {
		return nil, errors.New("Erreur lors de la récupération du sport")
	}

	return sport, nil
}