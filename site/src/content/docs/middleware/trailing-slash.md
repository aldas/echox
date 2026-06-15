---
title: Trailing Slash
description: Add or remove a trailing slash from the request URI.
sidebar:
  order: 25
---

## Add trailing slash

Add trailing slash middleware adds a trailing slash to the request URI.

### Usage

```go
e := echo.New()
e.Pre(middleware.AddTrailingSlash())
```

## Remove trailing slash

Remove trailing slash middleware removes a trailing slash from the request URI.

### Usage

```go
e := echo.New()
e.Pre(middleware.RemoveTrailingSlash())
```

## Custom configuration

```go
e := echo.New()
e.Use(middleware.AddTrailingSlashWithConfig(middleware.AddTrailingSlashConfig{
	RedirectCode: http.StatusMovedPermanently,
}))
```

The example above adds a trailing slash to the request URI and redirects with
`301 - StatusMovedPermanently`.

## Configuration

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
