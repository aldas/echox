---
title: Recover
description: Recupérate de panics en cualquier punto de la cadena y delega al handler centralizado de errores.
sidebar:
  order: 18
---

El middleware Recover se recupera de panics en cualquier punto de la cadena, imprime el stack trace y
pasa el control al
[HTTPErrorHandler](/es/guide/customization/#http-error-handler) centralizado.

## Uso

```go
e.Use(middleware.Recover())
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
	StackSize: 1 << 10, // 1 KB
}))
```

El ejemplo anterior usa un `StackSize` de 1 KB y valores por defecto para `DisableStackAll` y
`DisablePrintStack`.

## Configuración

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

### Configuración por defecto

```go
var DefaultRecoverConfig = RecoverConfig{
	Skipper:           DefaultSkipper,
	StackSize:         4 << 10, // 4 KB
	DisableStackAll:   false,
	DisablePrintStack: false,
}
```
