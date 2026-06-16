---
title: リソースの埋め込み
description: Go の embed パッケージでバイナリに同梱した静的アセットを配信します。
sidebar:
  order: 5
---

Go の `embed` パッケージ（Go 1.16+）を使うと、静的アセットを直接バイナリにコンパイルできます。
そのため、単一の実行ファイルにフロントエンドを同梱できます。このレシピは Echo 経由で埋め込み
ファイルシステムを配信し、開発中にディスクから読み込む任意の live モードも備えています。

## サーバー

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
`live` 引数（`go run server.go live`）付きでバイナリを実行すると、埋め込みコピーではなく
ディスク上の `app` ディレクトリからアセットを配信できます。開発中に便利です。
:::
