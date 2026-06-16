---
title: 尾随斜杠
description: 为请求 URI 添加或移除尾随斜杠。
sidebar:
  order: 25
---

## 添加尾随斜杠

Add trailing slash 中间件会向请求 URI 添加尾随斜杠。

### 用法

```go
e := echo.New()
e.Pre(middleware.AddTrailingSlash())
```

## 移除尾随斜杠

Remove trailing slash 中间件会从请求 URI 移除尾随斜杠。

### 用法

```go
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.AddTrailingSlashConfig{
	RedirectCode: http.StatusMovedPermanently,
}))
```

上面的示例会向请求 URI 添加尾随斜杠，并以 `301 - StatusMovedPermanently` 重定向。

## 配置

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
