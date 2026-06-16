---
title: Method Override
description: Sobrescribe el método HTTP de un request POST mediante header, form o valor de query.
sidebar:
  order: 13
---

El middleware Method Override lee el método sobrescrito desde el request y lo usa
en lugar del método original.

:::note
Por razones de seguridad, solo se puede sobrescribir el método `POST`.
:::

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Pre(middleware.MethodOverride())
```

## Configuración personalizada

```go
e := echo.New()
e.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{
	Getter: middleware.MethodFromForm("_method"),
}))
```

El método puede obtenerse con `MethodFromHeader`, `MethodFromForm` o `MethodFromQuery`.

## Configuración

```go
type MethodOverrideConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Getter is a function that gets the overridden method from the request.
	// Optional. Default value MethodFromHeader(echo.HeaderXHTTPMethodOverride).
	Getter MethodOverrideGetter
}
```

### Configuración por defecto

```go
DefaultMethodOverrideConfig = MethodOverrideConfig{
	Skipper: DefaultSkipper,
	Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),
}
```
