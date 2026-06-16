---
title: ロードバランシング
description: Nginx をリバースプロキシとして使い、複数の Echo サーバー間でトラフィックを分散します。
sidebar:
  order: 20
---

このレシピでは、Nginx をリバースプロキシサーバーとして使い、複数の Echo サーバー間で
トラフィックをロードバランスする方法を示します。

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

### サーバーを起動する

```sh
cd upstream
go run server.go server1 :8081
go run server.go server2 :8082
```

## Nginx

### 1) Nginx をインストールする

[Nginx installation guide](https://www.nginx.com/resources/wiki/start/topics/tutorials/install) を参照してください。

### 2) Nginx を設定する

次の内容で `/etc/nginx/sites-enabled/localhost` ファイルを作成します。

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
`listen`、`server_name`、`access_log` は環境に合わせて調整してください。
:::

### 3) Nginx を再起動する

```sh
service nginx restart
```

`https://localhost:8080` にアクセスすると、"server 1" または "server 2" から配信された Web ページが表示されます。

```sh
Hello from upstream server server1
```
