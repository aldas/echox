---
title: 请求 ID
description: 为每个请求生成唯一 ID。
sidebar:
  order: 20
---

Request ID 中间件会为请求生成唯一 ID。

## 用法

```go
e.Use(middleware.RequestID())
```

示例：

```go
func main() {
	e := echo.New()

	e.Use(middleware.RequestID())

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, c.Response().Header().Get(echo.HeaderXRequestID))
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## 自定义配置

```go
e.Use(middleware.RequestIDWithConfig(middleware.RequestIDConfig{
	Generator: func() string {
		return customGenerator()
	},
}))
```

## 配置

```go
type RequestIDConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Generator defines a function to generate an ID.
	// Optional. Default value random.String(32).
	Generator func() string

	// RequestIDHandler defines a function which is executed for a request id.
	RequestIDHandler func(c *echo.Context, requestID string)

	// TargetHeader defines what header to look for to populate the id.
	// Optional. Default value is `X-Request-Id`.
	TargetHeader string
}
```

### 默认配置

```go
// Effective defaults applied when fields are left unset.
RequestIDConfig{
	Skipper:      DefaultSkipper,
	Generator:    generator, // random 32-character string
	TargetHeader: echo.HeaderXRequestID,
}
```

## 设置 ID

可以由请求方通过 `X-Request-ID` header 设置 ID。

### 请求

```sh
curl -H "X-Request-ID: 3" --compressed -v "http://localhost:1323/?my=param"
```

### 日志

```js
{"time":"2017-11-13T20:26:28.6438003+01:00","id":"3","remote_ip":"::1","host":"localhost:1323","method":"GET","uri":"/?my=param","my":"param","status":200, "latency":0,"latency_human":"0s","bytes_in":0,"bytes_out":13}
```
