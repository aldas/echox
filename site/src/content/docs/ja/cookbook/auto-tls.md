---
title: 自動 TLS
description: Let's Encrypt から TLS 証明書を自動で取得し、更新します。
sidebar:
  order: 3
---

このレシピは、ドメインの TLS 証明書を Let's Encrypt から自動取得します。autocert manager の
`TLSConfig` を使って `StartConfig` を設定し、ポート `443` で待ち受けます。

`https://<DOMAIN>` にアクセスしてください。すべて正しく設定されていれば、TLS 経由で提供される
ウェルカムメッセージが表示されます。

:::tip
- セキュリティを高めるには、autocert manager で host policy を指定してください。
- [Let's Encrypt rate limits](https://letsencrypt.org/docs/rate-limits) に達しないよう、証明書をキャッシュしてください。
- HTTP トラフィックを HTTPS にリダイレクトするには、[リダイレクトミドルウェア](/ja/middleware/redirect/#https-redirect)を使います。
:::

## サーバー

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

## カスタム HTTP サーバーを使う

`http.Server` を完全に制御したい場合は、代わりに autocert manager をカスタム `tls.Config` に接続します。

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
