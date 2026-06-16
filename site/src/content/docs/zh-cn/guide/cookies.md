---
title: Cookie
description: 使用标准 http.Cookie 类型创建、读取和列出 HTTP Cookie。
sidebar:
  order: 11
---

Cookie 是服务器发送给浏览器的一小段数据，浏览器会保存它，并在后续请求中发回。
Cookie 让网站可以记住购物车、认证状态或之前输入的表单值等有状态信息。

Echo 使用 Go 标准库的 `http.Cookie` 类型，在处理函数中通过 `echo.Context`
添加和获取 Cookie。

## Cookie 属性

| 属性       | 可选 |
| ---------- | ---- |
| `Name`     | 否   |
| `Value`    | 否   |
| `Path`     | 是   |
| `Domain`   | 是   |
| `Expires`  | 是   |
| `Secure`   | 是   |
| `HttpOnly` | 是   |

## 创建 Cookie

```go
func writeCookie(c *echo.Context) error {
	cookie := new(http.Cookie)
	cookie.Name = "username"
	cookie.Value = "jon"
	cookie.Expires = time.Now().Add(24 * time.Hour)
	c.SetCookie(cookie)
	return c.String(http.StatusOK, "write a cookie")
}
```

- 使用 `new(http.Cookie)` 创建 Cookie。
- 在 `http.Cookie` 字段上设置属性。
- 调用 `c.SetCookie(cookie)`，向响应添加 `Set-Cookie` header。

## 读取 Cookie

```go
func readCookie(c *echo.Context) error {
	cookie, err := c.Cookie("username")
	if err != nil {
		return err
	}
	fmt.Println(cookie.Name)
	fmt.Println(cookie.Value)
	return c.String(http.StatusOK, "read a cookie")
}
```

- 使用 `c.Cookie("username")` 按名称读取 Cookie。
- 通过 `http.Cookie` 字段访问其属性。

## 读取所有 Cookie

```go
func readAllCookies(c *echo.Context) error {
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	return c.String(http.StatusOK, "read all the cookies")
}
```
