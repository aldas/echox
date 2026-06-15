---
title: Body Limit
description: Reject requests whose body exceeds a configured maximum size.
sidebar:
  order: 3
---

Body Limit middleware sets the maximum allowed size for a request body. If the size
exceeds the configured limit, it sends a `413 Request Entity Too Large` response.

The limit is enforced against both the `Content-Length` request header and the actual
content read, which makes it resilient against spoofed headers. The limit is specified
in bytes.

## Usage

```go
e := echo.New()
e.Use(middleware.BodyLimit(2_097_152)) // 2 MB
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.BodyLimitWithConfig(middleware.BodyLimitConfig{}))
```

## Configuration

```go
type BodyLimitConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// LimitBytes is the maximum allowed size in bytes for a request body.
	LimitBytes int64
}
```

### Default configuration

```go
// Effective defaults applied when fields are left unset (Limit is required).
BodyLimitConfig{
	Skipper: DefaultSkipper,
}
```
