---
title: Static
description: Sirve archivos estáticos desde un directorio raíz.
sidebar:
  order: 24
---

El middleware Static sirve archivos estáticos desde el directorio raíz proporcionado.

Todo el middleware principal reside en el paquete `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e := echo.New()
e.Use(middleware.Static("/static"))
```

Esto sirve archivos estáticos desde el directorio `static`. Por ejemplo, un request a
`/js/main.js` obtiene y sirve el archivo `static/js/main.js`.

## Configuración personalizada

```go
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
	Root:   "static",
	Browse: true,
}))
```

Esto sirve archivos estáticos desde el directorio `static` y habilita la exploración de directorios.

El comportamiento por defecto al usarse con paths de URL no raíz es anexar el path de la URL al
path del filesystem.

#### Ejemplo 1

```go
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath`, the actual filesystem request goes to
// `filesystempath/somepath` instead of only `filesystempath`.
group.GET("/*", func(c *echo.Context) error { return echo.ErrNotFound })
```

:::note
El middleware a nivel de group está ligado a la ruta y solo funciona si el group tiene al menos una ruta.
:::

:::tip
Para desactivar este comportamiento, establece el parámetro de configuración `IgnoreBase` en `true`.
:::

#### Ejemplo 2

Servir assets de SPA desde un filesystem embebido:

```go
package main

import (
	"embed"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

//go:embed assets
var webAssets embed.FS

func main() {
	e := echo.New()

	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		HTML5:      true,
		Root:       "assets", // files are located in the `assets` directory of the webAssets fs
		Filesystem: webAssets,
	}))
	api := e.Group("/api")
	api.GET("/users", func(c *echo.Context) error {
		return c.String(http.StatusOK, "users")
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Configuración

```go
type StaticConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Root directory from where the static content is served (relative to given Filesystem).
	// `Root: "."` means root folder from Filesystem.
	// Required.
	Root string

	// Filesystem provides access to the static content.
	// Optional. Defaults to echo.Filesystem (serves files from `.` folder where executable is started).
	Filesystem fs.FS

	// Index file for serving a directory.
	// Optional. Default value "index.html".
	Index string

	// Enable HTML5 mode by forwarding all not-found requests to root so that
	// a SPA (single-page application) can handle the routing.
	// Optional. Default value false.
	HTML5 bool

	// Enable directory browsing.
	// Optional. Default value false.
	Browse bool

	// Enable ignoring of the base of the URL path.
	// Example: when assigning a static middleware to a non-root path group,
	// the filesystem path is not doubled.
	// Optional. Default value false.
	IgnoreBase bool

	// DisablePathUnescaping disables path parameter (param: *) unescaping. This is useful when the router is set to
	// unescape all parameters and doing it again in this middleware would corrupt the filename that is requested.
	DisablePathUnescaping bool

	// DirectoryListTemplate is the template used to list directory contents.
	// Optional. Defaults to the `directoryListHTMLTemplate` constant.
	DirectoryListTemplate string
}
```

### Configuración por defecto

```go
DefaultStaticConfig = StaticConfig{
	Skipper: DefaultSkipper,
	Index:   "index.html",
}
```
