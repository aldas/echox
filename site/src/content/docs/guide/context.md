---
title: Context
description: The per-request object carrying the request, response, params, and helpers.
sidebar:
  order: 4
---

`echo.Context` represents the context of the current HTTP request. A pointer to it
(`*echo.Context`) is passed to every handler and middleware, carrying the request and
response, path parameters, bound data, and helpers for building responses.

```go
func handler(c *echo.Context) error {
	// ...
	return nil
}
```

## Reading input

```go
id := c.Param("id")            // path parameter
q := c.QueryParam("q")         // query string value
all := c.QueryParams()         // url.Values of all query params
name := c.FormValue("name")    // form field (URL + body)
ua := c.Request().Header.Get(echo.HeaderUserAgent)
```

There are matching `*Or` helpers that return a default when a value is absent —
`c.ParamOr("id", "0")`, `c.QueryParamOr("page", "1")`, `c.FormValueOr(...)`.

## Writing responses

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

## Files

```go
c.File("public/report.pdf")             // serve a file
c.Attachment("invoice.pdf", "inv.pdf")  // prompt download
c.Inline("photo.png", "photo.png")      // render inline
```

## Per-request storage

Share data between middleware and handlers with `Get`/`Set`:

```go
c.Set("user", u)
u, _ := c.Get("user").(*User)
```

Typed access is available via the generics helpers:

```go
u, err := echo.ContextGet[*User](c, "user")
```

## Binding & validation

`c.Bind()` parses request data into a struct; see [Binding](/guide/binding/).

```go
var dto CreateUser
if err := c.Bind(&dto); err != nil {
	return echo.ErrBadRequest
}
```
