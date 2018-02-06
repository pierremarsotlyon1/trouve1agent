package metiers

import (
	"gopkg.in/olivere/elastic.v5"
	"golang.org/x/crypto/bcrypt"
	"agent_sportif_server/src/models"
	"errors"
	"agent_sportif_server/src/daos"
)

type SportifMetier struct {}

func (*SportifMetier) UpdatePassword (client *elastic.Client, idSportif string, updatePassword *models.UpdatePassword) error {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//On regarde si on à l'id du sportif
	if len(idSportif) == 0 {
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

	if err := new(daos.SportifDao).UpdatePassword(client, idSportif, string(passwordHash)); err != nil {
		return err
	}

	return nil
}

func (sportifMetier *SportifMetier) UpdateProfile (client *elastic.Client, idSportif string, newSportif *models.Sportif) (*models.Sportif, error) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//On regarde si on à l'id du sportif
	if len(idSportif) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	//On regarde si on a les nouvelles données
	if newSportif == nil {
		return nil, errors.New("Erreur lors de la récupération des nouvelles informations")
	}

	//On update le profil
	updated, err := new(daos.SportifDao).UpdateProfile(client, idSportif, newSportif)

	//On regarde si on a eu une erreur
	if err != nil {
		return nil, err
	}

	if !updated {
		return nil, errors.New("Erreur lors de la mise à jour de votre profil")
	}

	//On récupère le nouveau profil
	sportif, err := sportifMetier.GetById(client, idSportif)

	if err != nil {
		return nil, err
	}

	return sportif, nil
}

func (*SportifMetier) GetById (client *elastic.Client, idSportif string) (*models.Sportif, error) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	return new(daos.SportifDao).GetById(client, idSportif)
}

func (*SportifMetier) IsSportif (client *elastic.Client, idSportif string) (bool) {
	//On regarde si on a la connexion à la base de donnée
	if client == nil {
		return false
	}

	if len(idSportif) == 0 {
		return false
	}

	sportif, err := new(daos.SportifDao).GetById(client, idSportif)

	if err != nil {
		return false
	}

	if sportif == nil {
		return false
	}

	return true
}