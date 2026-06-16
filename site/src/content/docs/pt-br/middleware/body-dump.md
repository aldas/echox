---
title: Body Dump
description: Capture payloads de request e response e passe-os para um handler para logging ou debugging.
sidebar:
  order: 2
---

O middleware Body Dump captura os payloads de request e response e os passa para um
handler registrado. Em geral, ele é usado para debugging ou logging.

:::caution
Evite Body Dump para payloads grandes, como uploads ou downloads de arquivos. Se precisar usá-lo
nessas rotas, adicione uma exceção na função skipper.
:::

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e := echo.New()
e.Use(middleware.BodyDump(func(c *echo.Context, reqBody, resBody []byte, err error) {
	// Handle the request and response bodies.
}))
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))
```

## Configuração

```go
type BodyDumpConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Handler receives the request and response payloads and the handler error, if any.
	// Required.
	Handler BodyDumpHandler

	// MaxRequestBytes limits how much of the request body to dump. If the request body
	// exceeds this limit, only the first MaxRequestBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxRequestBytes int64

	// MaxResponseBytes limits how much of the response body to dump. If the response body
	// exceeds this limit, only the first MaxResponseBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxResponseBytes int64
}
```

O `Handler` tem a assinatura:

```go
type BodyDumpHandler func(c *echo.Context, reqBody []byte, resBody []byte, err error)
```

### Configuração padrão

```go
// Effective defaults applied when fields are left unset (Handler is required).
BodyDumpConfig{
	Skipper:          DefaultSkipper,
	MaxRequestBytes:  5 * MB,
	MaxResponseBytes: 5 * MB,
}
```
