---
title: 静的ファイル
description: ルートディレクトリから静的ファイルを配信します。
sidebar:
  order: 24
---

Static ミドルウェアは、指定されたルートディレクトリから静的ファイルを配信します。

## 使い方

```go
e := echo.New()
e.Use(middleware.Static("/static"))
```

これは `static` ディレクトリから静的ファイルを配信します。たとえば `/js/main.js` へのリクエストは
`static/js/main.js` ファイルを取得して配信します。

## カスタム設定

```go
e := echo.New()
e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
	Root:   "static",
	Browse: true,
}))
```

これは `static` ディレクトリから静的ファイルを配信し、ディレクトリ閲覧を有効にします。

非ルート URL パスで使った場合のデフォルト挙動は、URL パスをファイルシステムパスに追加することです。

#### 例 1

```go
group := root.Group("somepath")
group.Use(middleware.Static(filepath.Join("filesystempath")))
// When an incoming request comes for `/somepath`, the actual filesystem request goes to
// `filesystempath/somepath` instead of only `filesystempath`.
group.GET("/*", func(c *echo.Context) error { return echo.ErrNotFound })
```

:::note
グループレベルのミドルウェアはルートに紐づいており、そのグループに少なくとも 1 つのルートがある場合のみ機能します。
:::

:::tip
この挙動を無効にするには、`IgnoreBase` 設定パラメーターを `true` にします。
:::

#### 例 2

埋め込みファイルシステムから SPA アセットを配信します。

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

## 設定

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

### デフォルト設定

```go
DefaultStaticConfig = StaticConfig{
	Skipper: DefaultSkipper,
	Index:   "index.html",
}
```
