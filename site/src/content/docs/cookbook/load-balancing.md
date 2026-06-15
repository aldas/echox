---
title: Load Balancing
description: Use Nginx as a reverse proxy to load balance traffic across multiple Echo servers.
sidebar:
  order: 20
---

This recipe demonstrates how to use Nginx as a reverse proxy server to load
balance traffic across multiple Echo servers.

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

### Start servers

```sh
cd upstream
go run server.go server1 :8081
go run server.go server2 :8082
```

## Nginx

### 1) Install Nginx

See the [Nginx installation guide](https://www.nginx.com/resources/wiki/start/topics/tutorials/install).

### 2) Configure Nginx

Create a file `/etc/nginx/sites-enabled/localhost` with the following content:

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
Adjust `listen`, `server_name`, and `access_log` to suit your environment.
:::

### 3) Restart Nginx

```sh
service nginx restart
```

Browse to `https://localhost:8080`, and you should see a webpage served from
either "server 1" or "server 2".

```sh
Hello from upstream server server1
```
