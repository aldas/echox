---
title: 嵌入资源
description: 使用 Go 的 embed 包提供打包进二进制文件的静态资源。
sidebar:
  order: 5
---

Go 的 `embed` 包（Go 1.16+）允许你把静态资源直接编译进二进制文件，因此单个可执行文件即可携带前端。
此示例通过 Echo 提供嵌入式文件系统，并支持一个可选的 live 模式，在开发期间从磁盘读取。

## 服务器

```go
package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
)

//go:embed app
var embededFiles embed.FS

func getFileSystem(useOS bool) http.FileSystem {
	if useOS {
		log.Print("using live mode")
		return http.FS(os.DirFS("app"))
	}

	log.Print("using embed mode")
	fsys, err := fs.Sub(embededFiles, "app")
	if err != nil {
		panic(err)
	}

	return http.FS(fsys)
}

func main() {
	e := echo.New()
	useOS := len(os.Args) > 1 && os.Args[1] == "live"
	assetHandler := http.FileServer(getFileSystem(useOS))
	e.GET("/", echo.WrapHandler(assetHandler))
	e.GET("/static/*", echo.WrapHandler(http.StripPrefix("/static/", assetHandler)))

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

:::tip
使用 `live` 参数运行二进制文件（`go run server.go live`），可以从磁盘上的 `app` 目录提供资源，
而不是使用嵌入副本，这在开发期间很方便。
:::
