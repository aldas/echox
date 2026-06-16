---
title: Gzip
description: Comprime responses HTTP con el esquema de compresión gzip.
sidebar:
  order: 9
---

El middleware Gzip comprime la response HTTP usando el esquema de compresión gzip.

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.Gzip())
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Level: 5,
}))
```

:::tip
Pasa un skipper para deshabilitar gzip en ciertas URLs.
:::

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Skipper: func(c *echo.Context) bool {
		return strings.Contains(c.Path(), "metrics") // change "metrics" to your own path
	},
}))
```

## Configuración

```go
type GzipConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Level is the gzip compression level.
	// Optional. Default value -1.
	Level int

	// MinLength is the length threshold before gzip compression is applied.
	// Optional. Default value 0.
	//
	// Most of the time the default is fine. Compressing a short response might increase
	// the transmitted data because of gzip's format overhead, and compression consumes
	// CPU and time on both server and client. Depending on your use case such a
	// threshold can be useful.
	MinLength int
}
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset.
GzipConfig{
	Skipper:   DefaultSkipper,
	Level:     -1,
	MinLength: 0,
}
```
