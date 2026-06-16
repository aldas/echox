---
title: コンテキストタイムアウト
description: リクエストコンテキストにタイムアウトを適用し、コンテキスト対応の処理を早期に返せるようにします。
sidebar:
  order: 5
---

Context Timeout ミドルウェアは、定義済みの期間内でリクエストコンテキストにタイムアウトを適用し、
期限を超えたらコンテキスト対応メソッドが早期に返れるようにします。

## 使い方

```go
e.Use(middleware.ContextTimeout(60 * time.Second))
```

## カスタム設定

```go
e.Use(middleware.ContextTimeoutWithConfig(middleware.ContextTimeoutConfig{
	Timeout: 60 * time.Second,
}))
```

## 設定

```go
type ContextTimeoutConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// ErrorHandler is a function invoked when an error arises during middleware execution.
	ErrorHandler func(c *echo.Context, err error) error

	// Timeout configures the timeout for the middleware.
	Timeout time.Duration
}
```

### デフォルト設定

```go
// Effective defaults applied when fields are left unset (Timeout is required).
ContextTimeoutConfig{
	Skipper: DefaultSkipper,
}
```
