package metiers

import (
	"agent_sportif_server/src/models"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
)

const secretJwt = "secretMLKJDJDJDUHDSKQNLD7dJDUndmsJDIEDN65LSMS"

type JwtMetier struct {
	secret string
}

func GetSecretJwt () string {
	return secretJwt
}

func (*JwtMetier) GetTokenByContext (c echo.Context) string {
	user_temp := c.Get("user")
	if user_temp == nil {
		return ""
	}

	user := user_temp.(*jwt.Token)
	if user == nil {
		return ""
	}

	claims := user.Claims.(jwt.MapClaims)
	if claims == nil {
		return ""
	}

	return claims["id"].(string)
}

func (*JwtMetier) Encode (id string) (*models.Token, error) {
	//On regarde si on a un ID
	if len(id) == 0 {
		return nil, errors.New("Erreur lors de la récupération des informations")
	}

	//On génère le token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
	})

	//On regarde si on a un token
	if token == nil {
		return nil, errors.New("Erreur lors de la génération du token")
	}

	//On génère le string du token
	tokenString, err := token.SignedString([]byte(secretJwt))
	if err != nil {
		return nil, errors.New("Erreur lors de la génération du token")
	}

	tokenObj := new(models.Token)
	tokenObj.Token = tokenString

	return tokenObj, nil
}

func (*JwtMetier) Decode (tokenString string) (*models.Token, error) {
	//On regarde si on a un token
	if len(tokenString) == 0 {
		return nil, errors.New("Erreur lors de la récupération du token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Erreur lors de la validation de votre token")
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return secretJwt, nil
	})

	if err != nil || token == nil {
		return nil, errors.New("Erreur lors de la conversion de votre token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &models.Token{Token:claims["id"].(string)}, nil
	} else {
		return nil, errors.New("Erreur lors de la conversion de votre token")
	}
}
