---
title: 自定义中间件
description: 编写自定义 Echo 中间件以收集请求统计并设置响应 header。
sidebar:
  order: 12
---

此示例展示如何编写自定义中间件：

- 一个收集请求数量、响应状态和运行时间的中间件。
- 一个为每个响应写入自定义 `Server` header 的中间件。

Echo 中的中间件是签名为 `func(next echo.HandlerFunc) echo.HandlerFunc` 的函数。下面的
`Stats.Process` 方法直接满足该签名，而 `ServerHeader` 是一个普通函数。

## 服务器

```go
package main

import (
	"context"
	"errors"
	"net/http"
	"sync"
	"time"

	"github.com/labstack/echo/v5"
)

type (
	Stats struct {
		Uptime       time.Time      `json:"uptime"`
		RequestCount uint64         `json:"requestCount"`
		Statuses     map[int]uint64 `json:"statuses"`
		mutex        sync.RWMutex
	}
)

func NewStats() *Stats {
	return &Stats{
		Uptime:   time.Now(),
		Statuses: map[int]uint64{},
	}
}

// Process is the middleware function.
func (s *Stats) Process(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		err := next(c)

		status := http.StatusInternalServerError
		if err != nil {
			var sc echo.HTTPStatusCoder
			if ok := errors.As(err, &sc); ok {
				status = sc.StatusCode()
			}
		} else {
			rw, uErr := echo.UnwrapResponse(c.Response())
			if uErr == nil {
				status = rw.Status
			}
			err = uErr
		}

		s.mutex.Lock()
		defer s.mutex.Unlock()
		s.RequestCount++
		s.Statuses[status]++

		return err
	}
}

// Handle is the endpoint to get stats.
func (s *Stats) Handle(c *echo.Context) error {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return c.JSON(http.StatusOK, s)
}

// ServerHeader middleware adds a `Server` header to the response.
func ServerHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		c.Response().Header().Set(echo.HeaderServer, "Echo/5.0")
		return next(c)
	}
}

func main() {
	e := echo.New()

	//-------------------
	// Custom middleware
	//-------------------
	// Stats
	s := NewStats()
	e.Use(s.Process)
	e.GET("/stats", s.Handle) // Endpoint to get stats

	// Server header
	e.Use(ServerHeader)

	// Handler
	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	// Start server
	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## 响应

### Header

```sh
Content-Length:122
Content-Type:application/json; charset=utf-8
Date:Thu, 14 Apr 2016 20:31:46 GMT
Server:Echo/5.0
```

### Body

```js
{
  "uptime": "2016-04-14T13:28:48.486548936-07:00",
  "requestCount": 5,
  "statuses": {
    "200": 4,
    "404": 1
  }
}
```
