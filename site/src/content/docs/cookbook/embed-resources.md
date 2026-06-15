---
title: Embed Resources
description: Serve static assets bundled into the binary with Go's embed package.
sidebar:
  order: 5
---

Go's `embed` package (Go 1.16+) lets you compile static assets directly into the
binary, so a single executable can ship with its frontend. This recipe serves the
embedded filesystem through Echo, with an optional live mode that reads from disk
during development.

## Server

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
Run the binary with the `live` argument (`go run server.go live`) to serve assets
from the `app` directory on disk instead of the embedded copy, which is handy
during development.
:::
