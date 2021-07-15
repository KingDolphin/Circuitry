package google

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/OpenCircuits/OpenCircuits/site/go/api/auth"
	"google.golang.org/api/oauth2/v2"
)

type authenticationMethod struct {
	config  oauth2Config
	service *oauth2.Service
}

// Credentials which stores google ids.
type oauth2Config struct {
	ID          string `json:"id"`
	Secret      string `json:"secret"`
	RedirectURL string `json:"redirectURL"`
}

// New Creates a new instance of the google authentication method with the provided config path
func New(configPath string) auth.AuthenticationMethod {
	file, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.Printf("File error: %v\n", err)
		panic(err)
	}

	var cred oauth2Config
	err = json.Unmarshal(file, &cred)
	if err != nil {
		log.Printf("Error unmarshalling credentials json: %v\n", err)
		panic(err)
	}

	client := &http.Client{}
	oauth2Service, err := oauth2.New(client)
	if err != nil {
		panic(err)
	}

	return authenticationMethod{
		service: oauth2Service,
		config:  cred,
	}
}

func (g authenticationMethod) ExtractIdentity(token string) (string, error) {
	// This is poorly documented, so the code for verifying a token is credit to
	// https://stackoverflow.com/a/36717411/2972004
	tokenInfo, err := g.service.Tokeninfo().IdToken(token).Do()
	if err != nil {
		return "", err
	}
	return "google_" + tokenInfo.UserId, nil
}

func (g authenticationMethod) AuthHeaderPrefix() string {
	return "google"
}
