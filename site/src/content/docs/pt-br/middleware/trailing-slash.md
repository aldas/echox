---
title: Trailing Slash
description: Adicione ou remova uma barra final da URI do request.
sidebar:
  order: 25
---

## Adicionar barra final

O middleware Add trailing slash adiciona uma barra final à URI do request.

### Uso

```go
e := echo.New()
e.Pre(middleware.AddTrailingSlash())
```

## Remover barra final

O middleware Remove trailing slash remove uma barra final da URI do request.

### Uso

```go
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.AddTrailingSlashConfig{
	RedirectCode: http.StatusMovedPermanently,
}))
```

O exemplo acima adiciona uma barra final à URI do request e redireciona com
`301 - StatusMovedPermanently`.

## Configuração

```go
type AddTrailingSlashConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional, but when provided the request is redirected using this code.
	// Valid status codes: [300...308]
	RedirectCode int
}
```

```go
type RemoveTrailingSlashConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional, but when provided the request is redirected using this code.
	RedirectCode int
}
```
