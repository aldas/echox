---
title: 代理
description: 带负载均衡的 HTTP 和 WebSocket 反向代理中间件。
sidebar:
  order: 16
---

Proxy 提供 HTTP/WebSocket 反向代理中间件。它会使用配置的负载均衡技术将请求转发到上游服务器。

## 用法

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

## 自定义配置

```go
e := echo.New()
e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{}))
```

## 配置

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

### 默认配置

| 名称       | 值             |
| ---------- | -------------- |
| Skipper    | DefaultSkipper |
| ContextKey | `target`       |

### 基于正则表达式的规则

对于代理请求的高级重写，也可以使用正则表达式定义规则。可以用 `()` 定义普通捕获组，
并在重写后的路径中按索引引用（`$1`、`$2` 等）。

`RegexRewrite` 可以和普通 `Rewrite` 规则组合使用。

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

完整示例请参见[反向代理](/zh-cn/cookbook/reverse-proxy/) cookbook。
