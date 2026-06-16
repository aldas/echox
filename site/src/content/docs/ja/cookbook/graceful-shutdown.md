---
title: グレースフルシャットダウン
description: 割り込み信号でサーバーを停止する前に、処理中のリクエストを完了させます。
sidebar:
  order: 8
---

グレースフルシャットダウンは、プロセスが終了する前に処理中のリクエストを完了させます。
もっとも簡単な方法は、キャンセル可能なコンテキストを `StartConfig.Start` に渡し、
`GracefulTimeout` を設定することです。割り込み信号でコンテキストがキャンセルされると、
Echo は新しい接続の受け付けを停止し、アクティブなリクエストが完了するまで最大タイムアウトまで待ちます。

## サーバー

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

## カスタム HTTP サーバーを使う

`http.Server` を自分で管理する場合は、goroutine で起動し、signal context を待ってから、
タイムアウト付きで `Shutdown` を呼び出します。

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
