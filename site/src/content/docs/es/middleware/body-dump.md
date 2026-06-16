---
title: Body Dump
description: Captura payloads de request y response y pásalos a un handler para logging o debugging.
sidebar:
  order: 2
---

El middleware Body Dump captura los payloads de request y response y los pasa a un
handler registrado. Generalmente se usa para debugging o logging.

:::caution
Evita Body Dump para payloads grandes, como uploads o downloads de archivos. Si debes usarlo
en esas rutas, agrega una excepción en la función skipper.
:::

## Uso

```go
e := echo.New()
e.Use(middleware.BodyDump(func(c *echo.Context, reqBody, resBody []byte, err error) {
	// Handle the request and response bodies.
}))
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))
```

## Configuración

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

`Handler` tiene esta firma:

```go
type BodyDumpHandler func(c *echo.Context, reqBody []byte, resBody []byte, err error)
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset (Handler is required).
BodyDumpConfig{
	Skipper:          DefaultSkipper,
	MaxRequestBytes:  5 * MB,
	MaxResponseBytes: 5 * MB,
}
```
