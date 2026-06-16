---
title: CSRF
description: Sec-Fetch-Site メタデータと token 検証を使った Cross-Site Request Forgery 防御です。
sidebar:
  order: 7
---

Cross-Site Request Forgery（CSRF、"sea-surf" と発音されることもある、または XSRF）は、
Web サイトが信頼するユーザーから未承認のコマンドが送信される悪意ある攻撃の一種です。

## 使い方

```go
e.Use(middleware.CSRF())
```

## 仕組み

CSRF ミドルウェアは、現代的な多層防御として
[`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)
header をサポートします。
[CSRF protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#fetch-metadata-headers)
のために、従来の token ベース機構と並行して OWASP 推奨の Fetch Metadata API を実装しています。

現代的なブラウザーはすべてのリクエストに `Sec-Fetch-Site` header を自動送信し、
リクエスト元とターゲットの関係を示します。ミドルウェアはこれを使ってセキュリティ判断を行います。

- **`same-origin`** または **`none`**：許可（完全な同一 origin、またはユーザーの直接ナビゲーション）
- **`same-site`**：token 検証にフォールバック（例：サブドメインからメインドメイン）
- **`cross-site`**：安全でないメソッド（POST、PUT、DELETE、PATCH）ではデフォルトで `403` エラーによりブロック

この header を送信しないブラウザー（古いブラウザー）では、従来の token ベース CSRF 防御へシームレスに
フォールバックします。

`Sec-Fetch-Site` の挙動は 2 つのオプションで調整できます。

- `TrustedOrigins []string`：cross-site リクエストで特定 origin を許可リスト化（OAuth callback、webhook などに有用）
- `AllowSecFetchSiteFunc func(c *echo.Context) (bool, error)`：same-site/cross-site 検証用のカスタムロジック

```go
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	// Allow OAuth callbacks from a trusted provider.
	TrustedOrigins: []string{"https://oauth-provider.com"},

	// Custom validation for same-site/cross-site requests.
	AllowSecFetchSiteFunc: func(c *echo.Context) (bool, error) {
		// Your custom authorization logic here.
		return validateCustomAuth(c), nil
		// return true, err  // blocks the request with an error
		// return true, nil  // allows the request through
		// return false, nil // falls back to legacy token logic
	},
}))
```

## token ベース防御

```go
e := echo.New()
e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup: "header:X-XSRF-TOKEN",
}))
```

上の例は `X-XSRF-TOKEN` リクエスト header から CSRF token を抽出します。

代わりに Cookie から token を読む場合：

```go
middleware.CSRFWithConfig(middleware.CSRFConfig{
	TokenLookup:    "cookie:_csrf",
	CookiePath:     "/",
	CookieDomain:   "example.com",
	CookieSecure:   true,
	CookieHTTPOnly: true,
	CookieSameSite: http.SameSiteStrictMode,
})
```

## CSRF token へのアクセス

- **サーバー側**：token は `ContextKey` の下でコンテキストから利用でき、テンプレート経由でクライアントへ渡せます。
- **クライアント側**：token は CSRF Cookie から読み取れます。

## 設定

```go
type CSRFConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// TrustedOrigins permits any request with a `Sec-Fetch-Site` header whose `Origin`
	// header exactly matches one of the listed values. Values should be formatted as
	// the Origin header: "scheme://host[:port]".
	TrustedOrigins []string

	// AllowSecFetchSiteFunc allows custom behaviour for `Sec-Fetch-Site` requests that
	// are about to fail with a CSRF error, to be allowed or replaced with a custom
	// error. Applies to `same-site` and `cross-site` values.
	AllowSecFetchSiteFunc func(c *echo.Context) (bool, error)

	// TokenLength is the length of the generated token.
	// Optional. Default value 32.
	TokenLength uint8

	// TokenLookup is a string in the form "<source>:<name>" or
	// "<source>:<name>,<source>:<name>" used to extract the token from the request.
	// Optional. Default value "header:X-CSRF-Token".
	// Possible values:
	// - "header:<name>" or "header:<name>:<cut-prefix>"
	// - "query:<name>"
	// - "form:<name>"
	// Multiple sources example: "header:X-CSRF-Token,query:csrf".
	TokenLookup string `yaml:"token_lookup"`

	// Generator defines a function to generate the token.
	// Optional. Defaults to randomString(TokenLength).
	Generator func() string

	// ContextKey is the key under which the generated CSRF token is stored in the context.
	// Optional. Default value "csrf".
	ContextKey string

	// CookieName is the name of the CSRF cookie that stores the token.
	// Optional. Default value "_csrf".
	CookieName string

	// CookieDomain is the domain of the CSRF cookie.
	// Optional. Default value none.
	CookieDomain string

	// CookiePath is the path of the CSRF cookie.
	// Optional. Default value none.
	CookiePath string

	// CookieMaxAge is the max age (in seconds) of the CSRF cookie.
	// Optional. Default value 86400 (24h).
	CookieMaxAge int

	// CookieSecure indicates whether the CSRF cookie is secure.
	// Optional. Default value false.
	CookieSecure bool

	// CookieHTTPOnly indicates whether the CSRF cookie is HTTP only.
	// Optional. Default value false.
	CookieHTTPOnly bool

	// CookieSameSite indicates the SameSite mode of the CSRF cookie.
	// Optional. Default value SameSiteDefaultMode.
	CookieSameSite http.SameSite

	// ErrorHandler defines a function that returns custom errors.
	ErrorHandler func(c *echo.Context, err error) error
}
```

### デフォルト設定

```go
var DefaultCSRFConfig = CSRFConfig{
	Skipper:        DefaultSkipper,
	TokenLength:    32,
	TokenLookup:    "header:" + echo.HeaderXCSRFToken,
	ContextKey:     "csrf",
	CookieName:     "_csrf",
	CookieMaxAge:   86400,
	CookieSameSite: http.SameSiteDefaultMode,
}
```

## 完全な例

完全に実行可能な例は
[echox cookbook](https://github.com/labstack/echox/blob/master/cookbook/csrf/main.go) にあります。
