---
title: Timeout
description: Aplique um timeout de request aos handlers com o middleware ContextTimeout.
sidebar:
  order: 18
---

O middleware [`ContextTimeout`](/pt-br/middleware/context-timeout/) define um deadline no
`context.Context` do request. Quando o deadline passa, o contexto é cancelado,
e handlers que observam `c.Request().Context().Done()` podem retornar rapidamente em vez
de continuar até o fim.

No exemplo abaixo, o middleware impõe um timeout de 5 segundos enquanto o handler
levaria 10 segundos; por isso, o request retorna `408 Request Timeout`.

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
