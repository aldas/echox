---
title: Basic Auth
description: 用于验证用户名和密码凭据的 HTTP Basic 认证中间件。
sidebar:
  order: 1
---

Basic Auth 中间件提供 HTTP Basic 认证。

- 对于有效凭据，它会调用下一个处理函数。
- 对于缺失或无效凭据，它会发送 `401 Unauthorized` 响应。

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

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

## 自定义配置

```go
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))
```

## 配置

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

`Validator` 的签名为：

```go
type BasicAuthValidator func(c *echo.Context, user string, password string) (bool, error)
```

### 默认配置

```go
// Effective defaults applied when fields are left unset.
BasicAuthConfig{
	Skipper: DefaultSkipper,
	Realm:   "Restricted",
}
```

:::caution[安全]
请始终使用 `subtle.ConstantTimeCompare` 比较凭据，以防止时序攻击。
:::
