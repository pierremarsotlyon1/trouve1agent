package models

type Agent struct {
	HeaderElasticsearch
	Source struct {
		Nom string `json:"nom" query:"nom" form:"nom"`
		Prenom string `json:"prenom" query:"prenom" form:"prenom"`
		Email string `json:"email" query:"email" form:"email"`
		Password string `json:"password" query:"password" form:"password"`
		Telephone string `json:"telephone" query:"telephone" form:"telephone"`
		NumeroAgrement string `json:"numero_agrement" query:"numero_agrement" form:"numero_agrement"`
	} `json:"_source" query:"_source" form:"_source"`
}
