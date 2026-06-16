---
title: Static
description: Sirva arquivos estáticos a partir de um diretório raiz.
sidebar:
  order: 24
---

O middleware Static serve arquivos estáticos a partir do diretório raiz fornecido.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e := echo.New()
e.Use(middleware.Static("/static"))
```

Isso serve arquivos estáticos a partir do diretório `static`. Por exemplo, um request para `/js/main.js`
busca e serve o arquivo `static/js/main.js`.

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
	Root:   "static",
	Browse: true,
}))
```

Isso serve arquivos estáticos a partir do diretório `static` e habilita navegação de diretório.

O comportamento padrão quando usado com caminhos de URL não raiz é anexar o caminho da URL ao
caminho do filesystem.

#### Exemplo 1

```go
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath`, the actual filesystem request goes to
// `filesystempath/somepath` instead of only `filesystempath`.
group.GET("/*", func(c *echo.Context) error { return echo.ErrNotFound })
```

:::note
Middleware em nível de grupo é vinculado à rota e só funciona se o grupo tiver ao menos uma rota.
:::

:::tip
Para desligar esse comportamento, defina o parâmetro de configuração `IgnoreBase` como `true`.
:::

#### Exemplo 2

Sirva assets de SPA a partir de um filesystem incorporado:

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

## Configuração

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

### Configuração padrão

```go
DefaultStaticConfig = StaticConfig{
	Skipper: DefaultSkipper,
	Index:   "index.html",
}
```
