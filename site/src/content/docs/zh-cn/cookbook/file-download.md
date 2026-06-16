---
title: 文件下载
description: 提供文件下载、内联显示，或作为命名附件提供。
sidebar:
  order: 6
---

Echo 提供三个返回文件的上下文辅助方法：`c.File` 使用浏览器默认的 content disposition 提供文件，
`c.Inline` 提示浏览器就地显示文件，`c.Attachment` 则使用给定文件名提示下载。

## 下载文件

### 服务器

```go
package main

import (
	"context"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.GET("/", func(c *echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/file", func(c *echo.Context) error {
		return c.File("echo.svg")
	})

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### 客户端

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/file">File download</a>
    </p>

</body>
</html>
```

## 以内联方式下载文件

使用 `c.Inline` 发送 `Content-Disposition: inline` header，使浏览器就地渲染文件，
而不是下载它。

### 服务器

```go
package main

import (
	"context"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.GET("/", func(c *echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/inline", func(c *echo.Context) error {
		return c.Inline("inline.txt", "inline.txt")
	})

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### 客户端

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/inline">Inline file download</a>
    </p>

</body>
</html>
```

## 以附件方式下载文件

使用 `c.Attachment` 发送 `Content-Disposition: attachment` header，提示浏览器使用提供的名称下载文件。

### 服务器

```go
package main

import (
	"context"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.GET("/", func(c *echo.Context) error {
		return c.File("index.html")
	})
	e.GET("/attachment", func(c *echo.Context) error {
		return c.Attachment("attachment.txt", "attachment.txt")
	})

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### 客户端

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>File download</title>
</head>
<body>

    <p>
        <a href="/attachment">Attachment file download</a>
    </p>

</body>
</html>
```
