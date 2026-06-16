---
title: Key Auth
description: Middleware de autenticación basada en clave que valida una API key desde header, query, form o cookie.
sidebar:
  order: 11
---

El middleware Key Auth proporciona autenticación basada en clave.

- Para una clave válida llama al siguiente handler.
- Para una clave inválida, envía una response `401 Unauthorized`.
- Para una clave ausente, envía una response `400 Bad Request`.

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.KeyAuth(func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
	return key == "valid-key", nil
}))
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
	KeyLookup: "query:api-key",
	Validator: func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
		return key == "valid-key", nil
	},
}))
```

## Configuración

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

`Validator` tiene esta firma:

```go
type KeyAuthValidator func(c *echo.Context, key string, source ExtractorSource) (bool, error)
```

### Configuración por defecto

```go
DefaultKeyAuthConfig = KeyAuthConfig{
	Skipper:   DefaultSkipper,
	KeyLookup: "header:" + echo.HeaderAuthorization + ":Bearer ",
}
```
