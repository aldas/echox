---
title: Gzip
description: gzip 圧縮方式で HTTP レスポンスを圧縮します。
sidebar:
  order: 9
---

Gzip ミドルウェアは gzip 圧縮方式を使って HTTP レスポンスを圧縮します。

## 使い方

```go
e.Use(middleware.Gzip())
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Level: 5,
}))
```

:::tip
skipper を渡すと、特定の URL で gzip を無効化できます。
:::

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Skipper: func(c *echo.Context) bool {
		return strings.Contains(c.Path(), "metrics") // change "metrics" to your own path
	},
}))
```

## 設定

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

### デフォルト設定

```go
// Effective defaults applied when fields are left unset.
GzipConfig{
	Skipper:   DefaultSkipper,
	Level:     -1,
	MinLength: 0,
}
```
