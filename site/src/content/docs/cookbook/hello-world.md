---
title: Hello World
description: A minimal Echo server that responds with a greeting.
sidebar:
  order: 1
---

A minimal Echo application: create an instance, register the Logger and Recover
middleware, add a single route, and start the server.

## Server

```go
package main

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// Route => handler
	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!\n")
	})

	// Start server
	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
