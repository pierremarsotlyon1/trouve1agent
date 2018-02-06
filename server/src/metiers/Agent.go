package metiers

import (
	"gopkg.in/olivere/elastic.v5"
	"golang.org/x/crypto/bcrypt"
	"agent_sportif_server/src/models"
	"errors"
	"agent_sportif_server/src/daos"
)

type AgentMetier struct {}

func (*AgentMetier) UpdatePassword (client *elastic.Client, idAgent string, updatePassword *models.UpdatePassword) error {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//On regarde si on à l'id du gérant
	if len(idAgent) == 0 {
		return errors.New("Erreur lors de la récupération de votre identifiant")
	}

	//On regarde si on a les nouvelles données
	if updatePassword == nil {
		return errors.New("Erreur lors de la récupération du nouveau mot de passe")
	}

	//On regarde si on a les mots de passe
	if len(updatePassword.NewPassword) == 0 {
		return errors.New("Erreur lors de la récupération du nouveau mot de passe")
	}

	if len(updatePassword.ConfirmNewPassword) == 0 {
		return errors.New("Erreur lors de la récupération de la confirmation du mot de passe")
	}

	//On regarde si les mot de passe sont identiques
	if updatePassword.NewPassword != updatePassword.ConfirmNewPassword {
		return errors.New("Vos mots de passe doivent être identique")
	}

	//On hash le mot de passe
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(updatePassword.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("Erreur lors de la sécurisation de votre mot de passe")
	}

	if err := new(daos.AgentDao).UpdatePassword(client, idAgent, string(passwordHash)); err != nil {
		return err
	}

	return nil
}

func (agentMetier *AgentMetier) UpdateProfile (client *elastic.Client, idAgent string, newAgent *models.Agent) (*models.Agent, error) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//On regarde si on à l'id de l'agent
	if len(idAgent) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	//On regarde si on a les nouvelles données
	if newAgent == nil {
		return nil, errors.New("Erreur lors de la récupération des nouvelles informations")
	}

	//On update le profil
	updated, err := new(daos.AgentDao).UpdateProfile(client, idAgent, newAgent)

	//On regarde si on a eu une erreur
	if err != nil {
		return nil, err
	}

	if !updated {
		return nil, errors.New("Erreur lors de la mise à jour de votre profil")
	}

	//On récupère le nouveau profil
	agent, err := agentMetier.GetById(client, idAgent)

	if err != nil {
		return nil, err
	}

	return agent, nil
}

func (*AgentMetier) GetById (client *elastic.Client, idAgent string) (*models.Agent, error) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idAgent) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	return new(daos.AgentDao).GetById(client, idAgent)
}

func (*AgentMetier) IsAgent (client *elastic.Client, idAgent string) (bool) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return false
	}

	if len(idAgent) == 0 {
		return false
	}

	agent, err := new(daos.AgentDao).GetById(client, idAgent)

	if err != nil {
		return false
	}

	if agent == nil {
		return false
	}

	return true
}