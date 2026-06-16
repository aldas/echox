---
title: リライト
description: 設定されたルールに基づいて URL パスを書き換えます。
sidebar:
  order: 21
---

Rewrite ミドルウェアは、指定されたルールに基づいて URL パスを書き換えます。
後方互換性を保つ場合や、より短く分かりやすいリンクを作る場合に役立ちます。

すべてのコアミドルウェアは `middleware` パッケージに含まれています：

```go
import "github.com/labstack/echo/v5/middleware"
```

## 使い方

```go
e.Pre(middleware.Rewrite(map[string]string{
	"/old":              "/new",
	"/api/*":            "/$1",
	"/js/*":             "/public/javascripts/$1",
	"/users/*/orders/*": "/user/$1/order/$2",
}))
```

アスタリスクでキャプチャされた値は、`$1`、`$2` などのインデックスで取得できます。
各アスタリスクは非貪欲です（キャプチャグループ `(.*?)` に変換されます）。
複数のアスタリスクを使う場合、末尾の `*` は残りのパスにマッチします。

:::caution
Rewrite ミドルウェアは、ルーターより前に実行されるよう `Echo#Pre()` で登録してください。
:::

## カスタム設定

```go
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))
```

## 設定

```go
type RewriteConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Rules defines the URL path rewrite rules. The values captured in asterisk can be
	// retrieved by index e.g. $1, $2 and so on.
	// Example:
	// "/old":              "/new",
	// "/api/*":            "/$1",
	// "/js/*":             "/public/javascripts/$1",
	// "/users/*/orders/*": "/user/$1/order/$2",
	// Required.
	Rules map[string]string

	// RegexRules defines the URL path rewrite rules using regexp.Regexp with captures.
	// Every capture group in the values can be retrieved by index e.g. $1, $2 and so on.
	// Example:
	// "^/old/[0.9]+/":     "/new",
	// "^/api/.+?/(.*)":     "/v2/$1",
	RegexRules map[*regexp.Regexp]string
}
```

デフォルト設定：

| 名前    | 値             |
| ------- | -------------- |
| Skipper | DefaultSkipper |

### 正規表現ベースのルール

パスの高度な書き換えでは、正規表現でルールを定義することもできます。
通常のキャプチャグループは `()` で定義し、書き換え後のパスでインデックス
（`$1`、`$2` など）により参照できます。

`RegexRules` と通常の `Rules` は組み合わせられます。

```go
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{
	Rules: map[string]string{
		"^/v1/*": "/v2/$1",
	},
	RegexRules: map[*regexp.Regexp]string{
		regexp.MustCompile("^/foo/([0-9].*)"):  "/num/$1",
		regexp.MustCompile("^/bar/(.+?)/(.*)"): "/baz/$2/$1",
	},
}))
```
