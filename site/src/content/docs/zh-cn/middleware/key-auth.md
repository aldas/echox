---
title: Key Auth
description: 从 header、query、form 或 Cookie 验证 API key 的基于 key 的认证中间件。
sidebar:
  order: 11
---

Key Auth 中间件提供基于 key 的认证。

- 对于有效 key，它会调用下一个处理函数。
- 对于无效 key，它会发送 `401 Unauthorized` 响应。
- 对于缺失 key，它会发送 `400 Bad Request` 响应。

## 用法

```go
e.Use(middleware.KeyAuth(func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
	return key == "valid-key", nil
}))
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
	KeyLookup: "query:api-key",
	Validator: func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
		return key == "valid-key", nil
	},
}))
```

## 配置

```go
type KeyAuthConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// KeyLookup is a string in the form "<source>:<name>" or
	// "<source>:<name>,<source>:<name>" used to extract the key from the request.
	// Optional. Default value "header:Authorization:Bearer ".
	// Possible values:
	// - "header:<name>" or "header:<name>:<cut-prefix>"
	//   <cut-prefix> trims a static prefix from the extracted value. For
	//   `Authorization: Basic <credentials>`, the prefix to remove is `Basic `.
	// - "query:<name>"
	// - "form:<name>"
	// - "cookie:<name>"
	// Multiple sources example: "header:Authorization,header:X-Api-Key".
	KeyLookup string

	// AllowedCheckLimit sets how many KeyLookup values are allowed to be checked. This is
	// useful in environments such as corporate test setups with application proxies
	// restricting access with their own auth scheme.
	AllowedCheckLimit uint

	// Validator validates the key.
	// Required.
	Validator KeyAuthValidator

	// ErrorHandler defines a function executed when all lookups have been done and none
	// passed the Validator. It runs with the last missing (ErrExtractionValueMissing) or
	// invalid key, and may be used to define a custom error.
	//
	// Note: when the error handler swallows the error (returns nil), the middleware
	// continues the handler chain. This is useful when part of your site/api is public
	// and offers extra features for authorized users.
	ErrorHandler KeyAuthErrorHandler

	// ContinueOnIgnoredError allows the next middleware/handler to be called when the
	// ErrorHandler ignores the error (returns nil).
	ContinueOnIgnoredError bool
}
```

`Validator` 的签名为：

```go
type KeyAuthValidator func(c *echo.Context, key string, source ExtractorSource) (bool, error)
```

### 默认配置

```go
DefaultKeyAuthConfig = KeyAuthConfig{
	Skipper:   DefaultSkipper,
	KeyLookup: "header:" + echo.HeaderAuthorization + ":Bearer ",
}
```
