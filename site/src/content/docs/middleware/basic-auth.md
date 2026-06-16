---
title: Basic Auth
description: HTTP Basic authentication middleware that validates username and password credentials.
sidebar:
  order: 1
---

Basic Auth middleware provides HTTP basic authentication.

- For valid credentials it calls the next handler.
- For missing or invalid credentials, it sends a `401 Unauthorized` response.

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

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

## Custom configuration

```go
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))
```

## Configuration

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

The `Validator` has the signature:

```go
type BasicAuthValidator func(c *echo.Context, user string, password string) (bool, error)
```

### Default configuration

```go
// Effective defaults applied when fields are left unset.
BasicAuthConfig{
	Skipper: DefaultSkipper,
	Realm:   "Restricted",
}
```

:::caution[Security]
Always compare credentials with `subtle.ConstantTimeCompare` to prevent timing attacks.
:::
