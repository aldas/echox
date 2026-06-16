---
title: Cookies
description: Crea, lee y lista HTTP cookies usando el tipo estándar http.Cookie.
sidebar:
  order: 11
---

Una cookie es una pequeña pieza de datos que un servidor envía al navegador, que el navegador
almacena y vuelve a enviar en requests posteriores. Las cookies permiten que los sitios web
recuerden información con estado, como un carrito de compras, el estado de autenticación o
valores de formularios ingresados previamente.

Echo usa el tipo estándar `http.Cookie` de Go para agregar y obtener cookies desde
`echo.Context` en un handler.

## Atributos de Cookie

| Atributo   | Opcional |
| ---------- | -------- |
| `Name`     | No       |
| `Value`    | No       |
| `Path`     | Sí       |
| `Domain`   | Sí       |
| `Expires`  | Sí       |
| `Secure`   | Sí       |
| `HttpOnly` | Sí       |

## Crear una cookie

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

- Crea la cookie con `new(http.Cookie)`.
- Establece atributos en los campos de `http.Cookie`.
- Llama a `c.SetCookie(cookie)` para agregar un header `Set-Cookie` a la response.

## Leer una cookie

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

- Lee una cookie por nombre con `c.Cookie("username")`.
- Accede a sus atributos mediante los campos de `http.Cookie`.

## Leer todas las cookies

```go
func readAllCookies(c *echo.Context) error {
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	return c.String(http.StatusOK, "read all the cookies")
}
```
