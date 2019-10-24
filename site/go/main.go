package main

import (
	"flag"
	"github.com/OpenCircuits/OpenCircuits/site/go/api"
	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/auth/google"
	"github.com/OpenCircuits/OpenCircuits/site/go/core"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/interfaces"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/utils"
	"github.com/OpenCircuits/OpenCircuits/site/go/storage"
	"github.com/OpenCircuits/OpenCircuits/site/go/storage/sqlite"
	"github.com/OpenCircuits/OpenCircuits/site/go/web"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

func main() {
	var err error

	// Parse flags
	googleAuthConfig := flag.String("google_auth", "", "<path-to-config>; Enables google sign-in API login")
	noAuthConfig := flag.Bool("no_auth", false, "Enables username-only authentication for testing and development")
	userCsifConfig := flag.String("interface", "sqlite", "The storage interface")
	sqlitePathConfig := flag.String("sqlitePath", "data/sql/sqlite", "The path to the sqlite working directory")
	ipAddressConfig := flag.String("ip_address", "0.0.0.0", "IP address of server")
	portConfig := flag.String("port", "8080", "Port to serve application")
	flag.Parse()

	// Register authentication method
	authManager := auth.AuthenticationManager{}
	if *googleAuthConfig != "" {
		authManager.RegisterAuthenticationMethod(google.New(*googleAuthConfig))
	}
	if *noAuthConfig {
		authManager.RegisterAuthenticationMethod(auth.NewNoAuth())
	}

	// Set up the storage interface
	var userCsif interfaces.CircuitStorageInterfaceFactory
	if *userCsifConfig == "mem" {
		userCsif = storage.NewMemStorageInterfaceFactory()
	} else if *userCsifConfig == "sqlite" {
		userCsif, err = sqlite.NewInterfaceFactory(*sqlitePathConfig)
		core.CheckErrorMessage(err, "Failed to load sqlite instance:")
	}

	// Create the example circuit storage interface
	exampleCsif := storage.NewExampleCircuitStorageInterfaceFactory("./examples/examples.json")

	// Route through Gin
	router := gin.Default()
	router.Use(gin.Recovery())

	// Generate CSRF Token...
	store := sessions.NewCookieStore([]byte(utils.RandToken(64)))
	store.Options(sessions.Options{
		Path:   "/",
		MaxAge: 60 * 60 * 24 * 7,
	})
	router.Use(sessions.Sessions("opencircuitssession", store))

	// Register pages
	web.RegisterPages(router, authManager, exampleCsif)
	authManager.RegisterHandlers(router)
	api.RegisterRoutes(router, authManager, exampleCsif, userCsif)

	router.Run(*ipAddressConfig + ":" + *portConfig)
}
