---
title: Method Override
description: Override the HTTP method of a POST request via header, form, or query value.
sidebar:
  order: 13
---

Method Override middleware reads the overridden method from the request and uses it
instead of the original method.

:::note
For security reasons, only the `POST` method can be overridden.
:::

## Usage

```go
e.Pre(middleware.MethodOverride())
```

## Custom configuration

```go
e := echo.New()
e.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{
	Getter: middleware.MethodFromForm("_method"),
}))
```

The method can be sourced with `MethodFromHeader`, `MethodFromForm`, or `MethodFromQuery`.

## Configuration

```go
type MethodOverrideConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Getter is a function that gets the overridden method from the request.
	// Optional. Default value MethodFromHeader(echo.HeaderXHTTPMethodOverride).
	Getter MethodOverrideGetter
}
```

### Default configuration

```go
DefaultMethodOverrideConfig = MethodOverrideConfig{
	Skipper: DefaultSkipper,
	Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),
}
```
