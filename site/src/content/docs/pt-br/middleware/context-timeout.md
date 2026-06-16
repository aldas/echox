---
title: Context Timeout
description: Aplique timeout ao contexto do request para que operações context-aware retornem mais cedo.
sidebar:
  order: 5
---

O middleware Context Timeout aplica um timeout ao contexto do request dentro de um período
predefinido, para que métodos context-aware possam retornar mais cedo quando o prazo for excedido.

## Uso

```go
e.Use(middleware.ContextTimeout(60 * time.Second))
```

## Configuração customizada

```go
e.Use(middleware.ContextTimeoutWithConfig(middleware.ContextTimeoutConfig{
	Timeout: 60 * time.Second,
}))
```

## Configuração

```go
type ContextTimeoutConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// ErrorHandler is a function invoked when an error arises during middleware execution.
	ErrorHandler func(c *echo.Context, err error) error

	// Timeout configures the timeout for the middleware.
	Timeout time.Duration
}
```

### Configuração padrão

```go
// Effective defaults applied when fields are left unset (Timeout is required).
ContextTimeoutConfig{
	Skipper: DefaultSkipper,
}
```
