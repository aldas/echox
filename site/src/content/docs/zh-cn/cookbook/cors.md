---
title: CORS
description: 使用允许列表或自定义 origin 函数启用 Cross-Origin Resource Sharing。
sidebar:
  order: 4
---

[CORS 中间件](/zh-cn/middleware/cors/)控制哪些 origin 可以访问你的 API。你可以传入固定的允许
origin 列表，也可以提供一个按请求决定的函数。

## origin 允许列表

把允许的 origin 直接传给 `middleware.CORS`。

```go
package main

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c *echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// CORS default
	// Allows requests from any origin wth GET, HEAD, PUT, POST or DELETE method.
	// e.Use(middleware.CORS("*"))

	// CORS restricted
	// Allows requests from any `https://labstack.com` or `https://labstack.net` origin
	e.Use(middleware.CORS("https://labstack.com", "https://labstack.net"))

	e.GET("/api/users", getUsers)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## 自定义 origin 函数

对于动态策略，请使用带 `UnsafeAllowOriginFunc` 的 `CORSWithConfig`。该函数接收请求上下文和
origin，并返回要回显的 origin、请求是否允许，以及可选错误。

```go
package main

import (
	"context"
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var (
	users = []string{"Joe", "Veer", "Zion"}
)

func getUsers(c *echo.Context) error {
	return c.JSON(http.StatusOK, users)
}

// allowOrigin takes the origin as an argument and returns:
// - origin to add to the response Access-Control-Allow-Origin header
// - whether the request is allowed or not
// - an optional error. this will stop handler chain execution and return an error response.
//
// return origin, true, err  // blocks request with error
// return origin, true, nil  // allows CSRF request through
// return origin, false, nil // falls back to legacy token logic
func allowOrigin(c *echo.Context, origin string) (string, bool, error) {
	// In this example we use a naive suffix check but we can imagine various
	// kind of custom logic. For example, an external datasource could be used
	// to maintain the list of allowed origins.
	if strings.HasSuffix(origin, ".example.com") {
		return origin, true, nil
	}
	return "", false, nil
}

func main() {
	e := echo.New()
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// CORS restricted with a custom function to allow origins
	// and with the GET, PUT, POST or DELETE methods allowed.
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		UnsafeAllowOriginFunc: allowOrigin,
		AllowMethods:          []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	e.GET("/api/users", getUsers)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
