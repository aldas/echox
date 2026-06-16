---
title: 上下文
description: 每个请求对应的对象，携带请求、响应、参数和辅助方法。
sidebar:
  order: 4
---

`echo.Context` 表示当前 HTTP 请求的上下文。每个处理函数和中间件都会收到它的指针
（`*echo.Context`），其中包含请求和响应、路径参数、已绑定数据，以及用于构建响应的辅助方法。

```go
func handler(c *echo.Context) error {
	// ...
	return nil
}
```

## 读取输入

```go
id := c.Param("id")            // path parameter
q := c.QueryParam("q")         // query string value
all := c.QueryParams()         // url.Values of all query params
name := c.FormValue("name")    // form field (URL + body)
ua := c.Request().Header.Get(echo.HeaderUserAgent)
```

也有对应的 `*Or` 辅助方法，在值不存在时返回默认值，例如
`c.ParamOr("id", "0")`、`c.QueryParamOr("page", "1")`、`c.FormValueOr(...)`。

## 写入响应

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

## 文件

```go
c.File("public/report.pdf")             // serve a file
c.Attachment("invoice.pdf", "inv.pdf")  // prompt download
c.Inline("photo.png", "photo.png")      // render inline
```

## 每个请求的存储

使用 `Get`/`Set` 在中间件和处理函数之间共享数据：

```go
c.Set("user", u)
u, _ := c.Get("user").(*User)
```

也可以通过泛型辅助方法进行带类型访问：

```go
u, err := echo.ContextGet[*User](c, "user")
```

## 绑定和验证

`c.Bind()` 会把请求数据解析到 struct 中；参见[绑定](/zh-cn/guide/binding/)。

```go
var dto CreateUser
if err := c.Bind(&dto); err != nil {
	return echo.ErrBadRequest
}
```
