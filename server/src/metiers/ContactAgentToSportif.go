package metiers

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"errors"
	"agent_sportif_server/src/daos"
	"agent_sportif_server/src/tools"
	"time"
)

type ContactAgentToSportifMetier struct{}

func (*ContactAgentToSportifMetier) Add(client *elastic.Client, idAgent string, contactAgentToSportif *models.ContactAgentToSportif) error {
	if client == nil {
		return errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idAgent) == 0 {
		return errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if contactAgentToSportif == nil {
		return errors.New("Erreur lors de la récupération des informations de votre message")
	}

	if len(contactAgentToSportif.Source.IdSportif) == 0 {
		return errors.New("Erreur lors de la récupération du sportif")
	}

	//on regarde si c'est bien un agent
	agent, err := new(AgentMetier).GetById(client, idAgent)
	if err != nil {
		return errors.New("Vous devez être un agent pour envoyer un message à un sportif")
	}

	//On regarde si c'est bien un sportif => le destinataire
	sportif, err := new(SportifMetier).GetById(client, contactAgentToSportif.Source.IdSportif)
	if err != nil {
		return errors.New("Vous ne pouvez contacter que des sportifs")
	}

	//On ajoute la date et l'id agent
	contactAgentToSportif.Source.IdAgent = idAgent
	contactAgentToSportif.Source.Date = time.Now().UTC().Format(time.RFC3339)

	//On ajoute l'envoie de mail dans les logs
	if err := new(daos.ContactAgentToSportifDao).Add(client, idAgent, contactAgentToSportif); err != nil {
		return errors.New(err.Error())
	}

	//On construit le message à envoyer
	message := "Bonjour " + sportif.Source.Prenom + ", <br/><br/>Un agent vous a contacté, voici son message :" +
		" <br/><br/>" + contactAgentToSportif.Source.Message

	//On envoie le mail
	if err := new(tools.EmailSender).
		Send(agent.Source.Email, sportif.Source.Email, "Contact de trouve1agent.com", message); err != nil {
		return err
	}

	return nil
}
