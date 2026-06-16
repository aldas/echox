---
title: ボディダンプ
description: リクエストとレスポンスのペイロードをキャプチャし、ログ記録やデバッグ用のハンドラへ渡します。
sidebar:
  order: 2
---

Body Dump ミドルウェアは、リクエストとレスポンスのペイロードをキャプチャして登録済みハンドラへ渡します。
一般的にはデバッグやログ記録に使います。

:::caution
ファイルのアップロードやダウンロードなど、大きなペイロードには Body Dump を避けてください。
そのようなルートで使う必要がある場合は、skipper 関数に例外を追加してください。
:::

すべてのコアミドルウェアは `middleware` パッケージに含まれています：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 使い方

```go
e := echo.New()
e.Use(middleware.BodyDump(func(c *echo.Context, reqBody, resBody []byte, err error) {
	// Handle the request and response bodies.
}))
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))
```

## 設定

```go
type BodyDumpConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Handler receives the request and response payloads and the handler error, if any.
	// Required.
	Handler BodyDumpHandler

	// MaxRequestBytes limits how much of the request body to dump. If the request body
	// exceeds this limit, only the first MaxRequestBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxRequestBytes int64

	// MaxResponseBytes limits how much of the response body to dump. If the response body
	// exceeds this limit, only the first MaxResponseBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxResponseBytes int64
}
```

`Handler` のシグネチャは次のとおりです。

```go
type BodyDumpHandler func(c *echo.Context, reqBody []byte, resBody []byte, err error)
```

### デフォルト設定

```go
// Effective defaults applied when fields are left unset (Handler is required).
BodyDumpConfig{
	Skipper:          DefaultSkipper,
	MaxRequestBytes:  5 * MB,
	MaxResponseBytes: 5 * MB,
}
```
