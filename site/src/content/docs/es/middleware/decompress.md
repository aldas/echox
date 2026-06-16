---
title: Decompress
description: Descomprime de forma transparente bodies de request codificados con gzip.
sidebar:
  order: 8
---

El middleware Decompress descomprime el body del request HTTP cuando el header
`Content-Encoding` está establecido en `gzip`.

:::note
El body se descomprime en memoria y permanece allí durante la vida del request (y hasta
la garbage collection).
:::

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.Decompress())
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.DecompressWithConfig(middleware.DecompressConfig{
	Skipper: middleware.DefaultSkipper,
}))
```

## Configuración

```go
type DecompressConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// GzipDecompressPool provides the sync.Pool used to create and store gzip readers.
	GzipDecompressPool Decompressor

	// MaxDecompressedSize limits the maximum size of the decompressed request body in
	// bytes. If the decompressed body exceeds this limit, the middleware returns an
	// HTTP 413 error. This prevents zip-bomb attacks where a small compressed payload
	// decompresses to a huge size.
	// Default: 100 * MB (104,857,600 bytes). Set to -1 to disable limits (not recommended).
	MaxDecompressedSize int64
}
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset.
DecompressConfig{
	Skipper:             DefaultSkipper,
	GzipDecompressPool:  &DefaultGzipDecompressPool{},
	MaxDecompressedSize: 100 * MB,
}
```
