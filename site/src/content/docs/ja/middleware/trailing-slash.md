---
title: 末尾スラッシュ
description: リクエスト URI に末尾スラッシュを追加または削除します。
sidebar:
  order: 25
---

すべてのコアミドルウェアは `middleware` パッケージに含まれています：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 末尾スラッシュを追加する

Add trailing slash ミドルウェアは、リクエスト URI に末尾スラッシュを追加します。

### 使い方

```go
e := echo.New()
e.Pre(middleware.AddTrailingSlash())
```

## 末尾スラッシュを削除する

Remove trailing slash ミドルウェアは、リクエスト URI から末尾スラッシュを削除します。

### 使い方

```go
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.AddTrailingSlashConfig{
	RedirectCode: http.StatusMovedPermanently,
}))
```

上の例は、リクエスト URI に末尾スラッシュを追加し、`301 - StatusMovedPermanently` でリダイレクトします。

## 設定

```go
type AddTrailingSlashConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional, but when provided the request is redirected using this code.
	// Valid status codes: [300...308]
	RedirectCode int
}
```

```go
type RemoveTrailingSlashConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional, but when provided the request is redirected using this code.
	RedirectCode int
}
```
