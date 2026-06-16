---
title: 解压缩
description: 透明解压 gzip 编码的请求体。
sidebar:
  order: 8
---

当 `Content-Encoding` header 设置为 `gzip` 时，Decompress 中间件会解压 HTTP 请求体。

:::note
请求体会在内存中解压，并在请求生命周期内（直到垃圾回收）保留在那里。
:::

## 用法

```go
e.Use(middleware.Decompress())
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.DecompressWithConfig(middleware.DecompressConfig{
	Skipper: middleware.DefaultSkipper,
}))
```

## 配置

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

### 默认配置

```go
// Effective defaults applied when fields are left unset.
DecompressConfig{
	Skipper:             DefaultSkipper,
	GzipDecompressPool:  &DefaultGzipDecompressPool{},
	MaxDecompressedSize: 100 * MB,
}
```
