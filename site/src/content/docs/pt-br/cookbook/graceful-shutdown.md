---
title: Encerramento graceful
description: Drene requests em andamento antes de parar o servidor em um sinal de interrupção.
sidebar:
  order: 8
---

Um graceful shutdown permite que requests em andamento terminem antes de o processo sair. A
abordagem mais simples é passar um contexto cancelável para `StartConfig.Start` e definir
um `GracefulTimeout`. Quando o contexto é cancelado por um sinal de interrupção, Echo
para de aceitar novas conexões e aguarda até o timeout para que requests ativos
terminem.

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

## Usando um servidor HTTP customizado

Se você gerencia o `http.Server` por conta própria, inicie-o em uma goroutine, aguarde no
contexto de sinal e então chame `Shutdown` com um timeout:

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
