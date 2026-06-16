---
title: Gzip
description: Compress HTTP responses with the gzip compression scheme.
sidebar:
  order: 9
---

Gzip middleware compresses the HTTP response using the gzip compression scheme.

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e.Use(middleware.Gzip())
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Level: 5,
}))
```

:::tip
Pass a skipper to disable gzip for certain URLs.
:::

```go
e := echo.New()
e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
	Skipper: func(c *echo.Context) bool {
		return strings.Contains(c.Path(), "metrics") // change "metrics" to your own path
	},
}))
```

## Configuration

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

### Default configuration

```go
// Effective defaults applied when fields are left unset.
GzipConfig{
	Skipper:   DefaultSkipper,
	Level:     -1,
	MinLength: 0,
}
```
