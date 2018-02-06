package controllers

import (
	"github.com/labstack/echo"
	"agent_sportif_server/src/metiers"
	"agent_sportif_server/src/tools"
	"agent_sportif_server/src/models"
)

type SportController struct {}

func (*SportController) Find (c echo.Context) error {
	client := tools.CreateElasticsearchClient()

	sports, err := new(metiers.SportMetier).Find(client)

	if err != nil {
		return c.JSON(403, models.JsonErrorResponse{Error: err.Error()})
	}

	return c.JSON(200, sports)
}
