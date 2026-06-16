---
title: Hello World
description: あいさつを返す最小構成の Echo サーバーです。
sidebar:
  order: 1
---

最小構成の Echo アプリケーションです。インスタンスを作成し、Logger と Recover ミドルウェアを登録し、
単一のルートを追加してサーバーを起動します。

## サーバー

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
