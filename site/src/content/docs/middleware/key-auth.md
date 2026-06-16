---
title: Key Auth
description: Key-based authentication middleware that validates an API key from header, query, form, or cookie.
sidebar:
  order: 11
---

Key Auth middleware provides key-based authentication.

- For a valid key it calls the next handler.
- For an invalid key, it sends a `401 Unauthorized` response.
- For a missing key, it sends a `400 Bad Request` response.

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e.Use(middleware.KeyAuth(func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
	return key == "valid-key", nil
}))
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
	KeyLookup: "query:api-key",
	Validator: func(c *echo.Context, key string, source middleware.ExtractorSource) (bool, error) {
		return key == "valid-key", nil
	},
}))
```

## Configuration

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

The `Validator` has the signature:

```go
type KeyAuthValidator func(c *echo.Context, key string, source ExtractorSource) (bool, error)
```

### Default configuration

```go
DefaultKeyAuthConfig = KeyAuthConfig{
	Skipper:   DefaultSkipper,
	KeyLookup: "header:" + echo.HeaderAuthorization + ":Bearer ",
}
```
