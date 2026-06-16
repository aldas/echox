---
title: Load Balancing
description: Usa Nginx como reverse proxy para balancear tráfico entre múltiples servidores Echo.
sidebar:
  order: 20
---

Esta receta demuestra cómo usar Nginx como servidor reverse proxy para balancear
tráfico entre múltiples servidores Echo.

## Echo

```go
package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var index = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Upstream Server</title>
		<style>
			h1, p {
				font-weight: 300;
			}
		</style>
	</head>
	<body>
		<p>
			Hello from upstream server %s
		</p>
	</body>
	</html>
`

func main() {
	name := os.Args[1]
	port := os.Args[2]

	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.RequestLogger())

	e.GET("/", func(c *echo.Context) error {
		return c.HTML(http.StatusOK, fmt.Sprintf(index, name))
	})

	sc := echo.StartConfig{Address: port}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### Iniciar servidores

```sh
cd upstream
go run server.go server1 :8081
go run server.go server2 :8082
```

## Nginx

### 1) Instalar Nginx

Consulta la [guía de instalación de Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install).

### 2) Configurar Nginx

Crea un archivo `/etc/nginx/sites-enabled/localhost` con el siguiente contenido:

```nginx
upstream localhost {
  server localhost:8081;
  server localhost:8082;
}

server {
  listen          8080;
  server_name     localhost;
  access_log      /var/log/nginx/localhost.access.log combined;

  location / {
    proxy_pass      http://localhost;
  }
}
```

:::note
Ajusta `listen`, `server_name` y `access_log` según tu entorno.
:::

### 3) Reiniciar Nginx

```sh
service nginx restart
```

Abre `https://localhost:8080`, y deberías ver una página web servida desde
"server 1" o "server 2".

```sh
Hello from upstream server server1
```
