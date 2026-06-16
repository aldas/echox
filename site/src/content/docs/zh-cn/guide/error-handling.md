---
title: 错误处理
description: 通过从处理函数和中间件返回错误来集中处理 HTTP 错误。
sidebar:
  order: 6
---

Echo 提倡**集中式**错误处理：处理函数和中间件返回 `error`，由单一错误处理函数将其转换为
HTTP 响应。这样可以把日志记录和响应格式化放在同一个位置。

返回普通 `error` 或 `*echo.HTTPError`：

```go
e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		if !authenticated(c) {
			// invalid credentials → abort with 401
			return echo.NewHTTPError(http.StatusUnauthorized, "Please provide valid credentials")
		}
		return next(c)
	}
})
```

没有消息的 `echo.NewHTTPError(code)` 会使用状态文本（例如 `"Unauthorized"`）。
Echo 还提供 `echo.ErrBadRequest`、`echo.ErrNotFound` 和 `echo.ErrUnauthorized`
等哨兵错误。

## 默认错误处理函数

Echo 的默认处理函数以 JSON 响应：

```json
{ "message": "error connecting to redis" }
```

普通 `error` 会变成 `500 Internal Server Error`（在暴露错误运行时会包含原始消息）。
`*HTTPError` 会使用自身的状态码和消息。

## 自定义错误处理函数

通过 `e.HTTPErrorHandler` 设置你自己的处理函数，这适用于错误页面、通知，
或把错误发送到集中式系统。

使用 `echo.UnwrapResponse()` 检查响应是否已经发送，并通过 `echo.HTTPStatusCoder`
在错误链中查找状态码：

```go
func customHTTPErrorHandler(c *echo.Context, err error) {
	if resp, uErr := echo.UnwrapResponse(c.Response()); uErr == nil {
		if resp.Committed {
			return // already sent by a handler/middleware
		}
	}

	code := http.StatusInternalServerError
	var sc echo.HTTPStatusCoder
	if errors.As(err, &sc) {
		if tmp := sc.StatusCode(); tmp != 0 {
			code = tmp
		}
	}

	var cErr error
	if c.Request().Method == http.MethodHead {
		cErr = c.NoContent(code)
	} else {
		cErr = c.File(fmt.Sprintf("%d.html", code)) // e.g. 404.html, 500.html
	}
	if cErr != nil {
		c.Logger().Error("failed to send error page", "error", errors.Join(err, cErr))
	}
}

e.HTTPErrorHandler = customHTTPErrorHandler
```

:::tip
除了 logger 之外（或同时），也可以从集中处理函数把错误转发到 Sentry、Elasticsearch
或 Splunk 等外部服务。
:::
