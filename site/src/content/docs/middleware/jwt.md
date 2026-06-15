---
title: JWT
description: JSON Web Token authentication middleware provided by the echo-jwt module.
sidebar:
  order: 10
---

The JWT middleware provides JSON Web Token (JWT) authentication. It lives in a separate
module: [github.com/labstack/echo-jwt](https://github.com/labstack/echo-jwt).

Behavior:

- For a valid token, it sets the user in the context and calls the next handler.
- For an invalid token, it sends a `401 Unauthorized` response.
- For a missing or invalid `Authorization` header, it sends a `400 Bad Request` response.

## Dependencies

```go
import "github.com/labstack/echo-jwt/v5"
```

## Usage

```go
e.Use(echojwt.JWT([]byte("secret")))
```

## Custom configuration

```go
e.Use(echojwt.WithConfig(echojwt.Config{
	SigningKey: []byte("secret"),
}))
```

## Configuration

```go
type Config struct {
	// Skipper defines a function to skip middleware.
	Skipper middleware.Skipper

	// BeforeFunc defines a function which is executed just before the middleware.
	BeforeFunc middleware.BeforeFunc

	// SuccessHandler defines a function executed for a valid token. If it returns an
	// error, the middleware stops the handler chain and returns that error.
	SuccessHandler func(c *echo.Context) error

	// ErrorHandler defines a function executed when all lookups have been done and none
	// passed the Validator. It runs with the last missing (ErrExtractionValueMissing)
	// or invalid key, and may be used to define a custom JWT error.
	//
	// Note: when the error handler swallows the error (returns nil), the middleware
	// continues the handler chain. This is useful when part of your site/api is public
	// and offers extra features for authorized users; the handler can set a default
	// public JWT token value in the request and continue.
	ErrorHandler func(c *echo.Context, err error) error

	// ContinueOnIgnoredError allows the next middleware/handler to be called when the
	// ErrorHandler ignores the error (returns nil).
	ContinueOnIgnoredError bool

	// ContextKey is the key under which user information from the token is stored in the context.
	// Optional. Default value "user".
	ContextKey string

	// SigningKey is the signing key used to validate the token. One of the three options
	// to provide a token validation key. Order of precedence: user-defined KeyFunc,
	// SigningKeys, then SigningKey.
	// Required if neither a user-defined KeyFunc nor SigningKeys is provided.
	SigningKey any

	// SigningKeys is a map of signing keys to validate tokens using the kid field. One of
	// the three options to provide a token validation key.
	// Required if neither a user-defined KeyFunc nor SigningKey is provided.
	SigningKeys map[string]any

	// SigningMethod is the signing method used to check the token's signing algorithm.
	// Not checked when a user-defined KeyFunc is provided.
	// Optional. Default value HS256.
	SigningMethod string

	// KeyFunc supplies the public key for token validation. It must verify the signing
	// algorithm and select the proper key. Useful when tokens are issued by an external
	// party. When provided, SigningKey, SigningKeys and SigningMethod are ignored.
	// One of the three options to provide a token validation key, and not used if a
	// custom ParseTokenFunc is set.
	KeyFunc jwt.Keyfunc

	// TokenLookup is a string in the form "<source>:<name>" or
	// "<source>:<name>,<source>:<name>" used to extract the token from the request.
	// Optional. Default value "header:Authorization".
	// Possible values:
	// - "header:<name>" or "header:<name>:<cut-prefix>"
	//   <cut-prefix> trims a static prefix from the extracted value. For JWT tokens with
	//   `Authorization: Bearer <token>`, the prefix to cut is `Bearer ` (note the space).
	//   If the prefix is empty, the whole value is returned.
	// - "query:<name>"
	// - "param:<name>"
	// - "cookie:<name>"
	// - "form:<name>"
	// Multiple sources example: "header:Authorization:Bearer ,cookie:myowncookie".
	TokenLookup string

	// TokenLookupFuncs is a list of user-defined functions that extract the JWT token
	// from the context. One of two options to provide a token extractor. Order of
	// precedence: TokenLookupFuncs, then TokenLookup. Both may be provided.
	TokenLookupFuncs []middleware.ValuesExtractor

	// ParseTokenFunc parses the token from the given auth string, returning an error when
	// parsing fails or the token is invalid.
	// Defaults to an implementation using github.com/golang-jwt/jwt.
	ParseTokenFunc func(c *echo.Context, auth string) (any, error)

	// NewClaimsFunc returns the extendable claims defining token content. Used by the
	// default ParseTokenFunc; not used if a custom ParseTokenFunc is set.
	// Optional. Defaults to a function returning jwt.MapClaims.
	NewClaimsFunc func(c *echo.Context) jwt.Claims
}
```

## Example

See the [JWT cookbook](/cookbook/jwt/) for a complete example.
