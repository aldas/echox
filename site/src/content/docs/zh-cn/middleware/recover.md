---
title: Recover
description: 从链中任意位置的 panic 中恢复，并委托给集中式错误处理函数。
sidebar:
  order: 18
---

Recover 中间件会从链中任意位置的 panic 中恢复，打印堆栈跟踪，并把控制权传给集中式
[HTTPErrorHandler](/zh-cn/guide/customization/#http-error-handler)。

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

```go
e.Use(middleware.Recover())
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
	StackSize: 1 << 10, // 1 KB
}))
```

上面的示例使用 `StackSize` 为 1 KB，并对 `DisableStackAll` 和 `DisablePrintStack` 使用默认值。

## 配置

```go
type RecoverConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Size of the stack to be printed.
	// Optional. Default value 4KB.
	StackSize int

	// DisableStackAll disables formatting stack traces of all other goroutines
	// into the buffer after the trace for the current goroutine.
	// Optional. Default value false.
	DisableStackAll bool

	// DisablePrintStack disables printing the stack trace.
	// Optional. Default value false.
	DisablePrintStack bool
}
```

### 默认配置

```go
var DefaultRecoverConfig = RecoverConfig{
	Skipper:           DefaultSkipper,
	StackSize:         4 << 10, // 4 KB
	DisableStackAll:   false,
	DisablePrintStack: false,
}
```
