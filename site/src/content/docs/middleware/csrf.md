---
title: CSRF
description: Cross-Site Request Forgery protection using Sec-Fetch-Site metadata and token validation.
sidebar:
  order: 7
---

Cross-Site Request Forgery (CSRF, sometimes pronounced "sea-surf", or XSRF) is a type of
malicious exploit where unauthorized commands are transmitted from a user that a website
trusts.

## Usage

```go
e.Use(middleware.CSRF())
```

## How it works

The CSRF middleware supports the
[`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)
header as a modern, defense-in-depth approach to
[CSRF protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#fetch-metadata-headers),
implementing the OWASP-recommended Fetch Metadata API alongside the traditional
token-based mechanism.

Modern browsers automatically send the `Sec-Fetch-Site` header with every request,
indicating the relationship between the request origin and the target. The middleware
uses this to make a security decision:

- **`same-origin`** or **`none`** — allowed (exact origin match or direct user navigation)
- **`same-site`** — falls back to token validation (for example, subdomain to main domain)
- **`cross-site`** — blocked by default with a `403` error for unsafe methods (POST, PUT, DELETE, PATCH)

For browsers that do not send this header (older browsers), the middleware seamlessly
falls back to traditional token-based CSRF protection.

Two options tune `Sec-Fetch-Site` behavior:

- `TrustedOrigins []string` — allowlist specific origins for cross-site requests (useful for OAuth callbacks, webhooks)
- `AllowSecFetchSiteFunc func(c *echo.Context) (bool, error)` — custom logic for same-site/cross-site validation

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

## Token-based protection

```go
e := echo.New()
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup: "header:X-XSRF-TOKEN",
}))
```

The example above extracts the CSRF token from the `X-XSRF-TOKEN` request header.

Reading the token from a cookie instead:

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

## Accessing the CSRF token

- **Server-side** — the token is available from the context under `ContextKey` and can be passed to the client via a template.
- **Client-side** — the token can be read from the CSRF cookie.

## Configuration

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

### Default configuration

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

## Full example

A complete, runnable example is available in the
[echox cookbook](https://github.com/labstack/echox/blob/master/cookbook/csrf/main.go).
