---
title: Trailing Slash
description: Agrega o elimina una trailing slash del URI del request.
sidebar:
  order: 25
---

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Agregar trailing slash

El middleware Add trailing slash agrega una trailing slash al URI del request.

### Uso

```go
e := echo.New()
e.Pre(middleware.AddTrailingSlash())
```

## Eliminar trailing slash

El middleware Remove trailing slash elimina una trailing slash del URI del request.

### Uso

```go
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.AddTrailingSlashConfig{
	RedirectCode: http.StatusMovedPermanently,
}))
```

El ejemplo anterior agrega una trailing slash al URI del request y redirige con
`301 - StatusMovedPermanently`.

## Configuración

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
