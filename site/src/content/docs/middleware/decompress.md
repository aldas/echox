---
title: Decompress
description: Transparently decompress gzip-encoded request bodies.
sidebar:
  order: 8
---

Decompress middleware decompresses the HTTP request body when the `Content-Encoding`
header is set to `gzip`.

:::note
The body is decompressed in memory and held there for the lifetime of the request (and
until garbage collection).
:::

## Usage

```go
e.Use(middleware.Decompress())
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.DecompressWithConfig(middleware.DecompressConfig{
	Skipper: middleware.DefaultSkipper,
}))
```

## Configuration

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

### Default configuration

```go
// Effective defaults applied when fields are left unset.
DecompressConfig{
	Skipper:             DefaultSkipper,
	GzipDecompressPool:  &DefaultGzipDecompressPool{},
	MaxDecompressedSize: 100 * MB,
}
```
