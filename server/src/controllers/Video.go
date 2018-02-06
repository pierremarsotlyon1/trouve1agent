package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/tools"
)

type VideoController struct {}

func (*VideoController) Get (c echo.Context) error {
	//On récup l'id sportif
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//On récup l'id de la vidéo
	idVideo := c.Param("id")

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	video, err := new(metiers.VideoMetier).Get(client, idSportif, idVideo)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, video)
}

func (*VideoController) Find(c echo.Context) error {
	offset := new(models.Offset)

	if err := c.Bind(offset); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:"Erreur lors de la récupération de l'offset"})
	}

	//On récup l'id sportif
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	videos, err := new(metiers.VideoMetier).Find(client, idSportif, offset.Offset)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.JSON(200, videos)
}

func (*VideoController) Add(c echo.Context) error {
	video := new(models.Video)

	if err := c.Bind(video); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération des informations de la vidéo"})
	}

	//On récup l'id sportif
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	if err := new(metiers.VideoMetier).Add(client, idSportif, video); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, video)
}

func (*VideoController) Remove(c echo.Context) error {
	//On récup l'id de la video
	idVideo := c.Param("id")

	//On récup l'id sportif
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	err := new(metiers.VideoMetier).Remove(client, idSportif, idVideo)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.NoContent(200)
}

func (*VideoController) Update(c echo.Context) error {
	newVideo := new(models.Video)

	if err := c.Bind(newVideo); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération des nouvelles informations de la video"})
	}

	idVideo := c.Param("id")

	//On récup l'id sportif
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	video, err := new(metiers.VideoMetier).Update(client, idSportif, idVideo, newVideo)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, video)
}

func (*VideoController) Search(c echo.Context) error {
	offset := new(models.Offset)

	if err := c.Bind(offset); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération de l'offset"})
	}

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	videos, err := new(metiers.VideoMetier).Search(client, offset)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, videos)
}

func (*VideoController) SearchByKeywords(c echo.Context) error {
	offset := new(models.Offset)

	if err := c.Bind(offset); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération de l'offset"})
	}

	keywords := new(models.Keywords)

	if err := c.Bind(keywords); err != nil {
		return c.JSON(403, models.JsonErrorResponse{ Error: "Erreur lors de la récupération des mots clefs"})
	}

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	videos, err := new(metiers.VideoMetier).SearchByKeywords(client, keywords, offset)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, videos)
}

func (*VideoController) SearchBySport(c echo.Context) error {
	offset := new(models.Offset)

	if err := c.Bind(offset); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération de l'offset"})
	}

	idSport := c.QueryParam("id_sport")

	//Création du client elasticsearch
	client := tools.CreateElasticsearchClient()

	videos, err := new(metiers.VideoMetier).SearchBySport(client, idSport, offset)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, videos)
}
