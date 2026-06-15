---
title: Customization
description: Customize Echo's logger, validator, binder, renderer, serializer, and error handling.
sidebar:
  order: 12
---

Echo exposes a set of fields on the `Echo` instance that let you replace built-in
behavior with your own implementations.

## Logging

`Echo#Logger` writes structured logs. The default handler emits JSON to `os.Stdout`.

### Custom logger

The logger is an `*slog.Logger`, so you can register any `slog` handler:

```go
e.Logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
```

## Validator

`Echo#Validator` registers a validator for request payload validation.

[Learn more](/guide/request/#validate-data)

## Custom binder

`Echo#Binder` registers a custom binder for binding request payloads.

[Learn more](/guide/binding/#custom-binder)

## Custom JSON serializer

`Echo#JSONSerializer` registers a custom JSON serializer. See `DefaultJSONSerializer`
in [json.go](https://github.com/labstack/echo/blob/master/json.go).

## Renderer

`Echo#Renderer` registers a renderer for template rendering.

[Learn more](/guide/templates/)

## HTTP error handler

`Echo#HTTPErrorHandler` registers a custom HTTP error handler.

[Learn more](/guide/error-handling/)

## Route callback

`Echo#OnAddRoute` registers a callback invoked whenever a new route is added to the
router.

## IP extractor

`Echo#IPExtractor` controls how the real client IP address is determined. To
retrieve it reliably and securely, your application must be aware of your entire
infrastructure.

[Learn more](/guide/ip-address/)
