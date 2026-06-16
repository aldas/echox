---
title: Rate Limiter
description: Limite o número de requests de um IP ou identificador específico dentro de um período.
sidebar:
  order: 17
---

`RateLimiter` fornece um middleware de rate limiter que limita o número de requests enviados ao
servidor a partir de um IP ou identificador específico dentro de um período.

Por padrão, um store em memória acompanha os requests. A implementação em memória padrão
é focada em correção e pode não ser a melhor opção para um alto número de requests
concorrentes ou um grande número de identificadores distintos (>16k).

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

Para adicionar um limite de taxa à sua aplicação, adicione o middleware `RateLimiter`. O exemplo abaixo
limita a aplicação a 20 requests/segundo usando o store em memória padrão:

```go
e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20.0)))
```

:::note
Se a taxa fornecida for um número float, `Burst` é tratado como o valor arredondado para baixo da taxa.
:::

## Configuração customizada

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

### Erros

```go
var (
	// ErrRateLimitExceeded denotes an error raised when the rate limit is exceeded.
	ErrRateLimitExceeded = echo.NewHTTPError(http.StatusTooManyRequests, "rate limit exceeded")
	// ErrExtractorError denotes an error raised when the extractor function is unsuccessful.
	ErrExtractorError = echo.NewHTTPError(http.StatusForbidden, "error while extracting identifier")
)
```

:::tip
Para implementar seu próprio store, satisfaça a interface `RateLimiterStore` e passe-o para
`RateLimiterConfig`.
:::

## Configuração

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

### Configuração padrão

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
