package models

type Sport struct {
	HeaderElasticsearch
	Source struct {
		NomSport string `json:"nom_sport" query:"nom_sport" form:"nom_sport"`
	} `json:"_source" query:"_source" form:"_source"`
}
