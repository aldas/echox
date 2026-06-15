---
title: Auto TLS
description: Automatically obtain and renew TLS certificates from Let's Encrypt.
sidebar:
  order: 3
---

This recipe obtains TLS certificates for a domain automatically from Let's Encrypt.
Configure a `StartConfig` with the autocert manager's `TLSConfig` and listen on
port `443`.

Browse to `https://<DOMAIN>`. If everything is configured correctly, you should see
a welcome message served over TLS.

:::tip
- For added security, specify a host policy in the autocert manager.
- Cache certificates to avoid hitting [Let's Encrypt rate limits](https://letsencrypt.org/docs/rate-limits).
- To redirect HTTP traffic to HTTPS, use the [redirect middleware](/middleware/redirect/#https-redirect).
:::

## Server

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

## Using a custom HTTP server

If you need full control over the `http.Server`, wire the autocert manager into a
custom `tls.Config` instead:

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
