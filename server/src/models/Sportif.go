package models

type Sportif struct {
	HeaderElasticsearch
	Source struct {
		Nom string `json:"nom" query:"nom" form:"nom"`
		Prenom string `json:"prenom" query:"prenom" form:"prenom"`
		Email string `json:"email" query:"email" form:"email"`
		Password string `json:"password" query:"password" form:"password"`
		Telephone string `json:"telephone" query:"telephone" form:"telephone"`
	} `json:"_source" query:"_source" form:"_source"`
}
