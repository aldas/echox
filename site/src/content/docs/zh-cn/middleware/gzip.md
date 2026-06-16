---
title: Gzip
description: 使用 gzip 压缩方案压缩 HTTP 响应。
sidebar:
  order: 9
---

Gzip 中间件使用 gzip 压缩方案压缩 HTTP 响应。

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

```go
e.Use(middleware.Gzip())
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Level: 5,
}))
```

:::tip
传入 skipper 可以对某些 URL 禁用 gzip。
:::

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Skipper: func(c *echo.Context) bool {
		return strings.Contains(c.Path(), "metrics") // change "metrics" to your own path
	},
}))
```

## 配置

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

### 默认配置

```go
// Effective defaults applied when fields are left unset.
GzipConfig{
	Skipper:   DefaultSkipper,
	Level:     -1,
	MinLength: 0,
}
```
