package metiers

import (
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/olivere/elastic.v5"
	"github.com/asaskevich/govalidator"
	"agent_sportif_server/src/models"
	"errors"
	"agent_sportif_server/src/daos"
)

type UserMetier struct{}

func (*UserMetier) UserExist(client *elastic.Client, email string) (bool, error) {
	if len(email) == 0 {
		return true, errors.New("Erreur lors de la récupération de l'email")
	}

	//On regarde si c'est un email valide
	if !govalidator.IsEmail(email) {
		return true, errors.New("L'email n'est pas au bon format")
	}

	exist, err := new(daos.UserDao).UserExist(client, email)

	if err != nil {
		return true, err
	}

	return exist, nil
}

func (*UserMetier) Login(client *elastic.Client, login *models.Login) (*models.Token, int, error) {
	//On regarde si on a bien un pointer ur gerant
	if login == nil {
		return nil, 0, errors.New("Erreur lors de la récupération de vos informations de connexion")
	}

	//On regare si on a le mot de passe
	if len(login.Password) == 0 {
		return nil, 0, errors.New("Erreur lors de la récupération de votre mot de passe")
	}

	//On regarde si on a un email
	if len(login.Email) == 0 {
		return nil, 0, errors.New("Erreur lors de la récupération de votre email")
	}

	//On regarde si c'est un email valide
	if !govalidator.IsEmail(login.Email) {
		return nil, 0, errors.New("L'email n'est pas valide")
	}

	agent, err := new(daos.AgentDao).GetByEmail(client, login.Email)

	//On regarde si on a un compte agent
	if agent != nil && err == nil {

		//On regarde si on a le mot de passe du gérant stocké en BDD
		if len(agent.Source.Password) == 0 {
			return nil, 0, errors.New("Erreur lors de la récupération de votre mot de passe dans notre base de donnée")
		}

		//On regarde si le password de l'agent = passwordHash => sinon problème
		if err := bcrypt.CompareHashAndPassword([]byte(agent.Source.Password), []byte(login.Password)); err != nil {
			return nil, 0, errors.New("Erreur lors de la récupération de votre compte")
		}

		token, err := new(JwtMetier).Encode(agent.Id)
		if err != nil {
			return nil, 0, errors.New("Erreur lors de la création du token de connexion")
		}

		return token, 2, nil

	} else if agent == nil && err != nil {
		sportif, err := new(daos.SportifDao).GetByEmail(client, login.Email)

		//Si on a une erreur, c'est qu'on a pas pu récupérer un compte (sportif ou agent)
		if err != nil {
			return nil, 0, err
		}

		if sportif == nil {
			return nil, 0, errors.New("Erreur lors de la récupération de votre compte")
		}

		//On regarde si on a le mot de passe du gérant stocké en BDD
		if len(sportif.Source.Password) == 0 {
			return nil, 0, errors.New("Erreur lors de la récupération de votre mot de passe dans notre base de donnée")
		}

		//On regarde si le password du sportif = passwordHash => sinon problème
		if err := bcrypt.CompareHashAndPassword([]byte(sportif.Source.Password), []byte(login.Password)); err != nil {
			return nil, 0, errors.New("Erreur lors de la récupération de votre compte")
		}

		token, err := new(JwtMetier).Encode(sportif.Id)
		if err != nil {
			return nil, 0, errors.New("Erreur lors de la création du token de connexion")
		}

		return token, 1, nil

	} else {
		return nil, 0, errors.New("Erreur inconnue")
	}
}

func (userMetier *UserMetier) Register(client *elastic.Client, register *models.Register) (*models.Token, int, error) {

	//On regarde si on a la struct
	if register == nil {
		return nil, 0, errors.New("Erreur lors de la récupération de vos informations")
	}

	//On regarde si on a un email
	if len(register.Email) == 0 {
		return nil, 0, errors.New("Erreur lors de la récupération de l'email")
	}

	//On regarde si c'est un email valide
	if !govalidator.IsEmail(register.Email) {
		return nil, 0, errors.New("L'email n'est pas au bon format")
	}

	//On regarde si on a un nom
	if len(register.Nom) == 0 {
		return nil, 0, errors.New("Vous devez saisir un nom")
	}

	if len(register.Prenom) == 0 {
		return nil, 0, errors.New("Vous devez saisir un prénom")
	}

	if len(register.Telephone) != 10 {
		return nil, 0, errors.New("Le numéro de telephone n'est pas correct")
	}

	if !govalidator.IsNumeric(register.Telephone) {
		return nil, 0, errors.New("Votre numéro de telephone doit contenir que des chiffres")
	}

	//On regarde si on a pas déjà un user avec ces infos
	exist, err := userMetier.UserExist(client, register.Email)

	if err != nil {
		return nil, 0, err
	}

	if exist {
		return nil, 0, errors.New("Un compte avec ces identifiant existe déjà")
	}

	//On regarde si on a un password
	if len(register.Password) == 0 {
		return nil, 0, errors.New("Erreur lors de la récupération de votre mot de passe")
	}

	//On regarde si on a la confirmation du mot de passe
	if len(register.ConfirmPassword) == 0 {
		return nil, 0, errors.New("Erreur lors de la récupération de la confirmation du mot de passe")
	}

	//On regarde si le mot de passe == confirm password
	if register.Password != register.ConfirmPassword {
		return nil, 0, errors.New("Votre mot de passe doit être identique à la confirmation du mot de passe")
	}

	//On hash le mot de passe
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, 0, errors.New("Erreur lors de la sécurisation de votre mot de passe")
	}

	//On regarde quel type de compte on doit créer
	switch register.Type {
	//Un sportif
	case 1:
		//Création du sportif
		sportif := new(models.Sportif)
		sportif.Source.Telephone = register.Telephone
		sportif.Source.Email = register.Email
		sportif.Source.Prenom = register.Prenom
		sportif.Source.Nom = register.Nom
		sportif.Source.Password = string(passwordHash)

		if err := new(daos.SportifDao).AddSportif(client, sportif); err != nil {
			return nil, 0, err
		}

		tokenObj, err := new(JwtMetier).Encode(sportif.Id)
		if err != nil {
			return nil, 0, err
		}

		return tokenObj, 1, nil

	case 2:
		if len(register.NumeroAgrement) == 0 {
			return nil, 0, errors.New("Vous devez saisir un numéro d'agrément")
		}

		//Création de l'agent
		agent := new(models.Agent)
		agent.Source.Telephone = register.Telephone
		agent.Source.Email = register.Email
		agent.Source.Prenom = register.Prenom
		agent.Source.Nom = register.Nom
		agent.Source.Password = string(passwordHash)
		agent.Source.NumeroAgrement = register.NumeroAgrement

		if err := new(daos.AgentDao).AddAgent(client, agent); err != nil {
			return nil, 0, err
		}

		tokenObj, err := new(JwtMetier).Encode(agent.Id)
		if err != nil {
			return nil, 0, err
		}

		return tokenObj, 2, nil
	default:
		return nil, 0, errors.New("Erreur lors de la récupération du type de compte")
	}
}
