package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"agent_sportif_server/src/models"
	"context"
	"errors"
	"encoding/json"
)

type VideoDao struct{}

func (*VideoDao) Get(client *elastic.Client, idSportif string, idVideo string) (*models.Video, error) {
	ctx := context.Background()

	result, err := client.Get().
		Index(index).
		Type("video").
		Parent(idSportif).
		Id(idVideo).
		Pretty(true).
		Do(ctx)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération de la vidéo")
	}

	video := new(models.Video)

	bytes, err := json.Marshal(result)

	if err != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	//On parse le json en objet
	if err_unmarshal := json.Unmarshal(bytes, &video); err_unmarshal != nil {
		return nil, errors.New("Erreur lors de la récupération de votre compte")
	}

	return video, nil
}

func (*VideoDao) Add(client *elastic.Client, idSportif string, video *models.Video) error {
	ctx := context.Background()

	result, err := client.Index().
		Index(index).
		Type("video").
		Parent(idSportif).
		BodyJson(video.Source).
		Refresh("true").
		Do(ctx)

	if err != nil || result == nil {
		return errors.New("Erreur lors de l'ajout de la vidéo")
	}

	video.Index = result.Index
	video.Id = result.Id
	video.Type = result.Type
	video.Version = result.Version

	return nil
}

func (*VideoDao) Find(client *elastic.Client, idSportif string, offset int) ([]*models.Video, error) {
	ctx := context.Background()

	//On fait une query avec un match_all pour récupérait toutes les vidéos du sportif
	queryMatchAll := elastic.NewTermQuery("_id", idSportif)

	//Création de la query globale
	parentQuery := elastic.NewHasParentQuery("sportif", queryMatchAll)

	results, err := client.Search().
		Index(index).
		Type("video").
		Query(parentQuery).
		From(offset).
		Sort("created_date", false).
		Pretty(true).
		Do(ctx)

	//On regarde si on a eu une erreur lors de la recherche
	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération de vos videos")
	}

	//Création du tableau de retour
	var videos []*models.Video

	//Si on a aucun résultats, on retourne le tableau vide
	if results.Hits.TotalHits == 0 {
		return videos, nil
	}

	//On parcourt les résultats pour les ajouter au tableau des videos
	for _, hit := range results.Hits.Hits {
		video := new(models.Video)

		marshal, err := json.Marshal(hit)
		if err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		//On regarde si on peut deserialiser le hit en video
		if err := json.Unmarshal(marshal, video); err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		videos = append(videos, video)
	}

	return videos, nil
}

func (*VideoDao) Remove(client *elastic.Client, idSportif string, idVideo string) error {
	ctx := context.Background()

	deleted, err := client.Delete().
		Index(index).
		Type("video").
		Id(idVideo).
		Parent(idSportif).
		Do(ctx)

	if err != nil || deleted == nil {
		return errors.New("Erreur lors de la suppression de la vidéo")
	}

	return nil
}

func (*VideoDao) Update(client *elastic.Client, idSportif string, idVideo string, video *models.Video) error {
	ctx := context.Background()

	if updated, err := client.Update().
		Index(index).
		Type("video").
		Id(idVideo).
		Parent(idSportif).
		Script(elastic.NewScriptInline("" +
		"ctx._source.keywords_sport = params.keywords_sport; " +
		"ctx._source.id_sport = params.id_sport; " +
		"ctx._source.nom_sport = params.nom_sport; " +
		"ctx._source.filename = params.filename; ").
		Lang("painless").
		Param("filename", video.Source.Filename).
		Param("id_sport", video.Source.IdSport).
		Param("nom_sport", video.Source.NomSport).
		Param("keywords_sport", video.Source.KeywordsSport)).
		Refresh("true").
		Do(ctx); updated == nil || err != nil {
		return errors.New("Erreur lors de la mise à jour de votre vidéo")
	}

	return nil
}

func (*VideoDao) Search(client *elastic.Client, offset int) ([]*models.Video, error) {
	ctx := context.Background()

	//On fait une query avec un match_all pour récupérait toutes les vidéos du sportif
	queryMatchAll := elastic.NewMatchAllQuery()

	results, err := client.Search().
		Index(index).
		Type("video").
		Query(queryMatchAll).
		From(offset).
		Sort("created_date", false).
		Pretty(true).
		Do(ctx)

	//On regarde si on a eu une erreur lors de la recherche
	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération de vos videos")
	}

	//Création du tableau de retour
	var videos []*models.Video

	//Si on a aucun résultats, on retourne le tableau vide
	if results.Hits.TotalHits == 0 {
		return videos, nil
	}

	//On parcourt les résultats pour les ajouter au tableau des videos
	for _, hit := range results.Hits.Hits {
		video := new(models.Video)

		marshal, err := json.Marshal(hit)
		if err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		//On regarde si on peut deserialiser le hit en video
		if err := json.Unmarshal(marshal, video); err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		videos = append(videos, video)
	}

	return videos, nil
}

func (*VideoDao) SearchByKeywords(client *elastic.Client, keywords string, offset int) ([]*models.Video, error) {
	ctx := context.Background()

	//On fait une query avec un match_all pour récupérait toutes les vidéos du sportif
	queryMatch := elastic.NewMatchQuery("keywords_sport", keywords)

	results, err := client.Search().
		Index(index).
		Type("video").
		Query(queryMatch).
		From(offset).
		Sort("created_date", false).
		Pretty(true).
		Do(ctx)

	//On regarde si on a eu une erreur lors de la recherche
	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération de vos videos")
	}

	//Création du tableau de retour
	var videos []*models.Video

	//Si on a aucun résultats, on retourne le tableau vide
	if results.Hits.TotalHits == 0 {
		return videos, nil
	}

	//On parcourt les résultats pour les ajouter au tableau d'annonces
	for _, hit := range results.Hits.Hits {
		video := new(models.Video)

		marshal, err := json.Marshal(hit)
		if err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		//On regarde si on peut deserialiser le hit en annonce
		if err := json.Unmarshal(marshal, video); err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		videos = append(videos, video)
	}

	return videos, nil
}

func (*VideoDao) SearchBySport(client *elastic.Client, idSport string, offset int) ([]*models.Video, error) {
	ctx := context.Background()

	//On fait une query avec un match_all pour récupérait toutes les vidéos du sportif
	queryMatch := elastic.NewMatchQuery("id_sport", idSport)

	results, err := client.Search().
		Index(index).
		Type("video").
		Query(queryMatch).
		From(offset).
		Sort("created_date", false).
		Pretty(true).
		Do(ctx)

	//On regarde si on a eu une erreur lors de la recherche
	if err != nil || results == nil || results.Hits == nil {
		return nil, errors.New("Erreur lors de la récupération de vos videos")
	}

	//Création du tableau de retour
	var videos []*models.Video

	//Si on a aucun résultats, on retourne le tableau vide
	if results.Hits.TotalHits == 0 {
		return videos, nil
	}

	//On parcourt les résultats pour les ajouter au tableau d'annonces
	for _, hit := range results.Hits.Hits {
		video := new(models.Video)

		marshal, err := json.Marshal(hit)
		if err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		//On regarde si on peut deserialiser le hit en annonce
		if err := json.Unmarshal(marshal, video); err != nil {
			return nil, errors.New("Erreur lors de la récupération de vos videos")
		}

		videos = append(videos, video)
	}

	return videos, nil
}
