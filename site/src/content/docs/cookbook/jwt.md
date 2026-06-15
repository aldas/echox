---
title: JWT
description: Authenticate requests with JSON Web Tokens using the echo-jwt middleware.
sidebar:
  order: 11
---

This recipe demonstrates JWT authentication with Echo using the
[`echo-jwt`](https://github.com/labstack/echo-jwt) middleware:

- JWT authentication using the HS256 algorithm.
- The token is read from the `Authorization` request header.

See the [JWT middleware](/middleware/jwt/) page for full configuration options.

## Server

### Using custom claims

Define a claims type that embeds `jwt.RegisteredClaims`, then point the middleware
at it with `NewClaimsFunc`. Inside the restricted handler, retrieve the parsed token
from the context with the generic `echo.ContextGet`.

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type jwtCustomClaims struct {
	Name  string `json:"name"`
	Admin bool   `json:"admin"`
	jwt.RegisteredClaims
}

func login(c *echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	// Throws unauthorized error
	if username != "jon" || password != "shhh!" {
		return echo.ErrUnauthorized
	}

	// Set custom claims
	claims := &jwtCustomClaims{
		"Jon Snow",
		true,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}

func accessible(c *echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c *echo.Context) error {
	token, err := echo.ContextGet[*jwt.Token](c, "user")
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}
	claims := token.Claims.(*jwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// Login route
	e.POST("/login", login)

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")

	// Configure middleware with the custom claims type
	config := echojwt.Config{
		NewClaimsFunc: func(c *echo.Context) jwt.Claims {
			return new(jwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("", restricted)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### Using a user-defined KeyFunc

When tokens are signed by an external identity provider, supply a `KeyFunc` that
resolves the signing key dynamically. This example validates tokens issued by
Google Sign-In by fetching Google's public key set.

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	echojwt "github.com/labstack/echo-jwt/v5"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/lestrrat-go/jwx/v3/jwk"
)

func getKey(token *jwt.Token) (any, error) {

	// For a demonstration purpose, Google Sign-in is used.
	// https://developers.google.com/identity/sign-in/web/backend-auth
	//
	// This user-defined KeyFunc verifies tokens issued by Google Sign-In.
	//
	// Note: In this example, it downloads the keyset every time the restricted route is accessed.
	keySet, err := jwk.Fetch(context.Background(), "https://www.googleapis.com/oauth2/v3/certs")
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have a key ID in the kid field")
	}

	key, found := keySet.LookupKeyID(keyID)

	if !found {
		return nil, fmt.Errorf("unable to find key %q", keyID)
	}

	return key.PublicKey()
}

func accessible(c *echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c *echo.Context) error {
	user, err := echo.ContextGet[*jwt.Token](c, "user")
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")
	{
		config := echojwt.Config{
			KeyFunc: getKey,
		}
		r.Use(echojwt.WithConfig(config))
		r.GET("", restricted)
	}

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

:::caution
Fetching the key set on every request, as shown above, is for demonstration only.
In production, cache the key set and refresh it periodically.
:::

## Client

### Login

Log in with a username and password to retrieve a token.

```sh
curl -X POST -d 'username=jon' -d 'password=shhh!' localhost:1323/login
```

Response:

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"
}
```

### Request

Request a restricted resource using the token in the `Authorization` request header.

```sh
curl localhost:1323/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"
```

Response:

```sh
Welcome Jon Snow!
```
