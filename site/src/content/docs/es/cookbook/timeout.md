---
title: Timeout
description: Aplica un timeout de request a handlers con el middleware ContextTimeout.
sidebar:
  order: 18
---

El middleware [`ContextTimeout`](/es/middleware/context-timeout/) establece un deadline en el
`context.Context` del request. Cuando el deadline vence, el contexto se cancela, y los handlers
que observan `c.Request().Context().Done()` pueden retornar rápidamente en vez de ejecutarse
hasta completar.

En el ejemplo de abajo, el middleware impone un timeout de 5 segundos, mientras que el handler
tomaría 10 segundos de otro modo, por lo que el request devuelve `408 Request Timeout`.

## Servidor

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.ContextTimeout(5 * time.Second))

	// Route => handler
	e.GET("/", func(c *echo.Context) error {
		select {
		case <-c.Request().Context().Done():
			return echo.NewHTTPError(http.StatusRequestTimeout, "Request timed out")
		case <-time.After(10 * time.Second):
			return c.String(http.StatusOK, "Hello, World!\n")
		}
	})

	// Start server
	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
