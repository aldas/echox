---
title: Templates
description: Renderiza templates HTML con cualquier engine registrando un renderer.
sidebar:
  order: 10
---

`Context#Render(code int, name string, data any) error` renderiza un template con datos
y envía una response `text/html` con un código de estado. Registra un renderer estableciendo
`Echo#Renderer`, lo que te permite usar cualquier template engine.

## Renderizado

El ejemplo siguiente usa `html/template` de Go.

Usa el renderer de templates por defecto:

```go
e.Renderer = &echo.TemplateRenderer{
	Template: template.Must(template.New("hello").Parse("Hello, {{.}}!")),
}
```

O implementa tú mismo la interfaz `echo.Renderer`:

```go
type Template struct {
	templates *template.Template
}

func (t *Template) Render(c *echo.Context, w io.Writer, name string, data any) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
```

1. Precompila los templates.

   `public/views/hello.html`:

   ```html
   {{define "hello"}}Hello, {{.}}!{{end}}
   ```

   ```go
   t := &Template{
       templates: template.Must(template.ParseGlob("public/views/*.html")),
   }
   ```

2. Registra el renderer.

   ```go
   e := echo.New()
   e.Renderer = t
   e.GET("/hello", Hello)
   ```

3. Renderiza un template dentro del handler.

   ```go
   func Hello(c *echo.Context) error {
       return c.Render(http.StatusOK, "hello", "World")
   }
   ```

## Avanzado: llamar a Echo desde templates

A veces es útil generar URIs desde un template llamando a `Echo#Reverse`. `html/template`
de Go no es ideal para esto, pero se puede hacer de dos formas: proporcionando un método común
en cada objeto que se pasa a los templates, o pasando un `map[string]any` y ampliándolo en el
renderer personalizado. La segunda opción es más flexible. Aquí tienes un ejemplo completo.

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
