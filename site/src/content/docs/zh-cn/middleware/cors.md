---
title: CORS
description: 用于安全跨域访问控制的 Cross-Origin Resource Sharing 中间件。
sidebar:
  order: 6
---

CORS 中间件实现了 [CORS](https://fetch.spec.whatwg.org/#http-cors-protocol) 规范。
CORS 为 Web 服务器提供跨域访问控制，从而支持安全的跨域数据传输。

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

```go
e.Use(middleware.CORS("https://example.com", "https://subdomain.example.com"))
```

## 自定义配置

```go
e := echo.New()
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
	AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
}))
```

## 配置

```go
type CORSConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// AllowOrigins determines the value of the Access-Control-Allow-Origin response
	// header, defining the list of origins that may access the resource.
	//
	// An origin consists of: scheme + "://" + host + optional ":" + port.
	// A wildcard may be used, but it must be set explicitly as []string{"*"}.
	// Example: `https://example.com`, `http://example.com:8080`, `*`.
	//
	// Security: use extreme caution when handling the origin and carefully validate any
	// logic. Attackers may register hostile domain names. See
	// https://blog.portswigger.net/2016/10/exploiting-cors-misconfigurations-for.html
	//
	// Mandatory.
	AllowOrigins []string

	// UnsafeAllowOriginFunc is an optional custom function to validate the origin. It
	// takes the origin and returns the allowed origin, whether it is allowed, and an
	// error (returned immediately by the handler). If set, AllowOrigins is ignored.
	//
	// Security: use extreme caution when handling the origin. Attackers may register
	// hostile (sub)domain names.
	//
	// Sub-domain check example:
	//	UnsafeAllowOriginFunc: func(c *echo.Context, origin string) (string, bool, error) {
	//		if strings.HasSuffix(origin, ".example.com") {
	//			return origin, true, nil
	//		}
	//		return "", false, nil
	//	}
	//
	// Optional.
	UnsafeAllowOriginFunc func(c *echo.Context, origin string) (allowedOrigin string, allowed bool, err error)

	// AllowMethods determines the value of the Access-Control-Allow-Methods response
	// header, used in response to a preflight request.
	//
	// Optional. Defaults to GET, HEAD, PUT, PATCH, POST, DELETE. If left empty, the
	// middleware fills the preflight Access-Control-Allow-Methods header from the
	// `Allow` header that the router set into the context.
	AllowMethods []string

	// AllowHeaders determines the value of the Access-Control-Allow-Headers response
	// header, indicating which HTTP headers can be used in the actual request.
	//
	// Optional. Defaults to an empty list.
	AllowHeaders []string

	// AllowCredentials determines the value of the Access-Control-Allow-Credentials
	// response header, indicating whether the response can be exposed when the
	// credentials mode is true.
	//
	// Optional. Default value false, in which case the header is not set.
	//
	// Security: avoid using AllowCredentials = true together with AllowOrigins = *.
	AllowCredentials bool

	// ExposeHeaders determines the value of Access-Control-Expose-Headers, the list of
	// headers clients are allowed to access.
	//
	// Optional. Default value []string{}, in which case the header is not set.
	ExposeHeaders []string

	// MaxAge determines the value of the Access-Control-Max-Age response header, how long
	// (in seconds) the results of a preflight request can be cached. The header is set
	// only if MaxAge != 0; a negative value sends "0", instructing browsers not to cache.
	//
	// Optional. Default value 0 — the header is not sent.
	MaxAge int
}
```

### 默认配置

```go
// Effective defaults applied when fields are left unset.
CORSConfig{
	Skipper:      DefaultSkipper,
	AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
}
```

## 安全

通配符 origin（`AllowOrigins: []string{"*"}`）与 `AllowCredentials: true` 组合使用非常危险：
它会把**任意**请求的 `Origin` 原样反射到 `Access-Control-Allow-Origin` 中，使得任意网站上的页面
都能向你的 API 发起携带凭证的跨域请求（参见 [Exploiting CORS misconfigurations](https://blog.portswigger.net/2016/10/exploiting-cors-misconfigurations-for.html)）。

Echo 会拒绝这种组合，而不是构建不安全的中间件：`CORS` 和 `CORSWithConfig` 会 **panic**，
`CORSConfig.ToMiddleware()` 会返回错误。要允许携带凭证的请求，请显式列出受信任的 origin：

```go
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	AllowOrigins:     []string{"https://example.com"},
	AllowCredentials: true,
}))
```

需要动态 origin 验证时，请使用 `UnsafeAllowOriginFunc` 并仔细验证每个 origin——
攻击者可能注册仿冒或恶意的（子）域名。
