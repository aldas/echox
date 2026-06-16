---
title: 解凍
description: gzip エンコードされたリクエストボディを透過的に解凍します。
sidebar:
  order: 8
---

Decompress ミドルウェアは、`Content-Encoding` header が `gzip` に設定されている場合に
HTTP リクエストボディを解凍します。

:::note
ボディはメモリ内で解凍され、リクエストのライフタイム中（およびガベージコレクションまで）保持されます。
:::

## 使い方

```go
e.Use(middleware.Decompress())
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.DecompressWithConfig(middleware.DecompressConfig{
	Skipper: middleware.DefaultSkipper,
}))
```

## 設定

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

### デフォルト設定

```go
// Effective defaults applied when fields are left unset.
DecompressConfig{
	Skipper:             DefaultSkipper,
	GzipDecompressPool:  &DefaultGzipDecompressPool{},
	MaxDecompressedSize: 100 * MB,
}
```
