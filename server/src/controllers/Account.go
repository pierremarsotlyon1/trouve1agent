package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/tools"
)

type AccountController struct {}

func (*AccountController) Login (c echo.Context) error {
	login := new(models.Login)

	if err := c.Bind(login); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération des informations"})
	}

	//Création du client
	client := tools.CreateElasticsearchClient()

	token, typeAccount, err := new(metiers.UserMetier).Login(client, login)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	if token == nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération du token"})
	}

	return c.JSON(200, models.ResponseLoginOrRegister{
		Type: typeAccount,
		Token: token.Token,
	})
}

func (*AccountController) Register (c echo.Context) error {
	register := new(models.Register)

	if err := c.Bind(register); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération des informations"})
	}

	//Création du client
	client := tools.CreateElasticsearchClient()

	token, typeAccount, err := new(metiers.UserMetier).Register(client, register)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	if token == nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération du token"})
	}

	return c.JSON(200, models.ResponseLoginOrRegister{
		Type: typeAccount,
		Token: token.Token,
	})
}
