package daos

import (
	"gopkg.in/olivere/elastic.v5"
	"errors"
	"context"
)

const index = "agentsportif"

type UserDao struct{}

func (*UserDao) UserExist(client *elastic.Client, email string) (bool, error) {
	ctx := context.Background()

	matchQuery := elastic.NewMatchQuery("email", email)

	count, err := client.Count().
		Index(index).
		Type("agent", "sportif").
		Query(matchQuery).
		Pretty(true).
		Do(ctx)

	if err != nil {
		return false, errors.New("Erreur lors de la vérification d'un compte existant")
	}

	if count == 0 {
		return false, nil
	}

	return true, nil
}
