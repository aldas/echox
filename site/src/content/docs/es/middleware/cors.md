---
title: CORS
description: Middleware Cross-Origin Resource Sharing para control de acceso seguro entre dominios.
sidebar:
  order: 6
---

El middleware CORS implementa la especificación [CORS](https://fetch.spec.whatwg.org/#http-cors-protocol).
CORS da a los servidores web controles de acceso entre dominios, lo que permite transferencias de datos seguras entre dominios.

## Uso

```go
e.Use(middleware.CORS("https://example.com", "https://subdomain.example.com"))
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
	AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
}))
```

## Configuración

```go
type CORSConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// AllowOrigins determines the value of the Access-Control-Allow-Origin response
	// header, defining the list of origins that may access the resource.
	//
	// An origin consists of: scheme + "://" + host + optional ":" + port.
	// A wildcard may be used, but it must be set explicitly as []string{"*"}.
	// Example: `https://example.com`, `http://example.com:8080`, `*`.
	//
	// Security: use extreme caution when handling the origin and carefully validate any
	// logic. Attackers may register hostile domain names. See
	// https://blog.portswigger.net/2016/10/exploiting-cors-misconfigurations-for.html
	//
	// Mandatory.
	AllowOrigins []string

	// UnsafeAllowOriginFunc is an optional custom function to validate the origin. It
	// takes the origin and returns the allowed origin, whether it is allowed, and an
	// error (returned immediately by the handler). If set, AllowOrigins is ignored.
	//
	// Security: use extreme caution when handling the origin. Attackers may register
	// hostile (sub)domain names.
	//
	// Sub-domain check example:
	//	UnsafeAllowOriginFunc: func(c *echo.Context, origin string) (string, bool, error) {
	//		if strings.HasSuffix(origin, ".example.com") {
	//			return origin, true, nil
	//		}
	//		return "", false, nil
	//	}
	//
	// Optional.
	UnsafeAllowOriginFunc func(c *echo.Context, origin string) (allowedOrigin string, allowed bool, err error)

	// AllowMethods determines the value of the Access-Control-Allow-Methods response
	// header, used in response to a preflight request.
	//
	// Optional. Defaults to GET, HEAD, PUT, PATCH, POST, DELETE. If left empty, the
	// middleware fills the preflight Access-Control-Allow-Methods header from the
	// `Allow` header that the router set into the context.
	AllowMethods []string

	// AllowHeaders determines the value of the Access-Control-Allow-Headers response
	// header, indicating which HTTP headers can be used in the actual request.
	//
	// Optional. Defaults to an empty list.
	AllowHeaders []string

	// AllowCredentials determines the value of the Access-Control-Allow-Credentials
	// response header, indicating whether the response can be exposed when the
	// credentials mode is true.
	//
	// Optional. Default value false, in which case the header is not set.
	//
	// Security: avoid using AllowCredentials = true together with AllowOrigins = *.
	AllowCredentials bool

	// ExposeHeaders determines the value of Access-Control-Expose-Headers, the list of
	// headers clients are allowed to access.
	//
	// Optional. Default value []string{}, in which case the header is not set.
	ExposeHeaders []string

	// MaxAge determines the value of the Access-Control-Max-Age response header, how long
	// (in seconds) the results of a preflight request can be cached. The header is set
	// only if MaxAge != 0; a negative value sends "0", instructing browsers not to cache.
	//
	// Optional. Default value 0 — the header is not sent.
	MaxAge int
}
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset.
CORSConfig{
	Skipper:      DefaultSkipper,
	AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
}
```

:::caution[Seguridad]
Nunca combines `AllowCredentials = true` con un wildcard `AllowOrigins`. Cuando necesites
validación dinámica de origin, usa `UnsafeAllowOriginFunc` y valida con cuidado:
los atacantes pueden registrar nombres de (sub)dominio hostiles.
:::
