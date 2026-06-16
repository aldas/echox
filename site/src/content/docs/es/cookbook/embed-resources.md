---
title: Recursos embebidos
description: Sirve assets estáticos empaquetados en el binario con el paquete embed de Go.
sidebar:
  order: 5
---

El paquete `embed` de Go (Go 1.16+) te permite compilar assets estáticos directamente en el
binario, por lo que un único ejecutable puede incluir su frontend. Esta receta sirve el
filesystem embebido mediante Echo, con un modo live opcional que lee desde disco durante
el desarrollo.

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
Ejecuta el binario con el argumento `live` (`go run server.go live`) para servir assets
desde el directorio `app` en disco en lugar de la copia embebida, lo que resulta útil
durante el desarrollo.
:::
