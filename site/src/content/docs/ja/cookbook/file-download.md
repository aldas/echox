---
title: ファイルダウンロード
description: ダウンロード、インライン表示、名前付き添付ファイルとしてファイルを配信します。
sidebar:
  order: 6
---

Echo はファイルを返すための 3 つのコンテキストヘルパーを提供します。`c.File` はブラウザーの
デフォルト content disposition でファイルを配信し、`c.Inline` はブラウザーにその場で表示するよう促し、
`c.Attachment` は指定したファイル名でダウンロードを促します。

## ファイルをダウンロードする

### サーバー

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

### クライアント

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

## ファイルをインラインでダウンロードする

`c.Inline` を使って `Content-Disposition: inline` header を送信し、ブラウザーがファイルを
ダウンロードするのではなくその場でレンダリングするようにします。

### サーバー

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

### クライアント

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

## ファイルを添付ファイルとしてダウンロードする

`c.Attachment` を使って `Content-Disposition: attachment` header を送信し、
指定した名前でファイルをダウンロードするようブラウザーに促します。

### サーバー

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

### クライアント

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
