---
title: Basic Auth
description: ユーザー名とパスワードの認証情報を検証する HTTP Basic 認証ミドルウェアです。
sidebar:
  order: 1
---

Basic Auth ミドルウェアは HTTP Basic 認証を提供します。

- 有効な認証情報の場合、次のハンドラを呼び出します。
- 認証情報がない、または無効な場合は `401 Unauthorized` レスポンスを送信します。

## 使い方

```go
e.Use(middleware.BasicAuth(func(c *echo.Context, username, password string) (bool, error) {
	// Use a constant time comparison to prevent timing attacks.
	if subtle.ConstantTimeCompare([]byte(username), []byte("joe")) == 1 &&
		subtle.ConstantTimeCompare([]byte(password), []byte("secret")) == 1 {
		return true, nil
	}
	return false, nil
}))
```

## カスタム設定

```go
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))
```

## 設定

```go
type BasicAuthConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Validator validates the credentials. If the request contains multiple basic
	// auth headers, it is called once for each header until the first valid result.
	// Required.
	Validator BasicAuthValidator

	// Realm is the realm attribute of the WWW-Authenticate header.
	// Default value "Restricted".
	Realm string

	// AllowedCheckLimit sets how many headers are allowed to be checked. This is
	// useful in environments such as corporate test setups with application proxies
	// restricting access with their own auth scheme.
	// Default value 1.
	AllowedCheckLimit uint
}
```

`Validator` のシグネチャは次のとおりです。

```go
type BasicAuthValidator func(c *echo.Context, user string, password string) (bool, error)
```

### デフォルト設定

```go
// Effective defaults applied when fields are left unset.
BasicAuthConfig{
	Skipper: DefaultSkipper,
	Realm:   "Restricted",
}
```

:::caution[セキュリティ]
タイミング攻撃を防ぐため、認証情報の比較には必ず `subtle.ConstantTimeCompare` を使ってください。
:::
