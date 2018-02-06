package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"agent_sportif_server/src/controllers"
	"agent_sportif_server/src/metiers"
)

func main() {
	e := echo.New()

	//CORS
	e.Use(middleware.CORS())

	//Association des routes
	//Définition des controllers
	accountController := new(controllers.AccountController)
	agentController := new(controllers.AgentController)
	sportifController := new(controllers.SportifController)
	videoController := new(controllers.VideoController)
	contactAgentToSportifController := new(controllers.ContactAgentToSportifController)
	sportController := new(controllers.SportController)

	//Gerant Controller sans JWT
	e.POST("/login", accountController.Login)
	e.POST("/register", accountController.Register)

	//Search vidéos sans JWT
	e.GET("/search/videos", videoController.Search)
	e.GET("/search/keywords/videos", videoController.SearchByKeywords)
	e.GET("/search/sport/videos", videoController.SearchBySport)

	//Group Sport
	sportApi := e.Group("/sports")
	sportApi.GET("", sportController.Find)

	//Définition de l'api de base avec restriction JWT
	api := e.Group("/api")
	api.Use(middleware.JWT([]byte(metiers.GetSecretJwt())))

	//Contact
	contactApi := api.Group("/contact")
	contactApi.POST("/sportif", contactAgentToSportifController.ContactSportif)

	//Api pour le gérant
	gerantApi := api.Group("/agent")
	gerantApi.GET("", agentController.GetProfile)
	gerantApi.PUT("", agentController.UpdateProfile)
	gerantApi.PUT("/password", agentController.UpdatePassword)

	//Api pour le sportif
	annonceApi := api.Group("/sportif")
	annonceApi.GET("", sportifController.GetProfile)
	annonceApi.GET("/:id", sportifController.GetProfileById)
	annonceApi.PUT("", sportifController.UpdateProfile)
	annonceApi.PUT("/password", sportifController.UpdatePassword)

	//Api pour les vidéos
	videoApi := api.Group("/videos")
	videoApi.GET("", videoController.Find)
	videoApi.POST("", videoController.Add)
	videoApi.DELETE("/:id", videoController.Remove)
	videoApi.PUT("/:id", videoController.Update)
	videoApi.GET("/:id", videoController.Get)

	e.Logger.Fatal(e.Start(":1325"))
}