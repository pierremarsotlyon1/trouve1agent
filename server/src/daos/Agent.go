package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"context"
	"errors"
	"encoding/json"
)

type AgentDao struct{}

func (*AgentDao) AddAgent(client *elastic.Client, agent *models.Agent) error {
	ctx := context.Background()

	result, err := client.Index().
		Index(index).
		Type("agent").
		BodyJson(agent.Source).
		Refresh("true").
		Do(ctx)

	if err != nil || result == nil {
		return errors.New("Erreur lors de la création de votre compte")
	}

	agent.Id = result.Id
	agent.Version = result.Version
	agent.Index = result.Index
	agent.Type = result.Type

	return nil
}

func (*AgentDao) GetByEmail(client *elastic.Client, email string) (*models.Agent, error) {
	ctx := context.Background()

	matchQuery := elastic.NewMatchQuery("email", email)

	results, err := client.Search().
		Index(index).
		Type("agent").
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
	agent := new(models.Agent)

	bytes, err := json.Marshal(agent_pretty)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//On parse le json en objet
	err_unmarshal := json.Unmarshal(bytes, &agent)
	if err_unmarshal != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	return agent, nil
}

func (*AgentDao) UpdateProfile(client *elastic.Client, idAgent string, newAgent *models.Agent) (bool, error) {
	ctx := context.Background()

	update, err := client.Update().
		Index(index).
		Type("agent").
		Id(idAgent).
		Script(elastic.NewScriptInline(
		"ctx._source.nom = params.nom; " +
			"ctx._source.prenom = params.prenom; " +
			"ctx._source.telephone = params.telephone; "+
			"ctx._source.numero_agrement = params.numero_agrement; ").
		Lang("painless").
		Param("nom", newAgent.Source.Nom).
		Param("prenom", newAgent.Source.Prenom).
		Param("numero_agrement", newAgent.Source.NumeroAgrement).
		Param("telephone", newAgent.Source.Telephone)).
		Do(ctx)

	if err != nil || update == nil {
		return false, errors.New("Erreur lors de la mise à jour de vos informations")
	}

	return true, nil
}

func (*AgentDao) UpdatePassword (client *elastic.Client, idAgent string, newPassword string) error {
	ctx := context.Background()

	update, err := client.Update().
		Index(index).
		Type("agent").
		Id(idAgent).
		Script(elastic.NewScriptInline("ctx._source.password = params.password;").
		Lang("painless").
		Param("password", newPassword)).
		Do(ctx)

	if err != nil || update == nil {
		return errors.New("Erreur lors de la mise à jour de vos informations")
	}

	return nil
}

func (*AgentDao) GetById(client *elastic.Client, idAgent string) (*models.Agent, error) {
	ctx := context.Background()

	//On recherche le compte
	results, err := client.Get().
		Index(index).
		Type("agent").
		Id(idAgent).
		Do(ctx)

	if err != nil || results == nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//Création de l'objet réponse
	agent := new(models.Agent)

	//On Marshal l'objet elastic
	agentUnmarshal, err := json.Marshal(results)

	//On regarde si il y a une erreur pendant le Marshal
	if err != nil || agentUnmarshal == nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	if err := json.Unmarshal(agentUnmarshal, agent); err != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	return agent, nil
}