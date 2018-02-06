package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"context"
	"errors"
)

type ContactAgentToSportifDao struct {}

func (*ContactAgentToSportifDao) Add (client *elastic.Client, idAgent string, contactAgentToSportif *models.ContactAgentToSportif) error {
	ctx := context.Background()

	result, err := client.Index().
		Index(index).
		Type("contact_agent_to_sportif").
		BodyJson(contactAgentToSportif.Source).
		Refresh("true").
		Do(ctx)

	if err != nil || result == nil {
		println(err.Error())
		return errors.New("Erreur lors de la sauvegarde du mail")
	}

	contactAgentToSportif.Id = result.Id
	contactAgentToSportif.Version = result.Version
	contactAgentToSportif.Index = result.Index
	contactAgentToSportif.Type = result.Type

	return nil
}
