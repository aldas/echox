---
title: File Download
description: Serve files for download, inline display, or as named attachments.
sidebar:
  order: 6
---

Echo provides three context helpers for returning files: `c.File` serves a file
using the browser's default content disposition, `c.Inline` hints the browser to
display the file in place, and `c.Attachment` prompts a download with a given
filename.

## Download file

### Server

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

### Client

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

## Download file as inline

Use `c.Inline` to send a `Content-Disposition: inline` header so the browser
renders the file in place rather than downloading it.

### Server

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

### Client

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

## Download file as attachment

Use `c.Attachment` to send a `Content-Disposition: attachment` header, prompting
the browser to download the file under the supplied name.

### Server

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

### Client

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
