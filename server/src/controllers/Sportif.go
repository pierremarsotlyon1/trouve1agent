package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/tools"
)

type SportifController struct {}

func (*SportifController) UpdatePassword(c echo.Context) error {
	updatePassword := new(models.UpdatePassword)

	if err := c.Bind(updatePassword); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	//Récupération du Token
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	if err := new(metiers.SportifMetier).UpdatePassword(client, idSportif, updatePassword); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.NoContent(200)
}

func (*SportifController) UpdateProfile(c echo.Context) error {
	newSportif := new(models.Sportif)

	if err := c.Bind(newSportif); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	//Récupération du Token
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	sportif, err := new(metiers.SportifMetier).UpdateProfile(client, idSportif, newSportif)
	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.JSON(200, sportif)
}

func (*SportifController) GetProfile (c echo.Context) error {
	//Récupération du Token
	idSportif := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	sportif, err := new(metiers.SportifMetier).GetById(client, idSportif)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, sportif)
}

func (*SportifController) GetProfileById (c echo.Context) error {
	//Récupération du Token
	idSportif := c.Param("id")

	//Création du client
	client := tools.CreateElasticsearchClient()

	sportif, err := new(metiers.SportifMetier).GetById(client, idSportif)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, sportif)
}