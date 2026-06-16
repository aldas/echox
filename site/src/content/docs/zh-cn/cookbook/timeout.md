---
title: 超时
description: 使用 ContextTimeout 中间件为处理函数应用请求超时。
sidebar:
  order: 18
---

[`ContextTimeout`](/zh-cn/middleware/context-timeout/) 中间件会在请求的 `context.Context`
上设置截止时间。截止时间到达后，上下文会被取消，监视 `c.Request().Context().Done()` 的处理函数
可以快速返回，而不是运行到完成。

在下面的示例中，中间件施加 5 秒超时，而处理函数原本需要 10 秒，因此请求会返回
`408 Request Timeout`。

## 服务器

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.ContextTimeout(5 * time.Second))

	// Route => handler
	e.GET("/", func(c *echo.Context) error {
		select {
		case <-c.Request().Context().Done():
			return echo.NewHTTPError(http.StatusRequestTimeout, "Request timed out")
		case <-time.After(10 * time.Second):
			return c.String(http.StatusOK, "Hello, World!\n")
		}
	})

	// Start server
	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
