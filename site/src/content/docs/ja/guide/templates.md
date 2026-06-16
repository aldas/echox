---
title: テンプレート
description: renderer を登録し、任意のエンジンで HTML テンプレートをレンダリングします。
sidebar:
  order: 10
---

`Context#Render(code int, name string, data any) error` はデータでテンプレートをレンダリングし、
ステータスコード付きの `text/html` レスポンスを送信します。`Echo#Renderer` を設定して
renderer を登録すると、任意のテンプレートエンジンを使えます。

## レンダリング

次の例では Go の `html/template` を使います。

デフォルトのテンプレート renderer を使います。

```go
e.Renderer = &echo.TemplateRenderer{
	Template: template.Must(template.New("hello").Parse("Hello, {{.}}!")),
}
```

または `echo.Renderer` インターフェイスを自分で実装します。

```go
type Template struct {
	templates *template.Template
}

func (t *Template) Render(c *echo.Context, w io.Writer, name string, data any) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
```

1. テンプレートを事前コンパイルします。

   `public/views/hello.html`：

   ```html
   {{define "hello"}}Hello, {{.}}!{{end}}
   ```

   ```go
   t := &Template{
       templates: template.Must(template.ParseGlob("public/views/*.html")),
   }
   ```

2. renderer を登録します。

   ```go
   e := echo.New()
   e.Renderer = t
   e.GET("/hello", Hello)
   ```

3. ハンドラ内でテンプレートをレンダリングします。

   ```go
   func Hello(c *echo.Context) error {
       return c.Render(http.StatusOK, "hello", "World")
   }
   ```

## 応用：テンプレートから Echo を呼び出す

テンプレート内から `Echo#Reverse` を呼び出して URI を生成したい場合があります。
Go の `html/template` はこれに最適というわけではありませんが、2 つの方法で実現できます。
テンプレートに渡すすべてのオブジェクトに共通メソッドを用意するか、`map[string]any` を渡して
カスタム renderer 内で拡張する方法です。後者の方が柔軟です。完全な例を示します。

`template.html`：

```html
<html>
<body>
<h1>Hello {{index . "name"}}</h1>

<p>{{ with $x := index . "reverse" }}
   {{ call $x "foobar" }} <!--- this calls $x with the parameter "foobar" -->
   {{ end }}
</p>
</body>
</html>
```

`server.go`：

```go
package main

import (
	"html/template"
	"io"
	"net/http"

	"github.com/labstack/echo/v5"
)

// TemplateRenderer is a custom html/template renderer for Echo.
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document.
func (t *TemplateRenderer) Render(c *echo.Context, w io.Writer, name string, data any) error {
	// Add global methods if the data is a map.
	if viewContext, isMap := data.(map[string]any); isMap {
		viewContext["reverse"] = c.RouteInfo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}

func main() {
	e := echo.New()
	e.Renderer = &TemplateRenderer{
		templates: template.Must(template.ParseGlob("main/*.html")),
	}

	e.GET("/something/:name", func(c *echo.Context) error {
		return c.Render(http.StatusOK, "template.html", map[string]any{
			"name": "Dolly!",
		})
	})

	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("shutting down the server", "error", err)
	}
}
```
