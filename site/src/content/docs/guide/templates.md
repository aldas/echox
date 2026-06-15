---
title: Templates
description: Render HTML templates with any engine by registering a renderer.
sidebar:
  order: 10
---

`Context#Render(code int, name string, data any) error` renders a template with data
and sends a `text/html` response with a status code. Register a renderer by setting
`Echo#Renderer`, which lets you use any template engine.

## Rendering

The example below uses Go's `html/template`.

Use the default template renderer:

```go
e.Renderer = &echo.TemplateRenderer{
	Template: template.Must(template.New("hello").Parse("Hello, {{.}}!")),
}
```

Or implement the `echo.Renderer` interface yourself:

```go
type Template struct {
	templates *template.Template
}

func (t *Template) Render(c *echo.Context, w io.Writer, name string, data any) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
```

1. Pre-compile the templates.

   `public/views/hello.html`:

   ```html
   {{define "hello"}}Hello, {{.}}!{{end}}
   ```

   ```go
   t := &Template{
       templates: template.Must(template.ParseGlob("public/views/*.html")),
   }
   ```

2. Register the renderer.

   ```go
   e := echo.New()
   e.Renderer = t
   e.GET("/hello", Hello)
   ```

3. Render a template inside the handler.

   ```go
   func Hello(c *echo.Context) error {
       return c.Render(http.StatusOK, "hello", "World")
   }
   ```

## Advanced: calling Echo from templates

Sometimes it is useful to generate URIs from within a template by calling
`Echo#Reverse`. Go's `html/template` is not ideally suited for this, but it can be
done in two ways: by providing a common method on every object passed to templates,
or by passing a `map[string]any` and augmenting it in the custom renderer. The
latter is more flexible. Here is a complete example.

`template.html`:

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

`server.go`:

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
