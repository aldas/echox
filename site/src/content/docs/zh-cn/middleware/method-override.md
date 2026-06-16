---
title: 方法覆盖
description: 通过 header、form 或 query 值覆盖 POST 请求的 HTTP 方法。
sidebar:
  order: 13
---

Method Override 中间件会从请求中读取被覆盖的方法，并用它代替原始方法。

:::note
出于安全原因，只有 `POST` 方法可以被覆盖。
:::

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

```go
e.Pre(middleware.MethodOverride())
```

## 自定义配置

```go
e := echo.New()
e.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{
	Getter: middleware.MethodFromForm("_method"),
}))
```

方法可以来自 `MethodFromHeader`、`MethodFromForm` 或 `MethodFromQuery`。

## 配置

```go
type MethodOverrideConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Getter is a function that gets the overridden method from the request.
	// Optional. Default value MethodFromHeader(echo.HeaderXHTTPMethodOverride).
	Getter MethodOverrideGetter
}
```

### 默认配置

```go
DefaultMethodOverrideConfig = MethodOverrideConfig{
	Skipper: DefaultSkipper,
	Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),
}
```
