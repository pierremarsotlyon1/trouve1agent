package models

type Offset struct {
	Offset int `json:"offset" query:"offset" form:"offset"`
}
