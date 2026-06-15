---
title: Timeout
description: Apply a request timeout to handlers with the ContextTimeout middleware.
sidebar:
  order: 18
---

The [`ContextTimeout`](/middleware/context-timeout/) middleware sets a deadline on the
request's `context.Context`. When the deadline passes, the context is cancelled,
and handlers that watch `c.Request().Context().Done()` can return promptly instead
of running to completion.

In the example below the middleware imposes a 5-second timeout while the handler
would otherwise take 10 seconds, so the request returns a `408 Request Timeout`.

## Server

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
