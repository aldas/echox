---
title: Request ID
description: Gere um ID único para cada request.
sidebar:
  order: 20
---

O middleware Request ID gera um ID único para um request.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.RequestID())
```

Exemplo:

```go
func main() {
	e := echo.New()

	e.Use(middleware.RequestID())

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, c.Response().Header().Get(echo.HeaderXRequestID))
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Configuração customizada

```go
e.Use(middleware.RequestIDWithConfig(middleware.RequestIDConfig{
	Generator: func() string {
		return customGenerator()
	},
}))
```

## Configuração

```go
type RequestIDConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Generator defines a function to generate an ID.
	// Optional. Default value random.String(32).
	Generator func() string

	// RequestIDHandler defines a function which is executed for a request id.
	RequestIDHandler func(c *echo.Context, requestID string)

	// TargetHeader defines what header to look for to populate the id.
	// Optional. Default value is `X-Request-Id`.
	TargetHeader string
}
```

### Configuração padrão

```go
// Effective defaults applied when fields are left unset.
RequestIDConfig{
	Skipper:      DefaultSkipper,
	Generator:    generator, // random 32-character string
	TargetHeader: echo.HeaderXRequestID,
}
```

## Definir ID

Você pode definir o ID a partir do requester com o header `X-Request-ID`.

### Request

```sh
curl -H "X-Request-ID: 3" --compressed -v "http://localhost:1323/?my=param"
```

### Log

```js
{"time":"2017-11-13T20:26:28.6438003+01:00","id":"3","remote_ip":"::1","host":"localhost:1323","method":"GET","uri":"/?my=param","my":"param","status":200, "latency":0,"latency_human":"0s","bytes_in":0,"bytes_out":13}
```
