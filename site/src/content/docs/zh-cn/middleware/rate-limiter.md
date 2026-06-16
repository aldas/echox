---
title: 速率限制
description: 限制特定 IP 或标识符在一段时间内的请求数量。
sidebar:
  order: 17
---

`RateLimiter` 提供速率限制中间件，用于限制特定 IP 或标识符在一段时间内发送到服务器的请求数量。

默认情况下，请求记录保存在内存 store 中。默认内存实现专注于正确性，对于大量并发请求或大量不同标识符
（>16k）可能不是最佳选择。

## 用法

要为应用添加速率限制，请添加 `RateLimiter` 中间件。下面的示例使用默认内存 store，
将应用限制为 20 requests/sec：

```go
e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20.0)))
```

:::note
如果提供的 rate 是浮点数，`Burst` 会被视为 rate 向下取整后的值。
:::

## 自定义配置

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

### 错误

```go
var (
	// ErrRateLimitExceeded denotes an error raised when the rate limit is exceeded.
	ErrRateLimitExceeded = echo.NewHTTPError(http.StatusTooManyRequests, "rate limit exceeded")
	// ErrExtractorError denotes an error raised when the extractor function is unsuccessful.
	ErrExtractorError = echo.NewHTTPError(http.StatusForbidden, "error while extracting identifier")
)
```

:::tip
要实现自己的 store，请满足 `RateLimiterStore` 接口，并把它传给 `RateLimiterConfig`。
:::

## 配置

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

### 默认配置

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
