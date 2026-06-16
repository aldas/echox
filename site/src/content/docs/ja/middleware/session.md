---
title: セッション
description: gorilla/sessions をバックエンドにした HTTP セッション管理です。
sidebar:
  order: 23
---

Session ミドルウェアは [gorilla/sessions](https://github.com/gorilla/sessions) を基盤にした
HTTP セッション管理を容易にします。デフォルト実装は Cookie ベースとファイルシステムベースの
セッション store を提供します。さまざまなバックエンド向けに
[community-maintained store](https://github.com/gorilla/sessions#store-implementations) も使えます。

## 依存関係

```bash
go get github.com/gorilla/sessions
```

```go
import (
	"github.com/gorilla/sessions"
)
```

## 実装

セッションミドルウェアを作成する関数と、コンテキストからセッションを取得するユーティリティ関数です。

```go
func NewSessionMiddleware(store sessions.Store) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			c.Set("_session_store", store)
			return next(c)
		}
	}
}

func GetSession(c *echo.Context, name string) (*sessions.Session, error) {
	store, err := echo.ContextGet[sessions.Store](c, "_session_store")
	if err != nil {
		return nil, err
	}
	return store.Get(c.Request(), name)
}
```

ミドルウェアは次のように初期化できます。

```go
sessionStore := sessions.NewCookieStore([]byte("secret"))
e.Use(NewSessionMiddleware(sessionStore))
```

## 使用例

この例は 2 つのエンドポイントを公開します。`/create-session` は新しいセッションを作成し、
`/read-session` はリクエストにセッション ID が含まれている場合にセッションから値を読み取ります。

```go
package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v5"
)

func NewSessionMiddleware(store sessions.Store) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			c.Set("_session_store", store)
			return next(c)
		}
	}
}

func GetSession(c *echo.Context, name string) (*sessions.Session, error) {
	store, err := echo.ContextGet[sessions.Store](c, "_session_store")
	if err != nil {
		return nil, fmt.Errorf("failed to get session store: %w", err)
	}
	return store.Get(c.Request(), name)
}

func main() {
	e := echo.New()

	sessionStore := sessions.NewCookieStore([]byte("secret"))
	e.Use(NewSessionMiddleware(sessionStore))

	e.GET("/create-session", func(c *echo.Context) error {
		sess, err := GetSession(c, "session")
		if err != nil {
			return err
		}
		sess.Options = &sessions.Options{
			Path:     "/",
			MaxAge:   86400 * 7,
			HttpOnly: true,
		}
		sess.Values["foo"] = "bar"
		if err := sess.Save(c.Request(), c.Response()); err != nil {
			return err
		}
		return c.NoContent(http.StatusOK)
	})

	e.GET("/read-session", func(c *echo.Context) error {
		sess, err := GetSession(c, "session")
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, fmt.Sprintf("foo=%v\n", sess.Values["foo"]))
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

セッションを指定せずに `/read-session` をリクエストすると、`foo` の値は nil として出力されます。

```bash
$ curl -v http://localhost:8080/read-session
* processing: http://localhost:8080/read-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /read-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
< Date: Thu, 25 Apr 2024 09:15:14 GMT
< Content-Length: 10
<
foo=<nil>
```

`/create-session` をリクエストすると新しいセッションが作成されます。

```bash
$ curl -v -c cookies.txt http://localhost:8080/create-session
* processing: http://localhost:8080/create-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /create-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
>
< HTTP/1.1 200 OK
* Added cookie session="..." for domain localhost, path /, expire 1714641420
< Set-Cookie: session=...; Path=/; Expires=Thu, 02 May 2024 09:17:00 GMT; Max-Age=604800; HttpOnly
< Date: Thu, 25 Apr 2024 09:17:00 GMT
< Content-Length: 0
<
* Connection #0 to host localhost left intact
```

前のレスポンスのセッション Cookie を使って `/read-session` をリクエストすると、
セッション内の `foo` 値が出力されます。

```bash
$ curl -v -b cookies.txt http://localhost:8080/read-session
* processing: http://localhost:8080/read-session
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
> GET /read-session HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.2.1
> Accept: */*
> Cookie: session=...
>
< HTTP/1.1 200 OK
< Content-Type: text/plain; charset=UTF-8
< Date: Thu, 25 Apr 2024 09:18:56 GMT
< Content-Length: 8
<
foo=bar
* Connection #0 to host localhost left intact
```
