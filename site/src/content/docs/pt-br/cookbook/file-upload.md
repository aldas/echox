---
title: Upload de arquivos
description: Trate uploads multipart de um ou vários arquivos junto de campos de formulário.
sidebar:
  order: 7
---

Echo lê dados de formulário multipart por meio do contexto do request. Use `c.FormValue` para
campos de texto, `c.FormFile` para um único arquivo e `c.MultipartForm` para acessar
vários arquivos sob o mesmo nome de campo.

## Fazer upload de um único arquivo com campos

### Servidor

```go
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func upload(c *echo.Context) error {
	// Read form fields
	name := c.FormValue("name")
	email := c.FormValue("email")

	//-----------
	// Read file
	//-----------

	// Source
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully with fields name=%s and email=%s.</p>", file.Filename, name, email))
}

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.Static("/", "public")
	e.POST("/upload", upload)

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
    <title>Single file upload</title>
</head>
<body>
<h1>Upload single file with fields</h1>

<form action="/upload" method="post" enctype="multipart/form-data">
    Name: <input type="text" name="name"><br>
    Email: <input type="email" name="email"><br>
    Files: <input type="file" name="file"><br><br>
    <input type="submit" value="Submit">
</form>
</body>
</html>
```

## Fazer upload de vários arquivos com campos

### Servidor

```go
package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func upload(c *echo.Context) error {
	// Read form fields
	name := c.FormValue("name")
	email := c.FormValue("email")

	//------------
	// Read files
	//------------

	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["files"]

	for _, file := range files {
		// Source
		src, err := file.Open()
		if err != nil {
			return err
		}
		defer src.Close()

		// Destination
		dst, err := os.Create(file.Filename)
		if err != nil {
			return err
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			return err
		}

	}

	return c.HTML(http.StatusOK, fmt.Sprintf("<p>Uploaded successfully %d files with fields name=%s and email=%s.</p>", len(files), name, email))
}

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.Static("/", "public")
	e.POST("/upload", upload)

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
    <title>Multiple file upload</title>
</head>
<body>
<h1>Upload multiple files with fields</h1>

<form action="/upload" method="post" enctype="multipart/form-data">
    Name: <input type="text" name="name"><br>
    Email: <input type="email" name="email"><br>
    Files: <input type="file" name="files" multiple><br><br>
    <input type="submit" value="Submit">
</form>
</body>
</html>
```
