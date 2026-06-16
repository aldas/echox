---
title: 模板
description: 通过注册 renderer 使用任意引擎渲染 HTML 模板。
sidebar:
  order: 10
---

`Context#Render(code int, name string, data any) error` 会用数据渲染模板，并发送带状态码的
`text/html` 响应。通过设置 `Echo#Renderer` 注册 renderer，这让你可以使用任何模板引擎。

## 渲染

下面的示例使用 Go 的 `html/template`。

使用默认模板 renderer：

```go
e.Renderer = &echo.TemplateRenderer{
	Template: template.Must(template.New("hello").Parse("Hello, {{.}}!")),
}
```

或者自己实现 `echo.Renderer` 接口：

```go
type Template struct {
	templates *template.Template
}

func (t *Template) Render(c *echo.Context, w io.Writer, name string, data any) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
```

1. 预编译模板。

   `public/views/hello.html`：

   ```html
   {{define "hello"}}Hello, {{.}}!{{end}}
   ```

   ```go
   t := &Template{
       templates: template.Must(template.ParseGlob("public/views/*.html")),
   }
   ```

2. 注册 renderer。

   ```go
   e := echo.New()
   e.Renderer = t
   e.GET("/hello", Hello)
   ```

3. 在处理函数中渲染模板。

   ```go
   func Hello(c *echo.Context) error {
       return c.Render(http.StatusOK, "hello", "World")
   }
   ```

## 高级：从模板调用 Echo

有时从模板内部调用 `Echo#Reverse` 来生成 URI 很有用。Go 的 `html/template`
并不特别适合这样做，但可以通过两种方式实现：为传给模板的每个对象提供一个公共方法，
或者传入 `map[string]any` 并在自定义 renderer 中扩展它。后者更加灵活。
下面是一个完整示例。

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
