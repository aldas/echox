---
title: Graceful Shutdown
description: Drain in-flight requests before stopping the server on an interrupt signal.
sidebar:
  order: 8
---

A graceful shutdown lets in-flight requests finish before the process exits. The
simplest approach is to pass a cancellable context to `StartConfig.Start` and set
a `GracefulTimeout`. When the context is cancelled by an interrupt signal, Echo
stops accepting new connections and waits up to the timeout for active requests to
complete.

## Server

```go
package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v5"
)

func main() {
	// Setup
	e := echo.New()
	e.GET("/", func(c *echo.Context) error {
		time.Sleep(5 * time.Second)
		return c.JSON(http.StatusOK, "OK")
	})

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	sc := echo.StartConfig{
		Address:         ":1323",
		GracefulTimeout: 5 * time.Second,
	}
	if err := sc.Start(ctx, e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Using a custom HTTP server

If you manage the `http.Server` yourself, start it in a goroutine, wait on the
signal context, then call `Shutdown` with a timeout:

```go
func mainWithHTTPServer() {
	// Setup
	e := echo.New()
	e.GET("/", func(c *echo.Context) error {
		time.Sleep(5 * time.Second)
		return c.JSON(http.StatusOK, "OK")
	})

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	s := http.Server{Addr: ":1323", Handler: e}
	// Start server
	go func() {
		if err := s.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			e.Logger.Error("failed to start server", "error", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server with a timeout of 10 seconds.
	<-ctx.Done()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := s.Shutdown(ctx); err != nil {
		e.Logger.Error("failed to stop server", "error", err)
	}
}
```
