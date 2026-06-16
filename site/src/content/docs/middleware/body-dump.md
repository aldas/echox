---
title: Body Dump
description: Capture request and response payloads and pass them to a handler for logging or debugging.
sidebar:
  order: 2
---

Body Dump middleware captures the request and response payloads and passes them to a
registered handler. It is generally used for debugging or logging.

:::caution
Avoid Body Dump for large payloads such as file uploads or downloads. If you must use it
on such routes, add an exception in the skipper function.
:::

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e := echo.New()
e.Use(middleware.BodyDump(func(c *echo.Context, reqBody, resBody []byte, err error) {
	// Handle the request and response bodies.
}))
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.BodyDumpWithConfig(middleware.BodyDumpConfig{}))
```

## Configuration

```go
type BodyDumpConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Handler receives the request and response payloads and the handler error, if any.
	// Required.
	Handler BodyDumpHandler

	// MaxRequestBytes limits how much of the request body to dump. If the request body
	// exceeds this limit, only the first MaxRequestBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxRequestBytes int64

	// MaxResponseBytes limits how much of the response body to dump. If the response body
	// exceeds this limit, only the first MaxResponseBytes are dumped and the handler
	// receives truncated data.
	// Default: 5 * MB (5,242,880 bytes). Set to -1 to disable limits (not recommended).
	MaxResponseBytes int64
}
```

The `Handler` has the signature:

```go
type BodyDumpHandler func(c *echo.Context, reqBody []byte, resBody []byte, err error)
```

### Default configuration

```go
// Effective defaults applied when fields are left unset (Handler is required).
BodyDumpConfig{
	Skipper:          DefaultSkipper,
	MaxRequestBytes:  5 * MB,
	MaxResponseBytes: 5 * MB,
}
```
