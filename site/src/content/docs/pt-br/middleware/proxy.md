---
title: Proxy
description: Middleware de reverse proxy HTTP e WebSocket com load balancing.
sidebar:
  order: 16
---

Proxy fornece um middleware de reverse proxy HTTP/WebSocket. Ele encaminha um request para um
servidor upstream usando uma técnica de load balancing configurada.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
url1, err := url.Parse("http://localhost:8081")
if err != nil {
	e.Logger.Error("failed to parse url", "error", err)
}
url2, err := url.Parse("http://localhost:8082")
if err != nil {
	e.Logger.Error("failed to parse url", "error", err)
}
e.Use(middleware.Proxy(middleware.NewRoundRobinBalancer([]*middleware.ProxyTarget{
	{
		URL: url1,
	},
	{
		URL: url2,
	},
})))
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{}))
```

## Configuração

```go
type ProxyConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Balancer defines a load balancing technique.
	// Required.
	Balancer ProxyBalancer

	// RetryCount defines the number of times a failed proxied request should be retried
	// using the next available ProxyTarget. Defaults to 0, meaning requests are never retried.
	RetryCount int

	// RetryFilter defines a function used to determine if a failed request to a
	// ProxyTarget should be retried. The RetryFilter will only be called when the number
	// of previous retries is less than RetryCount. If the function returns true, the
	// request will be retried. The provided error indicates the reason for the request
	// failure. When the ProxyTarget is unavailable, the error will be an instance of
	// echo.HTTPError with a code of http.StatusBadGateway. In all other cases, the error
	// will indicate an internal error in the Proxy middleware. When a RetryFilter is not
	// specified, all requests that fail with http.StatusBadGateway will be retried. A custom
	// RetryFilter can be provided to only retry specific requests. Note that RetryFilter is
	// only called when the request to the target fails, or an internal error in the Proxy
	// middleware has occurred. Successful requests that return a non-200 response code cannot
	// be retried.
	RetryFilter func(c *echo.Context, e error) bool

	// ErrorHandler defines a function which can be used to return custom errors from
	// the Proxy middleware. ErrorHandler is only invoked when there has been
	// either an internal error in the Proxy middleware or the ProxyTarget is
	// unavailable. Due to the way requests are proxied, ErrorHandler is not invoked
	// when a ProxyTarget returns a non-200 response. In these cases, the response
	// is already written so errors cannot be modified. ErrorHandler is only
	// invoked after all retry attempts have been exhausted.
	ErrorHandler func(c *echo.Context, err error) error

	// Rewrite defines URL path rewrite rules. The values captured in asterisk can be
	// retrieved by index e.g. $1, $2 and so on.
	// Examples:
	// "/old":              "/new",
	// "/api/*":            "/$1",
	// "/js/*":             "/public/javascripts/$1",
	// "/users/*/orders/*": "/user/$1/order/$2",
	Rewrite map[string]string

	// RegexRewrite defines rewrite rules using regexp.Regexp with captures.
	// Every capture group in the values can be retrieved by index e.g. $1, $2 and so on.
	// Example:
	// "^/old/[0.9]+/":     "/new",
	// "^/api/.+?/(.*)":    "/v2/$1",
	RegexRewrite map[*regexp.Regexp]string

	// Context key to store selected ProxyTarget into context.
	// Optional. Default value "target".
	ContextKey string

	// To customize the transport to remote.
	// Examples: If custom TLS certificates are required.
	Transport http.RoundTripper

	// ModifyResponse defines function to modify response from ProxyTarget.
	ModifyResponse func(*http.Response) error
}
```

### Configuração padrão

| Nome       | Valor          |
| ---------- | -------------- |
| Skipper    | DefaultSkipper |
| ContextKey | `target`       |

### Regras baseadas em regex

Para reescrita avançada de requests de proxy, as regras também podem ser definidas usando expressões
regulares. Grupos de captura normais podem ser definidos com `()` e referenciados por índice
(`$1`, `$2`, ...) no caminho reescrito.

Regras `RegexRewrite` e `Rewrite` normais podem ser combinadas.

```go
e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
	Balancer: rrb,
	Rewrite: map[string]string{
		"^/v1/*": "/v2/$1",
	},
	RegexRewrite: map[*regexp.Regexp]string{
		regexp.MustCompile("^/foo/([0-9].*)"):  "/num/$1",
		regexp.MustCompile("^/bar/(.+?)/(.*)"): "/baz/$2/$1",
	},
}))
```

Veja a receita de [reverse proxy](/pt-br/cookbook/reverse-proxy/) para um exemplo completo.
