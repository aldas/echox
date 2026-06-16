---
title: Cookie
description: 標準の http.Cookie 型を使って HTTP Cookie を作成、読み取り、一覧表示します。
sidebar:
  order: 11
---

Cookie はサーバーがブラウザーに送信する小さなデータで、ブラウザーはそれを保存し、
後続のリクエストで送り返します。Cookie により、ショッピングカート、認証状態、
以前入力したフォーム値などの状態を Web サイトが記憶できます。

Echo は Go 標準の `http.Cookie` 型を使い、ハンドラ内の `echo.Context` から
Cookie を追加および取得します。

## Cookie 属性

| 属性       | 任意 |
| ---------- | ---- |
| `Name`     | いいえ |
| `Value`    | いいえ |
| `Path`     | はい |
| `Domain`   | はい |
| `Expires`  | はい |
| `Secure`   | はい |
| `HttpOnly` | はい |

## Cookie を作成する

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

- `new(http.Cookie)` で Cookie を作成します。
- `http.Cookie` フィールドに属性を設定します。
- `c.SetCookie(cookie)` を呼び出して、レスポンスに `Set-Cookie` header を追加します。

## Cookie を読む

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

- `c.Cookie("username")` で名前から Cookie を読み取ります。
- `http.Cookie` フィールドを通じて属性にアクセスします。

## すべての Cookie を読む

```go
func readAllCookies(c *echo.Context) error {
	for _, cookie := range c.Cookies() {
		fmt.Println(cookie.Name)
		fmt.Println(cookie.Value)
	}
	return c.String(http.StatusOK, "read all the cookies")
}
```
