---
title: Redirect
description: Redirige requests entre variantes HTTP/HTTPS y www/non-www.
sidebar:
  order: 19
---

## HTTPS Redirect

El middleware HTTPS redirect redirige requests HTTP a HTTPS. Por ejemplo,
`http://labstack.com` se redirige a `https://labstack.com`.

### Uso

```go
e := echo.New()
e.Pre(middleware.HTTPSRedirect())
```

## HTTPS WWW Redirect

HTTPS WWW redirect redirige requests HTTP a www HTTPS. Por ejemplo,
`http://labstack.com` se redirige a `https://www.labstack.com`.

### Uso

```go
e := echo.New()
e.Pre(middleware.HTTPSWWWRedirect())
```

## HTTPS NonWWW Redirect

HTTPS NonWWW redirect redirige requests HTTP a non-www HTTPS. Por ejemplo,
`http://www.labstack.com` se redirige a `https://labstack.com`.

### Uso

```go
e := echo.New()
e.Pre(middleware.HTTPSNonWWWRedirect())
```

## WWW Redirect

WWW redirect redirige requests non-www a www. Por ejemplo, `http://labstack.com` se
redirige a `http://www.labstack.com`.

### Uso

```go
e := echo.New()
e.Pre(middleware.WWWRedirect())
```

## NonWWW Redirect

NonWWW redirect redirige requests www a non-www. Por ejemplo, `http://www.labstack.com` se
redirige a `http://labstack.com`.

### Uso

```go
e := echo.New()
e.Pre(middleware.NonWWWRedirect())
```

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.HTTPSRedirectWithConfig(middleware.RedirectConfig{
	Code: http.StatusTemporaryRedirect,
}))
```

El ejemplo anterior redirige requests HTTP a HTTPS con el código de estado
`307 - StatusTemporaryRedirect`.

## Configuración

```go
type RedirectConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Status code to be used when redirecting the request.
	// Optional. Default value http.StatusMovedPermanently.
	Code int
}
```

### Configuración por defecto

```go
// Effective defaults applied when fields are left unset.
RedirectConfig{
	Skipper: DefaultSkipper,
	Code:    http.StatusMovedPermanently,
}
```
