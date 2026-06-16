---
title: 上下文超时
description: 为请求上下文应用超时，使支持上下文的操作可以提前返回。
sidebar:
  order: 5
---

Context Timeout 中间件会在预定义时间内为请求上下文应用超时，
使支持上下文的方法在超过截止时间后可以提前返回。

## 用法

```go
e.Use(middleware.ContextTimeout(60 * time.Second))
```

## 自定义配置

```go
e.Use(middleware.ContextTimeoutWithConfig(middleware.ContextTimeoutConfig{
	Timeout: 60 * time.Second,
}))
```

## 配置

```go
type ContextTimeoutConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// ErrorHandler is a function invoked when an error arises during middleware execution.
	ErrorHandler func(c *echo.Context, err error) error

	// Timeout configures the timeout for the middleware.
	Timeout time.Duration
}
```

### 默认配置

```go
// Effective defaults applied when fields are left unset (Timeout is required).
ContextTimeoutConfig{
	Skipper: DefaultSkipper,
}
```
