package models

type Video struct {
	HeaderElasticsearch
	Source struct {
		Filename string `json:"filename" query:"filename" form:"filename"`
		KeywordsSport string `json:"keywords_sport" query:"keywords_sport" form:"keywords_sport"`
		IdSport string `json:"id_sport" query:"id_sport" form:"id_sport"`
		NomSport string `json:"nom_sport" query:"nom_sport" form:"nom_sport"`
		CreatedDate string `json:"created_date" query:"created_date" form:"created_date"`
	} `json:"_source" query:"_source" form:"_source"`
}
