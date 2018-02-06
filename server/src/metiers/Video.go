package metiers

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"errors"
	"github.com/asaskevich/govalidator"
	"strings"
	"agent_sportif_server/src/daos"
	"time"
)

type VideoMetier struct{}

func (*VideoMetier) Find(client *elastic.Client, idSportif string, offset int) ([]*models.Video, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	//On regarde si l'idSportif est bien un sportif
	isSportif := new(SportifMetier).IsSportif(client, idSportif)

	if !isSportif {
		return nil, errors.New("Vous devez être un sportif pour pouvoir ajouter une vidéo")
	}

	videos, err := new(daos.VideoDao).Find(client, idSportif, offset)

	if err != nil {
		return nil, err
	}

	return videos, nil
}

func (*VideoMetier) Add(client *elastic.Client, idSportif string, video *models.Video) error {
	if client == nil {
		return errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if video == nil {
		return errors.New("Erreur lors de la récupération des informations de la vidéo")
	}

	if len(video.Source.IdSport) == 0 {
		return errors.New("Vous devez selectionner un sport")
	}

	if len(video.Source.Filename) == 0 {
		return errors.New("Vous devez renseigner l'url Youtube de votre vidéo")
	}

	if !govalidator.IsURL(video.Source.Filename) {
		return errors.New("L'url Youtube est mal formatée")
	}

	if !strings.Contains(video.Source.Filename, "youtube") || !strings.Contains(video.Source.Filename, "watch") {
		return errors.New("L'url Youtube est mal formatée")
	}

	//On regarde si l'idSportif est bien un sportif
	isSportif := new(SportifMetier).IsSportif(client, idSportif)

	if !isSportif {
		return errors.New("Vous devez être un sportif pour pouvoir ajouter une vidéo")
	}

	//On récupère le sport
	sport, err := new(daos.SportDao).Get(client, video.Source.IdSport)

	if err != nil {
		return err
	}

	if sport == nil || len(sport.Source.NomSport) == 0 {
		return errors.New("Erreur lors de la récupération du sport")
	}

	//On ajoute la date de création
	video.Source.CreatedDate = time.Now().UTC().Format(time.RFC3339)

	//On ajoute le nom du sport
	video.Source.NomSport = sport.Source.NomSport

	//On ajoute la vidéo
	if err := new(daos.VideoDao).Add(client, idSportif, video); err != nil {
		return err
	}

	return nil
}

func (*VideoMetier) Remove(client *elastic.Client, idSportif string, idVideo string) error {
	if client == nil {
		return errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if len(idVideo) == 0 {
		return errors.New("Erreur lors de la récupération de l'identifiant de la vidéo")
	}

	//On regarde si l'idSportif est bien un sportif
	isSportif := new(SportifMetier).IsSportif(client, idSportif)

	if !isSportif {
		return errors.New("Vous devez être un sportif pour pouvoir supprimer une vidéo")
	}

	if err := new(daos.VideoDao).Remove(client, idSportif, idVideo); err != nil {
		return err
	}

	return nil
}

func (videoMetier *VideoMetier) Update(client *elastic.Client, idSportif string, idVideo string, newVideo *models.Video) (*models.Video, error) {

	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if len(idVideo) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if newVideo == nil {
		return nil, errors.New("Erreur lors de la récupération des informations de la vidéo")
	}

	if len(newVideo.Source.IdSport) == 0 {
		return nil, errors.New("Vous devez selectionner un sport")
	}

	//On regarde si l'idSportif est bien un sportif
	isSportif := new(SportifMetier).IsSportif(client, idSportif)

	if !isSportif {
		return nil, errors.New("Vous devez être un sportif pour pouvoir ajouter une vidéo")
	}

	//On récupère le sport
	sport, err := new(daos.SportDao).Get(client, newVideo.Source.IdSport)

	if err != nil {
		return nil, err
	}

	if sport == nil || len(sport.Source.NomSport) == 0 {
		return nil, errors.New("Erreur lors de la récupération du sport")
	}

	//On ajoute le nom du sport
	newVideo.Source.NomSport = sport.Source.NomSport

	//On update la vidéo
	videoDao := new(daos.VideoDao)
	if err := videoDao.Update(client, idSportif, idVideo, newVideo); err != nil {
		return nil, err
	}

	//On récupère la vidéo
	video, err := videoMetier.Get(client, idSportif, idVideo)

	if err != nil {
		return nil, err
	}

	if video == nil {
		return nil, errors.New("Erreur lors de la récupération de la vidéo")
	}

	return video, nil
}

func (*VideoMetier) Get (client *elastic.Client, idSportif string, idVideo string) (*models.Video, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	if len(idSportif) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	if len(idVideo) == 0 {
		return nil, errors.New("Erreur lors de la récupération de votre identifiant")
	}

	//On regarde si l'idSportif est bien un sportif
	isSportif := new(SportifMetier).IsSportif(client, idSportif)

	if !isSportif {
		return nil, errors.New("Vous devez être un sportif pour pouvoir ajouter une vidéo")
	}

	video, err := new(daos.VideoDao).Get(client, idSportif, idVideo)

	if err != nil {
		return nil, err
	}

	return video, nil
}

func (*VideoMetier) Search(client *elastic.Client, offset *models.Offset) ([]*models.Video, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//On fait une recherche
	videos, err := new(daos.VideoDao).Search(client, offset.Offset)

	if err != nil {
		return nil, err
	}

	return videos, nil
}

func (videoMetier *VideoMetier) SearchByKeywords(client *elastic.Client, keywords *models.Keywords, offset *models.Offset) ([]*models.Video, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//Si on a pas de keywords, alors on fait une recherche normale
	if len(keywords.Keywords) == 0 {
		return videoMetier.Search(client, offset)
	}

	//On cherche via les mot clefs
	videos, err := new(daos.VideoDao).SearchByKeywords(client, keywords.Keywords, offset.Offset)

	if err != nil {
		return nil, err
	}

	return videos, nil
}

func (videoMetier *VideoMetier) SearchBySport(client *elastic.Client, idSport string, offset *models.Offset) ([]*models.Video, error) {
	if client == nil {
		return nil, errors.New("Erreur lors de la connexion à notre base de donnée")
	}

	//Si on a pas de sport, alors on fait une recherche normale
	if len(idSport) == 0 {
		return videoMetier.Search(client, offset)
	}

	//On cherche via le sport
	videos, err := new(daos.VideoDao).SearchBySport(client, idSport, offset.Offset)

	if err != nil {
		return nil, err
	}

	return videos, nil
}
