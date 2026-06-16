---
title: Auto TLS
description: Obtén y renueva automáticamente certificados TLS desde Let's Encrypt.
sidebar:
  order: 3
---

Esta receta obtiene automáticamente certificados TLS para un dominio desde Let's Encrypt.
Configura un `StartConfig` con el `TLSConfig` del manager autocert y escucha en el
puerto `443`.

Abre `https://<DOMAIN>`. Si todo está configurado correctamente, deberías ver
un mensaje de bienvenida servido sobre TLS.

:::tip
- Para mayor seguridad, especifica una host policy en el manager autocert.
- Cachea certificados para evitar alcanzar los [rate limits de Let's Encrypt](https://letsencrypt.org/docs/rate-limits).
- Para redirigir tráfico HTTP a HTTPS, usa el [middleware redirect](/es/middleware/redirect/#https-redirect).
:::

## Servidor

```go
package main

import (
	"context"
	"crypto/tls"
	"errors"
	"log/slog"
	"net/http"
	"os"

	"golang.org/x/crypto/acme"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	e := echo.New()
	e.Logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))

	e.Use(middleware.Recover())
	e.Use(middleware.RequestLogger())

	e.GET("/", func(c *echo.Context) error {
		return c.HTML(http.StatusOK, `
			<h1>Welcome to Echo!</h1>
			<h3>TLS certificates automatically installed from Let's Encrypt :)</h3>
		`)
	})

	m := &autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("example.com", "www.example.com"),
		// Cache certificates to avoid issues with rate limits (https://letsencrypt.org/docs/rate-limits)
		Cache: autocert.DirCache("/var/www/.cache"),
		// Email:   "[email protected]", // optional but recommended
	}

	sc := echo.StartConfig{
		Address:   ":443",
		TLSConfig: m.TLSConfig(),
	}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Usar un servidor HTTP personalizado

Si necesitas control total sobre `http.Server`, conecta el manager autocert a un
`tls.Config` personalizado:

```go
func customHTTPServer() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.RequestLogger())
	e.GET("/", func(c *echo.Context) error {
		return c.HTML(http.StatusOK, `
			<h1>Welcome to Echo!</h1>
			<h3>TLS certificates automatically installed from Let's Encrypt :)</h3>
		`)
	})

	autoTLSManager := autocert.Manager{
		Prompt: autocert.AcceptTOS,
		// Cache certificates to avoid issues with rate limits (https://letsencrypt.org/docs/rate-limits)
		Cache: autocert.DirCache("/var/www/.cache"),
		//HostPolicy: autocert.HostWhitelist("<DOMAIN>"),
	}
	s := http.Server{
		Addr:    ":443",
		Handler: e, // set Echo as handler
		TLSConfig: &tls.Config{
			//Certificates: nil, // <-- s.ListenAndServeTLS will populate this field
			GetCertificate: autoTLSManager.GetCertificate,
			NextProtos:     []string{acme.ALPNProto},
		},
		//ReadTimeout: 30 * time.Second, // use custom timeouts
	}
	if err := s.ListenAndServeTLS("", ""); err != nil && !errors.Is(err, http.ErrServerClosed) {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
