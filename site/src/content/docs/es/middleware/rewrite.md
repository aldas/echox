---
title: Rewrite
description: Reescribe el path de la URL según reglas configuradas.
sidebar:
  order: 21
---

El middleware Rewrite reescribe el path de la URL según las reglas proporcionadas. Es útil para
compatibilidad hacia atrás o para crear enlaces más limpios y descriptivos.

## Uso

```go
e.Pre(middleware.Rewrite(map[string]string{
	"/old":              "/new",
	"/api/*":            "/$1",
	"/js/*":             "/public/javascripts/$1",
	"/users/*/orders/*": "/user/$1/order/$2",
}))
```

Los valores capturados en asteriscos pueden obtenerse por índice, por ejemplo `$1`, `$2`, etc.
Cada asterisco es no-greedy (se traduce a un grupo de captura `(.*?)`); al usar múltiples
asteriscos, un `*` final coincide con el resto del path.

:::caution
El middleware Rewrite debe registrarse mediante `Echo#Pre()` para que se ejecute antes del router.
:::

## Configuración personalizada

```go
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))
```

## Configuración

```go
type RewriteConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Rules defines the URL path rewrite rules. The values captured in asterisk can be
	// retrieved by index e.g. $1, $2 and so on.
	// Example:
	// "/old":              "/new",
	// "/api/*":            "/$1",
	// "/js/*":             "/public/javascripts/$1",
	// "/users/*/orders/*": "/user/$1/order/$2",
	// Required.
	Rules map[string]string

	// RegexRules defines the URL path rewrite rules using regexp.Regexp with captures.
	// Every capture group in the values can be retrieved by index e.g. $1, $2 and so on.
	// Example:
	// "^/old/[0.9]+/":     "/new",
	// "^/api/.+?/(.*)":     "/v2/$1",
	RegexRules map[*regexp.Regexp]string
}
```

Configuración por defecto:

| Nombre  | Valor          |
| ------- | -------------- |
| Skipper | DefaultSkipper |

### Reglas basadas en regex

Para rewriting avanzado de paths, también se pueden definir reglas usando expresiones regulares.
Los grupos de captura normales se pueden definir con `()` y referenciar por índice
(`$1`, `$2`, ...) en el path reescrito.

`RegexRules` y `Rules` normales se pueden combinar.

```go
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{
	Rules: map[string]string{
		"^/v1/*": "/v2/$1",
	},
	RegexRules: map[*regexp.Regexp]string{
		regexp.MustCompile("^/foo/([0-9].*)"):  "/num/$1",
		regexp.MustCompile("^/bar/(.+?)/(.*)"): "/baz/$2/$1",
	},
}))
```
