package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"context"
	"agent_sportif_server/src/models"
	"errors"
	"encoding/json"
)

type SportifDao struct {}

func (*SportifDao) AddSportif(client *elastic.Client, sportif *models.Sportif) error {
	ctx := context.Background()

	result, err := client.Index().
		Index(index).
		Type("sportif").
		BodyJson(sportif.Source).
		Refresh("true").
		Do(ctx)

	if err != nil || result == nil {
		return errors.New("Erreur lors de la création de votre compte")
	}

	sportif.Id = result.Id
	sportif.Version = result.Version
	sportif.Index = result.Index
	sportif.Type = result.Type

	return nil
}

func (*SportifDao) GetByEmail(client *elastic.Client, email string) (*models.Sportif, error) {
	ctx := context.Background()

	matchQuery := elastic.NewMatchQuery("email", email)

	results, err := client.Search().
		Index(index).
		Type("sportif").
		Query(matchQuery).
		Pretty(true).
		Do(ctx)

	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	if results.Hits.TotalHits == 0 {
		return nil, errors.New("Aucun compte ne correspond à ces identifiants")
	}

	if results.Hits.TotalHits > 1 {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//On récup le premier compte
	agent_pretty := results.Hits.Hits[0]
	sportif := new(models.Sportif)

	bytes, err := json.Marshal(agent_pretty)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//On parse le json en objet
	if err_unmarshal := json.Unmarshal(bytes, &sportif); err_unmarshal != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	return sportif, nil
}

func (*SportifDao) UpdateProfile(client *elastic.Client, idSportif string, newSportif *models.Sportif) (bool, error) {
	ctx := context.Background()

	update, err := client.Update().
		Index(index).
		Type("sportif").
		Id(idSportif).
		Script(elastic.NewScriptInline(
		"ctx._source.nom = params.nom; " +
			"ctx._source.prenom = params.prenom; " +
			"ctx._source.telephone = params.telephone; ").
		Lang("painless").
		Param("nom", newSportif.Source.Nom).
		Param("prenom", newSportif.Source.Prenom).
		Param("telephone", newSportif.Source.Telephone)).
		Do(ctx)

	if err != nil || update == nil {
		return false, errors.New("Erreur lors de la mise à jour de vos informations")
	}

	return true, nil
}

func (*SportifDao) UpdatePassword (client *elastic.Client, idSportif string, newPassword string) error {
	ctx := context.Background()

	update, err := client.Update().
		Index(index).
		Type("sportif").
		Id(idSportif).
		Script(elastic.NewScriptInline("ctx._source.password = params.password;").
		Lang("painless").
		Param("password", newPassword)).
		Do(ctx)

	if err != nil || update == nil {
		return errors.New("Erreur lors de la mise à jour de vos informations")
	}

	return nil
}

func (*SportifDao) GetById(client *elastic.Client, idSportif string) (*models.Sportif, error) {
	ctx := context.Background()

	//On recherche le compte
	results, err := client.Get().
		Index(index).
		Type("sportif").
		Id(idSportif).
		Do(ctx)

	if err != nil || results == nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//Création de l'objet réponse
	sportif := new(models.Sportif)

	//On Marshal l'objet elastic
	agentUnmarshal, err := json.Marshal(results)

	//On regarde si il y a une erreur pendant le Marshal
	if err != nil || agentUnmarshal == nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	if err := json.Unmarshal(agentUnmarshal, sportif); err != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	return sportif, nil
}