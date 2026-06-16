---
title: Basic Auth
description: Middleware de autenticación HTTP Basic que valida credenciales de username y password.
sidebar:
  order: 1
---

El middleware Basic Auth proporciona autenticación HTTP basic.

- Para credenciales válidas llama al siguiente handler.
- Para credenciales ausentes o inválidas, envía una response `401 Unauthorized`.

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

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

## Configuración personalizada

```go
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))
```

## Configuración

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

`Validator` tiene esta firma:

```go
type BasicAuthValidator func(c *echo.Context, user string, password string) (bool, error)
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset.
BasicAuthConfig{
	Skipper: DefaultSkipper,
	Realm:   "Restricted",
}
```

:::caution[Seguridad]
Compara siempre las credenciales con `subtle.ConstantTimeCompare` para prevenir timing attacks.
:::
