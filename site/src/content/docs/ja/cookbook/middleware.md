---
title: カスタムミドルウェア
description: リクエスト統計を収集し、レスポンス header を設定するカスタム Echo ミドルウェアを書きます。
sidebar:
  order: 12
---

このレシピでは、カスタムミドルウェアの書き方を示します。

- リクエスト数、レスポンスステータス、稼働時間を収集するミドルウェア。
- すべてのレスポンスにカスタム `Server` header を書き込むミドルウェア。

Echo のミドルウェアは `func(next echo.HandlerFunc) echo.HandlerFunc` というシグネチャの関数です。
下の `Stats.Process` メソッドはそのシグネチャを直接満たし、`ServerHeader` は通常の関数です。

## サーバー

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

## レスポンス

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
