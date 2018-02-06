package models

type Register struct {
	Nom string `json:"nom" query:"nom" form:"nom"`
	Prenom string `json:"prenom" query:"prenom" form:"prenom"`
	Email string `json:"email" query:"email" form:"email"`
	Password string `json:"password" query:"password" form:"password"`
	ConfirmPassword string `json:"confirm_password" query:"confirm_password" form:"confirm_password"`
	Telephone string `json:"telephone" query:"telephone" form:"telephone"`
	Type int `json:"type" query:"type" form:"type"`
	NumeroAgrement string `json:"numero_agrement" query:"numero_agrement" form:"numero_agrement"`
}

type ResponseLoginOrRegister struct {
	Token string `json:"token" query:"token" form:"token"`
	Type int `json:"type" query:"type" form:"type"`
}