package models

type ContactAgentToSportif struct {
	HeaderElasticsearch
	Source struct {
		IdAgent string `json:"id_agent" query:"id_agent" form:"id_agent"`
		IdSportif string `json:"id_sportif" query:"id_sportif" form:"id_sportif"`
		Message string `json:"message" query:"message" form:"message"`
		Date string `json:"date" query:"date" form:"date"`
	} `json:"_source" query:"_source" form:"_source"`
}
