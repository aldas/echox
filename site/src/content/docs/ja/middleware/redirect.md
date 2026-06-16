---
title: リダイレクト
description: HTTP/HTTPS と www/non-www のバリエーション間でリクエストをリダイレクトします。
sidebar:
  order: 19
---

## HTTPS リダイレクト

HTTPS redirect ミドルウェアは HTTP リクエストを HTTPS へリダイレクトします。
たとえば `http://labstack.com` は `https://labstack.com` へリダイレクトされます。

### 使い方

```go
e := echo.New()
e.Pre(middleware.HTTPSRedirect())
```

## HTTPS WWW リダイレクト

HTTPS WWW redirect は HTTP リクエストを www HTTPS へリダイレクトします。
たとえば `http://labstack.com` は `https://www.labstack.com` へリダイレクトされます。

### 使い方

```go
e := echo.New()
e.Pre(middleware.HTTPSWWWRedirect())
```

## HTTPS NonWWW リダイレクト

HTTPS NonWWW redirect は HTTP リクエストを non-www HTTPS へリダイレクトします。
たとえば `http://www.labstack.com` は `https://labstack.com` へリダイレクトされます。

### 使い方

```go
e := echo.New()
e.Pre(middleware.HTTPSNonWWWRedirect())
```

## WWW リダイレクト

WWW redirect は non-www リクエストを www へリダイレクトします。
たとえば `http://labstack.com` は `http://www.labstack.com` へリダイレクトされます。

### 使い方

```go
e := echo.New()
e.Pre(middleware.WWWRedirect())
```

## NonWWW リダイレクト

NonWWW redirect は www リクエストを non-www へリダイレクトします。
たとえば `http://www.labstack.com` は `http://labstack.com` へリダイレクトされます。

### 使い方

```go
e := echo.New()
e.Pre(middleware.NonWWWRedirect())
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.HTTPSRedirectWithConfig(middleware.RedirectConfig{
	Code: http.StatusTemporaryRedirect,
}))
```

上の例は、HTTP リクエストをステータスコード `307 - StatusTemporaryRedirect` で HTTPS へリダイレクトします。

## 設定

```go
type RedirectConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional. Default value http.StatusMovedPermanently.
	Code int
}
```

### デフォルト設定

```go
// Effective defaults applied when fields are left unset.
RedirectConfig{
	Skipper: DefaultSkipper,
	Code:    http.StatusMovedPermanently,
}
```
