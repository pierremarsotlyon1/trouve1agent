package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/tools"
)

type AgentController struct {}

func (*AgentController) UpdatePassword(c echo.Context) error {
	updatePassword := new(models.UpdatePassword)

	if err := c.Bind(updatePassword); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	//Récupération du Token
	idAgent := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	if err := new(metiers.AgentMetier).UpdatePassword(client, idAgent, updatePassword); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.NoContent(200)
}

func (*AgentController) UpdateProfile(c echo.Context) error {
	newAgent := new(models.Agent)

	if err := c.Bind(newAgent); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	//Récupération du Token
	idAgent := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	agent, err := new(metiers.AgentMetier).UpdateProfile(client, idAgent, newAgent)
	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.JSON(200, agent)
}

func (*AgentController) GetProfile (c echo.Context) error {
	//Récupération du Token
	idAgent := new(metiers.JwtMetier).GetTokenByContext(c)

	//Création du client
	client := tools.CreateElasticsearchClient()

	agent, err := new(metiers.AgentMetier).GetById(client, idAgent)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, agent)
}