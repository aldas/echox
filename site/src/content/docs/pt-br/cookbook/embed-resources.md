---
title: Recursos incorporados
description: Sirva assets estáticos empacotados no binário com o pacote embed do Go.
sidebar:
  order: 5
---

O pacote `embed` do Go (Go 1.16+) permite compilar assets estáticos diretamente no
binário, para que um único executável possa incluir seu frontend. Esta receita serve o
filesystem incorporado por meio do Echo, com um modo live opcional que lê do disco
durante o desenvolvimento.

## Servidor

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
Execute o binário com o argumento `live` (`go run server.go live`) para servir assets
a partir do diretório `app` no disco em vez da cópia incorporada, o que é útil
durante o desenvolvimento.
:::
