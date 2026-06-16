---
title: Apagado graceful
description: Drena requests en curso antes de detener el servidor ante una señal de interrupción.
sidebar:
  order: 8
---

Un apagado graceful permite que los requests en curso terminen antes de que el proceso salga.
El enfoque más simple es pasar un contexto cancelable a `StartConfig.Start` y establecer
un `GracefulTimeout`. Cuando el contexto se cancela por una señal de interrupción, Echo
deja de aceptar nuevas conexiones y espera hasta el timeout para que los requests activos
se completen.

## Servidor

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

## Usar un servidor HTTP personalizado

Si administras el `http.Server` por tu cuenta, inícialo en una goroutine, espera el
contexto de señal y luego llama a `Shutdown` con un timeout:

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
