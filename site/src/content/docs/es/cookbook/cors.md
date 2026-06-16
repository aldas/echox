---
title: CORS
description: Habilita Cross-Origin Resource Sharing con una allow list o una función de origin personalizada.
sidebar:
  order: 4
---

El [middleware CORS](/es/middleware/cors/) controla qué origins pueden acceder a tu API.
Puedes pasar una lista fija de origins permitidos o proporcionar una función que decida
por request.

## Allow list de origins

Pasa los origins permitidos directamente a `middleware.CORS`.

```go
package main

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c *echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// CORS default
	// Allows requests from any origin wth GET, HEAD, PUT, POST or DELETE method.
	// e.Use(middleware.CORS("*"))

	// CORS restricted
	// Allows requests from any `https://labstack.com` or `https://labstack.net` origin
	e.Use(middleware.CORS("https://labstack.com", "https://labstack.net"))

	e.GET("/api/users", getUsers)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Función de origin personalizada

Para policies dinámicas, usa `CORSWithConfig` con `UnsafeAllowOriginFunc`. La
función recibe el contexto del request y el origin, y devuelve el origin que se debe
reflejar, si el request está permitido y un error opcional.

```go
package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c *echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

// allowOrigin takes the origin as an argument and returns:
// - origin to add to the response Access-Control-Allow-Origin header
// - whether the request is allowed or not
// - an optional error. this will stop handler chain execution and return an error response.
//
// return origin, true, err  // blocks request with error
// return origin, true, nil  // allows CSRF request through
// return origin, false, nil // falls back to legacy token logic
func allowOrigin(c *echo.Context, origin string) (string, bool, error) {
	// In this example we use a naive suffix check but we can imagine various
	// kind of custom logic. For example, an external datasource could be used
	// to maintain the list of allowed origins.
	if strings.HasSuffix(origin, ".example.com") {
		return origin, true, nil
	}
	return "", false, nil
}

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// CORS restricted with a custom function to allow origins
	// and with the GET, PUT, POST or DELETE methods allowed.
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		UnsafeAllowOriginFunc: allowOrigin,
		AllowMethods:          []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.GET("/api/users", getUsers)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
