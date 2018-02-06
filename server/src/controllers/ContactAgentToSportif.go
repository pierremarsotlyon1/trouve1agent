package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/models"
	"agent_sportif_server/src/tools"
)

type ContactAgentToSportifController struct {}

func (*ContactAgentToSportifController) ContactSportif (c echo.Context) error {
	//Récupération du Token
	idAgent := new(metiers.JwtMetier).GetTokenByContext(c)

	//On bind les infos du formulaire
	contactSportifByAgent := new(models.ContactAgentToSportif)

	if err := c.Bind(contactSportifByAgent); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: "Erreur lors de la récupération des informations du formulaire"})
	}

	//Création du client
	client := tools.CreateElasticsearchClient()

	if err := new(metiers.ContactAgentToSportifMetier).Add(client, idAgent, contactSportifByAgent); err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error:err.Error()})
	}

	return c.NoContent(200)
}
