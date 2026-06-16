---
title: Response en streaming
description: Transmite datos al cliente a medida que se producen usando chunked transfer encoding.
sidebar:
  order: 15
---

Esta receta transmite una response JSON al cliente a medida que se produce cada registro,
usando chunked transfer encoding:

- Enviar datos a medida que se producen.
- Transmitir una response JSON con chunked transfer encoding.

El handler codifica un registro a la vez y llama a `http.NewResponseController(...).Flush()`
después de cada uno para empujarlo al cliente de inmediato, con una pausa de un segundo
entre registros.

## Servidor

```go
package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
)

type (
	Geolocation struct {
		Altitude  float64
		Latitude  float64
		Longitude float64
	}
)

var (
	locations = []Geolocation{
		{-97, 37.819929, -122.478255},
		{1899, 39.096849, -120.032351},
		{2619, 37.865101, -119.538329},
		{42, 33.812092, -117.918974},
		{15, 37.77493, -122.419416},
	}
)

func main() {
	e := echo.New()
	e.GET("/", func(c *echo.Context) error {
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		c.Response().WriteHeader(http.StatusOK)

		enc := json.NewEncoder(c.Response())
		for _, l := range locations {
			if err := enc.Encode(l); err != nil {
				return err
			}
			if err := http.NewResponseController(c.Response()).Flush(); err != nil {
				return err
			}
			select {
			case <-c.Request().Context().Done():
				return nil
			case <-time.After(1 * time.Second):
				continue
			}
		}
		return nil
	})

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Cliente

```sh
curl localhost:1323
```

### Salida

```js
{"Altitude":-97,"Latitude":37.819929,"Longitude":-122.478255}
{"Altitude":1899,"Latitude":39.096849,"Longitude":-120.032351}
{"Altitude":2619,"Latitude":37.865101,"Longitude":-119.538329}
{"Altitude":42,"Latitude":33.812092,"Longitude":-117.918974}
{"Altitude":15,"Latitude":37.77493,"Longitude":-122.419416}
```
