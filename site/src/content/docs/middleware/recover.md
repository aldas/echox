---
title: Recover
description: Recover from panics anywhere in the chain and delegate to the centralized error handler.
sidebar:
  order: 18
---

Recover middleware recovers from panics anywhere in the chain, prints the stack trace, and
passes control to the centralized
[HTTPErrorHandler](/guide/customization/#http-error-handler).

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e.Use(middleware.Recover())
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
	StackSize: 1 << 10, // 1 KB
}))
```

The example above uses a `StackSize` of 1 KB and default values for `DisableStackAll` and
`DisablePrintStack`.

## Configuration

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

### Default configuration

```go
var DefaultRecoverConfig = RecoverConfig{
	Skipper:           DefaultSkipper,
	StackSize:         4 << 10, // 4 KB
	DisableStackAll:   false,
	DisablePrintStack: false,
}
```
