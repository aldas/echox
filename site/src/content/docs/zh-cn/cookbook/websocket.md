---
title: WebSocket
description: 在 Echo 中使用 golang.org/x/net/websocket 或 gorilla/websocket 处理 WebSocket 连接。
sidebar:
  order: 16
---

Echo 处理函数可以通过升级底层 HTTP 连接来提供 WebSocket 连接。此示例展示两种方式：
标准的 `golang.org/x/net/websocket` 包，以及流行的
[`gorilla/websocket`](https://github.com/gorilla/websocket) 库。

## 使用 net WebSocket

### 服务器

```go
package main

import (
	"context"
	"fmt"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"golang.org/x/net/websocket"
)

func hello(c *echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Write
			if err := websocket.Message.Send(ws, "Hello, Client!"); err != nil {
				c.Logger().Error("failed to write WS message", "error", err)
			}

			// Read
			msg := ""
			if err := websocket.Message.Receive(ws, &msg); err != nil {
				c.Logger().Error("failed to write WS message", "error", err)
			}
			fmt.Printf("%s\n", msg)
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.Static("/", "../public")
	e.GET("/ws", hello)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## 使用 gorilla WebSocket

### 服务器

```go
package main

import (
	"context"
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

var (
	upgrader = websocket.Upgrader{}
)

func hello(c *echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()

	for {
		// Write
		err := ws.WriteMessage(websocket.TextMessage, []byte("Hello, Client!"))
		if err != nil {
			c.Logger().Error("failed to write WS message", "error", err)
		}

		// Read
		_, msg, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error("failed to read WS message", "error", err)
		}
		fmt.Printf("%s\n", msg)
	}
}

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	e.Static("/", "../public")

	e.GET("/ws", hello)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## 客户端

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>WebSocket</title>
</head>

<body>
  <p id="output"></p>

  <script>
    var loc = window.location;
    var uri = 'ws:';

    if (loc.protocol === 'https:') {
      uri = 'wss:';
    }
    uri += '//' + loc.host;
    uri += loc.pathname + 'ws';

    ws = new WebSocket(uri)

    ws.onopen = function() {
      console.log('Connected')
    }

    ws.onmessage = function(evt) {
      var out = document.getElementById('output');
      out.innerHTML += evt.data + '<br>';
    }

    setInterval(function() {
      ws.send('Hello, Server!');
    }, 1000);
  </script>
</body>

</html>
```

## 输出

**服务器**

```sh
Hello, Server!
Hello, Server!
Hello, Server!
Hello, Server!
Hello, Server!
```

**客户端**

```sh
Hello, Client!
Hello, Client!
Hello, Client!
Hello, Client!
Hello, Client!
```
