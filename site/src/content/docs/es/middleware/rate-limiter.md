---
title: Rate Limiter
description: Limita el número de requests desde una IP o identificador particular dentro de un periodo.
sidebar:
  order: 17
---

`RateLimiter` proporciona un middleware de rate limiter que limita el número de requests enviados
al servidor desde una IP o identificador particular dentro de un periodo.

Por defecto, un store en memoria lleva la cuenta de los requests. La implementación en memoria por
defecto se centra en la corrección y puede no ser la mejor opción para un número alto de requests
concurrentes o una gran cantidad de identificadores distintos (>16k).

## Uso

Para agregar un rate limit a tu aplicación, agrega el middleware `RateLimiter`. El ejemplo siguiente
limita la aplicación a 20 requests/sec usando el store en memoria por defecto:

```go
e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20.0)))
```

:::note
Si la tasa proporcionada es un número float, `Burst` se trata como el valor redondeado hacia abajo de la tasa.
:::

## Configuración personalizada

```go
config := middleware.RateLimiterConfig{
	Skipper: middleware.DefaultSkipper,
	Store: middleware.NewRateLimiterMemoryStoreWithConfig(
		middleware.RateLimiterMemoryStoreConfig{Rate: 10, Burst: 30, ExpiresIn: 3 * time.Minute},
	),
	IdentifierExtractor: func(c *echo.Context) (string, error) {
		id := c.RealIP()
		return id, nil
	},
	ErrorHandler: func(c *echo.Context, err error) error {
		return c.JSON(http.StatusForbidden, nil)
	},
	DenyHandler: func(c *echo.Context, identifier string, err error) error {
		return c.JSON(http.StatusTooManyRequests, nil)
	},
}

e.Use(middleware.RateLimiterWithConfig(config))
```

### Errores

```go
var (
	// ErrRateLimitExceeded denotes an error raised when the rate limit is exceeded.
	ErrRateLimitExceeded = echo.NewHTTPError(http.StatusTooManyRequests, "rate limit exceeded")
	// ErrExtractorError denotes an error raised when the extractor function is unsuccessful.
	ErrExtractorError = echo.NewHTTPError(http.StatusForbidden, "error while extracting identifier")
)
```

:::tip
Para implementar tu propio store, satisface la interfaz `RateLimiterStore` y pásalo a
`RateLimiterConfig`.
:::

## Configuración

```go
type RateLimiterConfig struct {
	Skipper    Skipper
	BeforeFunc BeforeFunc
	// IdentifierExtractor uses echo.Context to extract the identifier for a visitor.
	IdentifierExtractor Extractor
	// Store defines a store for the rate limiter.
	Store RateLimiterStore
	// ErrorHandler provides a handler to be called when IdentifierExtractor returns a non-nil error.
	ErrorHandler func(c *echo.Context, err error) error
	// DenyHandler provides a handler to be called when RateLimiter denies access.
	DenyHandler func(c *echo.Context, identifier string, err error) error
}
```

### Configuración por defecto

```go
// DefaultRateLimiterConfig defines default values for RateLimiterConfig.
var DefaultRateLimiterConfig = RateLimiterConfig{
	Skipper: DefaultSkipper,
	IdentifierExtractor: func(c *echo.Context) (string, error) {
		id := c.RealIP()
		return id, nil
	},
	ErrorHandler: func(c *echo.Context, err error) error {
		return &echo.HTTPError{
			Code:     ErrExtractorError.Code,
			Message:  ErrExtractorError.Message,
			Internal: err,
		}
	},
	DenyHandler: func(c *echo.Context, identifier string, err error) error {
		return &echo.HTTPError{
			Code:     ErrRateLimitExceeded.Code,
			Message:  ErrRateLimitExceeded.Message,
			Internal: err,
		}
	},
}
```
