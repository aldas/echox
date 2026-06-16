---
title: コンテキスト
description: リクエスト、レスポンス、パラメーター、ヘルパーを保持するリクエストごとのオブジェクトです。
sidebar:
  order: 4
---

`echo.Context` は現在の HTTP リクエストのコンテキストを表します。そのポインター
（`*echo.Context`）はすべてのハンドラとミドルウェアに渡され、リクエストとレスポンス、
パスパラメーター、バインド済みデータ、レスポンス作成用のヘルパーを保持します。

```go
func handler(c *echo.Context) error {
	// ...
	return nil
}
```

## 入力を読む

```go
id := c.Param("id")            // path parameter
q := c.QueryParam("q")         // query string value
all := c.QueryParams()         // url.Values of all query params
name := c.FormValue("name")    // form field (URL + body)
ua := c.Request().Header.Get(echo.HeaderUserAgent)
```

値が存在しない場合にデフォルト値を返す、対応する `*Or` ヘルパーもあります。
`c.ParamOr("id", "0")`、`c.QueryParamOr("page", "1")`、`c.FormValueOr(...)`
などです。

## レスポンスを書く

```go
c.String(http.StatusOK, "plain text")
c.JSON(http.StatusOK, payload)
c.JSONPretty(http.StatusOK, payload, "  ")
c.HTML(http.StatusOK, "<b>hi</b>")
c.XML(http.StatusOK, payload)
c.Blob(http.StatusOK, "application/pdf", bytes)
c.Stream(http.StatusOK, "application/octet-stream", reader)
c.NoContent(http.StatusNoContent)
c.Redirect(http.StatusFound, "/elsewhere")
```

## ファイル

```go
c.File("public/report.pdf")             // serve a file
c.Attachment("invoice.pdf", "inv.pdf")  // prompt download
c.Inline("photo.png", "photo.png")      // render inline
```

## リクエストごとのストレージ

`Get`/`Set` を使ってミドルウェアとハンドラの間でデータを共有します。

```go
c.Set("user", u)
u, _ := c.Get("user").(*User)
```

ジェネリクスヘルパーで型付きアクセスもできます。

```go
u, err := echo.ContextGet[*User](c, "user")
```

## バインディングと検証

`c.Bind()` はリクエストデータを struct に解析します。詳しくは
[バインディング](/ja/guide/binding/)を参照してください。

```go
var dto CreateUser
if err := c.Bind(&dto); err != nil {
	return echo.ErrBadRequest
}
```
