---
title: Descarga de archivos
description: Sirve archivos para descarga, visualización inline o como attachments con nombre.
sidebar:
  order: 6
---

Echo proporciona tres helpers de contexto para devolver archivos: `c.File` sirve un archivo
usando la content disposition por defecto del navegador, `c.Inline` sugiere al navegador
mostrar el archivo en su lugar, y `c.Attachment` solicita una descarga con un filename dado.

## Descargar archivo

### Servidor

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

### Cliente

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

## Descargar archivo como inline

Usa `c.Inline` para enviar un header `Content-Disposition: inline`, de modo que el navegador
renderice el archivo en su lugar en vez de descargarlo.

### Servidor

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

### Cliente

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

## Descargar archivo como attachment

Usa `c.Attachment` para enviar un header `Content-Disposition: attachment`, solicitando
al navegador descargar el archivo con el nombre proporcionado.

### Servidor

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

### Cliente

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
