---
title: Cookies
description: Crie, leia e liste HTTP cookies usando o tipo padrão http.Cookie.
sidebar:
  order: 11
---

Um cookie é um pequeno pedaço de dados que um servidor envia ao navegador, que o navegador
armazena e envia de volta em requests subsequentes. Cookies permitem que sites lembrem
informações com estado, como carrinho de compras, estado de autenticação ou valores de formulário
inseridos anteriormente.

Echo usa o tipo padrão `http.Cookie` do Go para adicionar e recuperar cookies do
`echo.Context` em um handler.

## Atributos de cookie

| Atributo   | Opcional |
| ---------- | -------- |
| `Name`     | Não      |
| `Value`    | Não      |
| `Path`     | Sim      |
| `Domain`   | Sim      |
| `Expires`  | Sim      |
| `Secure`   | Sim      |
| `HttpOnly` | Sim      |

## Criar um cookie

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

- Crie o cookie com `new(http.Cookie)`.
- Defina atributos nos campos de `http.Cookie`.
- Chame `c.SetCookie(cookie)` para adicionar um header `Set-Cookie` à response.

## Ler um cookie

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

- Leia um cookie por nome com `c.Cookie("username")`.
- Acesse seus atributos por meio dos campos de `http.Cookie`.

## Ler todos os cookies

```go
func readAllCookies(c *echo.Context) error {
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	return c.String(http.StatusOK, "read all the cookies")
}
```
