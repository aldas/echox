---
title: Basic Auth
description: Middleware de autenticação HTTP Basic que valida credenciais de usuário e senha.
sidebar:
  order: 1
---

O middleware Basic Auth fornece autenticação básica HTTP.

- Para credenciais válidas, ele chama o próximo handler.
- Para credenciais ausentes ou inválidas, ele envia uma response `401 Unauthorized`.

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

## Configuração customizada

```go
e.Use(middleware.BasicAuthWithConfig(middleware.BasicAuthConfig{}))
```

## Configuração

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

O `Validator` tem a assinatura:

```go
type BasicAuthValidator func(c *echo.Context, user string, password string) (bool, error)
```

### Configuração padrão

```go
// Effective defaults applied when fields are left unset.
BasicAuthConfig{
	Skipper: DefaultSkipper,
	Realm:   "Restricted",
}
```

:::caution[Segurança]
Sempre compare credenciais com `subtle.ConstantTimeCompare` para evitar timing attacks.
:::
