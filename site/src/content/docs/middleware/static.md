---
title: Static
description: Serve static files from a root directory.
sidebar:
  order: 24
---

Static middleware serves static files from the provided root directory.

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e := echo.New()
e.Use(middleware.Static("/static"))
```

This serves static files from the `static` directory. For example, a request to `/js/main.js`
fetches and serves the `static/js/main.js` file.

## Custom configuration

```go
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
	Root:   "static",
	Browse: true,
}))
```

This serves static files from the `static` directory and enables directory browsing.

The default behavior when used with non-root URL paths is to append the URL path to the
filesystem path.

#### Example 1

```go
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath`, the actual filesystem request goes to
// `filesystempath/somepath` instead of only `filesystempath`.
group.GET("/*", func(c *echo.Context) error { return echo.ErrNotFound })
```

:::note
Group-level middleware is tied to the route and works only if the group has at least one route.
:::

:::tip
To turn off this behavior, set the `IgnoreBase` config parameter to `true`.
:::

#### Example 2

Serve SPA assets from an embedded filesystem:

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

## Configuration

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

### Default configuration

```go
DefaultStaticConfig = StaticConfig{
	Skipper: DefaultSkipper,
	Index:   "index.html",
}
```
