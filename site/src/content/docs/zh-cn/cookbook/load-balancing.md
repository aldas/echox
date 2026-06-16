---
title: 负载均衡
description: 使用 Nginx 作为反向代理，在多个 Echo 服务器之间均衡流量。
sidebar:
  order: 20
---

此示例演示如何使用 Nginx 作为反向代理服务器，在多个 Echo 服务器之间进行流量负载均衡。

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

### 启动服务器

```sh
cd upstream
go run server.go server1 :8081
go run server.go server2 :8082
```

## Nginx

### 1) 安装 Nginx

参见 [Nginx installation guide](https://www.nginx.com/resources/wiki/start/topics/tutorials/install)。

### 2) 配置 Nginx

创建文件 `/etc/nginx/sites-enabled/localhost`，内容如下：

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
请根据你的环境调整 `listen`、`server_name` 和 `access_log`。
:::

### 3) 重启 Nginx

```sh
service nginx restart
```

访问 `https://localhost:8080`，你应该会看到从 "server 1" 或 "server 2" 提供的网页。

```sh
Hello from upstream server server1
```
