---
title: Context
description: O objeto por request que carrega request, response, parâmetros e helpers.
sidebar:
  order: 4
---

`echo.Context` representa o contexto do request HTTP atual. Um ponteiro para ele
(`*echo.Context`) é passado para todo handler e middleware, carregando o request e a
response, parâmetros de caminho, dados vinculados e helpers para criar responses.

```go
func handler(c *echo.Context) error {
	// ...
	return nil
}
```

## Ler entrada

```go
id := c.Param("id")            // path parameter
q := c.QueryParam("q")         // query string value
all := c.QueryParams()         // url.Values of all query params
name := c.FormValue("name")    // form field (URL + body)
ua := c.Request().Header.Get(echo.HeaderUserAgent)
```

Há helpers `*Or` correspondentes que retornam um padrão quando um valor está ausente —
`c.ParamOr("id", "0")`, `c.QueryParamOr("page", "1")`, `c.FormValueOr(...)`.

## Escrever responses

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

## Arquivos

```go
c.File("public/report.pdf")             // serve a file
c.Attachment("invoice.pdf", "inv.pdf")  // prompt download
c.Inline("photo.png", "photo.png")      // render inline
```

## Armazenamento por request

Compartilhe dados entre middleware e handlers com `Get`/`Set`:

```go
c.Set("user", u)
u, _ := c.Get("user").(*User)
```

Acesso tipado está disponível por meio dos helpers de generics:

```go
u, err := echo.ContextGet[*User](c, "user")
```

## Binding e validação

`c.Bind()` analisa dados do request em uma struct; veja [Binding](/pt-br/guide/binding/).

```go
var dto CreateUser
if err := c.Bind(&dto); err != nil {
	return echo.ErrBadRequest
}
```
