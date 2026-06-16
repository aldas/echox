---
title: CSRF
description: Proteção Cross-Site Request Forgery usando metadados Sec-Fetch-Site e validação de token.
sidebar:
  order: 7
---

Cross-Site Request Forgery (CSRF, às vezes pronunciado "sea-surf", ou XSRF) é um tipo de
exploit malicioso em que comandos não autorizados são transmitidos a partir de um usuário em que um site
confia.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Use(middleware.CSRF())
```

## Como funciona

O middleware CSRF oferece suporte ao header
[`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)
como uma abordagem moderna de defense-in-depth para
[proteção CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#fetch-metadata-headers),
implementando a Fetch Metadata API recomendada pela OWASP junto do mecanismo tradicional
baseado em token.

Navegadores modernos enviam automaticamente o header `Sec-Fetch-Site` com cada request,
indicando a relação entre a origem do request e o destino. O middleware
usa isso para tomar uma decisão de segurança:

- **`same-origin`** ou **`none`** — permitido (correspondência exata de origem ou navegação direta do usuário)
- **`same-site`** — recorre à validação de token (por exemplo, subdomínio para domínio principal)
- **`cross-site`** — bloqueado por padrão com um erro `403` para métodos inseguros (POST, PUT, DELETE, PATCH)

Para navegadores que não enviam este header (navegadores mais antigos), o middleware recorre
automaticamente à proteção CSRF tradicional baseada em token.

Duas opções ajustam o comportamento de `Sec-Fetch-Site`:

- `TrustedOrigins []string` — allowlist de origens específicas para requests cross-site (útil para callbacks OAuth, webhooks)
- `AllowSecFetchSiteFunc func(c *echo.Context) (bool, error)` — lógica customizada para validação same-site/cross-site

```go
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	// Allow OAuth callbacks from a trusted provider.
	TrustedOrigins: []string{"https://oauth-provider.com"},

	// Custom validation for same-site/cross-site requests.
	AllowSecFetchSiteFunc: func(c *echo.Context) (bool, error) {
		// Your custom authorization logic here.
		return validateCustomAuth(c), nil
		// return true, err  // blocks the request with an error
		// return true, nil  // allows the request through
		// return false, nil // falls back to legacy token logic
	},
}))
```

## Proteção baseada em token

```go
e := echo.New()
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup: "header:X-XSRF-TOKEN",
}))
```

O exemplo acima extrai o token CSRF do header de request `X-XSRF-TOKEN`.

Lendo o token de um cookie:

```go
middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup:    "cookie:_csrf",
	CookiePath:     "/",
	CookieDomain:   "example.com",
	CookieSecure:   true,
	CookieHTTPOnly: true,
	CookieSameSite: http.SameSiteStrictMode,
})
```

## Acessando o token CSRF

- **Server-side** — o token fica disponível no contexto sob `ContextKey` e pode ser passado ao cliente via template.
- **Client-side** — o token pode ser lido do cookie CSRF.

## Configuração

```go
type CSRFConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// TrustedOrigins permits any request with a `Sec-Fetch-Site` header whose `Origin`
	// header exactly matches one of the listed values. Values should be formatted as
	// the Origin header: "scheme://host[:port]".
	TrustedOrigins []string

	// AllowSecFetchSiteFunc allows custom behaviour for `Sec-Fetch-Site` requests that
	// are about to fail with a CSRF error, to be allowed or replaced with a custom
	// error. Applies to `same-site` and `cross-site` values.
	AllowSecFetchSiteFunc func(c *echo.Context) (bool, error)

	// TokenLength is the length of the generated token.
	// Optional. Default value 32.
	TokenLength uint8

	// TokenLookup is a string in the form "<source>:<name>" or
	// "<source>:<name>,<source>:<name>" used to extract the token from the request.
	// Optional. Default value "header:X-CSRF-Token".
	// Possible values:
	// - "header:<name>" or "header:<name>:<cut-prefix>"
	// - "query:<name>"
	// - "form:<name>"
	// Multiple sources example: "header:X-CSRF-Token,query:csrf".
	TokenLookup string `yaml:"token_lookup"`

	// Generator defines a function to generate the token.
	// Optional. Defaults to randomString(TokenLength).
	Generator func() string

	// ContextKey is the key under which the generated CSRF token is stored in the context.
	// Optional. Default value "csrf".
	ContextKey string

	// CookieName is the name of the CSRF cookie that stores the token.
	// Optional. Default value "_csrf".
	CookieName string

	// CookieDomain is the domain of the CSRF cookie.
	// Optional. Default value none.
	CookieDomain string

	// CookiePath is the path of the CSRF cookie.
	// Optional. Default value none.
	CookiePath string

	// CookieMaxAge is the max age (in seconds) of the CSRF cookie.
	// Optional. Default value 86400 (24h).
	CookieMaxAge int

	// CookieSecure indicates whether the CSRF cookie is secure.
	// Optional. Default value false.
	CookieSecure bool

	// CookieHTTPOnly indicates whether the CSRF cookie is HTTP only.
	// Optional. Default value false.
	CookieHTTPOnly bool

	// CookieSameSite indicates the SameSite mode of the CSRF cookie.
	// Optional. Default value SameSiteDefaultMode.
	CookieSameSite http.SameSite

	// ErrorHandler defines a function that returns custom errors.
	ErrorHandler func(c *echo.Context, err error) error
}
```

### Configuração padrão

```go
var DefaultCSRFConfig = CSRFConfig{
	Skipper:        DefaultSkipper,
	TokenLength:    32,
	TokenLookup:    "header:" + echo.HeaderXCSRFToken,
	ContextKey:     "csrf",
	CookieName:     "_csrf",
	CookieMaxAge:   86400,
	CookieSameSite: http.SameSiteDefaultMode,
}
```

## Exemplo completo

Um exemplo completo e executável está disponível no
[echox cookbook](https://github.com/labstack/echox/blob/master/cookbook/csrf/main.go).
