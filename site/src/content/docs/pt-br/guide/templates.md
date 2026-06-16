---
title: Templates
description: Renderize templates HTML com qualquer engine registrando um renderer.
sidebar:
  order: 10
---

`Context#Render(code int, name string, data any) error` renderiza um template com dados
e envia uma response `text/html` com um código de status. Registre um renderer definindo
`Echo#Renderer`, o que permite usar qualquer engine de templates.

## Renderização

O exemplo abaixo usa `html/template` do Go.

Use o renderer de templates padrão:

```go
e.Renderer = &echo.TemplateRenderer{
	Template: template.Must(template.New("hello").Parse("Hello, {{.}}!")),
}
```

Ou implemente você mesmo a interface `echo.Renderer`:

```go
type Template struct {
	templates *template.Template
}

func (t *Template) Render(c *echo.Context, w io.Writer, name string, data any) error {
	return t.templates.ExecuteTemplate(w, name, data)
}
```

1. Pré-compile os templates.

   `public/views/hello.html`:

   ```html
   {{define "hello"}}Hello, {{.}}!{{end}}
   ```

   ```go
   t := &Template{
       templates: template.Must(template.ParseGlob("public/views/*.html")),
   }
   ```

2. Registre o renderer.

   ```go
   e := echo.New()
   e.Renderer = t
   e.GET("/hello", Hello)
   ```

3. Renderize um template dentro do handler.

   ```go
   func Hello(c *echo.Context) error {
       return c.Render(http.StatusOK, "hello", "World")
   }
   ```

## Avançado: chamando Echo a partir de templates

Às vezes é útil gerar URIs de dentro de um template chamando
`Echo#Reverse`. `html/template` do Go não é ideal para isso, mas é possível
fazer de duas formas: fornecendo um método comum em cada objeto passado para templates,
ou passando um `map[string]any` e ampliando-o no renderer customizado. A
segunda opção é mais flexível. Aqui está um exemplo completo.

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
