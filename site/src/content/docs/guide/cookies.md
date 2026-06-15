---
title: Cookies
description: Create, read, and list HTTP cookies using the standard http.Cookie type.
sidebar:
  order: 11
---

A cookie is a small piece of data a server sends to the browser, which the browser
stores and sends back on subsequent requests. Cookies let websites remember stateful
information such as a shopping cart, authentication state, or previously entered form
values.

Echo uses Go's standard `http.Cookie` type to add and retrieve cookies from the
`echo.Context` in a handler.

## Cookie attributes

| Attribute  | Optional |
| ---------- | -------- |
| `Name`     | No       |
| `Value`    | No       |
| `Path`     | Yes      |
| `Domain`   | Yes      |
| `Expires`  | Yes      |
| `Secure`   | Yes      |
| `HttpOnly` | Yes      |

## Create a cookie

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

- Create the cookie with `new(http.Cookie)`.
- Set attributes on the `http.Cookie` fields.
- Call `c.SetCookie(cookie)` to add a `Set-Cookie` header to the response.

## Read a cookie

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

- Read a cookie by name with `c.Cookie("username")`.
- Access its attributes through the `http.Cookie` fields.

## Read all cookies

```go
func readAllCookies(c *echo.Context) error {
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	return c.String(http.StatusOK, "read all the cookies")
}
```
