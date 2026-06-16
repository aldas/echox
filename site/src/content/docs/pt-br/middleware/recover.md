---
title: Recover
description: Recupere-se de panics em qualquer ponto da cadeia e delegue ao handler de erro centralizado.
sidebar:
  order: 18
---

O middleware Recover recupera panics em qualquer ponto da cadeia, imprime a stack trace e
passa o controle para o
[HTTPErrorHandler](/pt-br/guide/customization/#http-error-handler) centralizado.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.Recover())
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
	StackSize: 1 << 10, // 1 KB
}))
```

O exemplo acima usa um `StackSize` de 1 KB e valores padrão para `DisableStackAll` e
`DisablePrintStack`.

## Configuração

```go
type RecoverConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Size of the stack to be printed.
	// Optional. Default value 4KB.
	StackSize int

	// DisableStackAll disables formatting stack traces of all other goroutines
	// into the buffer after the trace for the current goroutine.
	// Optional. Default value false.
	DisableStackAll bool

	// DisablePrintStack disables printing the stack trace.
	// Optional. Default value false.
	DisablePrintStack bool
}
```

### Configuração padrão

```go
var DefaultRecoverConfig = RecoverConfig{
	Skipper:           DefaultSkipper,
	StackSize:         4 << 10, // 4 KB
	DisableStackAll:   false,
	DisablePrintStack: false,
}
```
