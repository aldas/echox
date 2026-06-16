---
title: Key Auth
description: Middleware de autenticação por chave que valida uma API key de header, query, form ou cookie.
sidebar:
  order: 11
---

O middleware Key Auth fornece autenticação baseada em chave.

- Para uma chave válida, ele chama o próximo handler.
- Para uma chave inválida, ele envia uma response `401 Unauthorized`.
- Para uma chave ausente, ele envia uma response `400 Bad Request`.

## Uso

```go
e.Use(middleware.KeyAuth(func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
	return key == "valid-key", nil
}))
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
	KeyLookup: "query:api-key",
	Validator: func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
		return key == "valid-key", nil
	},
}))
```

## Configuração

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

O `Validator` tem a assinatura:

```go
type KeyAuthValidator func(c *echo.Context, key string, source ExtractorSource) (bool, error)
```

### Configuração padrão

```go
DefaultKeyAuthConfig = KeyAuthConfig{
	Skipper:   DefaultSkipper,
	KeyLookup: "header:" + echo.HeaderAuthorization + ":Bearer ",
}
```
