---
title: Manejo de errores
description: Manejo centralizado de errores HTTP devolviendo errores desde handlers y middleware.
sidebar:
  order: 6
---

Echo promueve el manejo **centralizado** de errores: los handlers y middleware devuelven un
`error`, y un único handler de errores lo convierte en una response HTTP. Esto mantiene el logging
y el formato de responses en un solo lugar.

Devuelve un `error` plano o un `*echo.HTTPError`:

```go
e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		if !authenticated(c) {
			// invalid credentials → abort with 401
			return echo.NewHTTPError(http.StatusUnauthorized, "Please provide valid credentials")
		}
		return next(c)
	}
})
```

`echo.NewHTTPError(code)` sin mensaje usa el texto del estado (por ejemplo, `"Unauthorized"`).
Echo también incluye errores sentinel como `echo.ErrBadRequest`, `echo.ErrNotFound` y
`echo.ErrUnauthorized`.

## Handler de errores por defecto

El handler por defecto de Echo responde en JSON:

```json
{ "message": "error connecting to redis" }
```

Un `error` plano se convierte en `500 Internal Server Error` (el mensaje original se incluye
cuando se ejecuta con errores expuestos). Un `*HTTPError` usa su código de estado y mensaje.

## Handler de errores personalizado

Define el tuyo mediante `e.HTTPErrorHandler`; es útil para páginas de error, notificaciones o
enviar errores a un sistema centralizado.

Comprueba si la response ya se envió con `echo.UnwrapResponse()`, y encuentra un código de
estado en la cadena de errores mediante `echo.HTTPStatusCoder`:

```go
func customHTTPErrorHandler(c *echo.Context, err error) {
	if resp, uErr := echo.UnwrapResponse(c.Response()); uErr == nil {
		if resp.Committed {
			return // already sent by a handler/middleware
		}
	}

	code := http.StatusInternalServerError
	var sc echo.HTTPStatusCoder
	if errors.As(err, &sc) {
		if tmp := sc.StatusCode(); tmp != 0 {
			code = tmp
		}
	}

	var cErr error
	if c.Request().Method == http.MethodHead {
		cErr = c.NoContent(code)
	} else {
		cErr = c.File(fmt.Sprintf("%d.html", code)) // e.g. 404.html, 500.html
	}
	if cErr != nil {
		c.Logger().Error("failed to send error page", "error", errors.Join(err, cErr))
	}
}

e.HTTPErrorHandler = customHTTPErrorHandler
```

:::tip
En lugar del logger, o además de él, reenvía errores a un servicio externo como
Sentry, Elasticsearch o Splunk desde el handler central.
:::
