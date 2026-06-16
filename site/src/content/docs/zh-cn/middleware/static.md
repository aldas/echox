---
title: 静态文件
description: 从根目录提供静态文件。
sidebar:
  order: 24
---

Static 中间件会从提供的根目录提供静态文件。

所有核心中间件都位于 `middleware` 包中：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 用法

```go
e := echo.New()
e.Use(middleware.Static("/static"))
```

这会从 `static` 目录提供静态文件。例如，对 `/js/main.js` 的请求会获取并提供
`static/js/main.js` 文件。

## 自定义配置

```go
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
	Root:   "static",
	Browse: true,
}))
```

这会从 `static` 目录提供静态文件，并启用目录浏览。

与非根 URL 路径一起使用时，默认行为是把 URL 路径追加到文件系统路径。

#### 示例 1

```go
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath`, the actual filesystem request goes to
// `filesystempath/somepath` instead of only `filesystempath`.
group.GET("/*", func(c *echo.Context) error { return echo.ErrNotFound })
```

:::note
路由组级中间件与路由绑定，只有当路由组至少有一条路由时才会工作。
:::

:::tip
要关闭此行为，请把 `IgnoreBase` 配置参数设为 `true`。
:::

#### 示例 2

从嵌入式文件系统提供 SPA 资源：

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

## 配置

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

### 默认配置

```go
DefaultStaticConfig = StaticConfig{
	Skipper: DefaultSkipper,
	Index:   "index.html",
}
```
