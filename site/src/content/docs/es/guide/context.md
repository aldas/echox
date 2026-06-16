---
title: Context
description: El objeto por request que transporta request, response, params y helpers.
sidebar:
  order: 4
---

`echo.Context` representa el contexto del request HTTP actual. Se pasa un puntero a él
(`*echo.Context`) a cada handler y middleware, y transporta el request y response,
parámetros de path, datos vinculados y helpers para construir responses.

```go
func handler(c *echo.Context) error {
	// ...
	return nil
}
```

## Leer entrada

```go
id := c.Param("id")            // path parameter
q := c.QueryParam("q")         // query string value
all := c.QueryParams()         // url.Values of all query params
name := c.FormValue("name")    // form field (URL + body)
ua := c.Request().Header.Get(echo.HeaderUserAgent)
```

Hay helpers `*Or` equivalentes que devuelven un valor por defecto cuando el valor no está presente:
`c.ParamOr("id", "0")`, `c.QueryParamOr("page", "1")`, `c.FormValueOr(...)`.

## Escribir responses

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

## Archivos

```go
c.File("public/report.pdf")             // serve a file
c.Attachment("invoice.pdf", "inv.pdf")  // prompt download
c.Inline("photo.png", "photo.png")      // render inline
```

## Almacenamiento por request

Comparte datos entre middleware y handlers con `Get`/`Set`:

```go
c.Set("user", u)
u, _ := c.Get("user").(*User)
```

El acceso tipado está disponible mediante los helpers genéricos:

```go
u, err := echo.ContextGet[*User](c, "user")
```

## Binding y validación

`c.Bind()` analiza datos del request en un struct; consulta [Binding](/es/guide/binding/).

```go
var dto CreateUser
if err := c.Bind(&dto); err != nil {
	return echo.ErrBadRequest
}
```
