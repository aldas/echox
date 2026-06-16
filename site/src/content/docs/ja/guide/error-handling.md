---
title: エラー処理
description: ハンドラとミドルウェアからエラーを返すことで HTTP エラーを一元処理します。
sidebar:
  order: 6
---

Echo は**一元的な**エラー処理を推奨します。ハンドラとミドルウェアは `error` を返し、
単一のエラーハンドラがそれを HTTP レスポンスに変換します。これにより、ログ記録と
レスポンス整形を 1 か所にまとめられます。

通常の `error` または `*echo.HTTPError` を返します。

```go
e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		if !authenticated(c) {
			// invalid credentials → abort with 401
			return echo.NewHTTPError(http.StatusUnauthorized, "Please provide valid credentials")
		}
		return next(c)
	}
})
```

メッセージなしの `echo.NewHTTPError(code)` はステータステキスト（例：
`"Unauthorized"`）を使います。Echo には `echo.ErrBadRequest`、`echo.ErrNotFound`、
`echo.ErrUnauthorized` などの sentinel エラーもあります。

## デフォルトエラーハンドラ

Echo のデフォルトハンドラは JSON で応答します。

```json
{ "message": "error connecting to redis" }
```

通常の `error` は `500 Internal Server Error` になります（エラーを公開して実行している場合は
元のメッセージが含まれます）。`*HTTPError` は自身のステータスコードとメッセージを使います。

## カスタムエラーハンドラ

`e.HTTPErrorHandler` で独自のハンドラを設定します。エラーページ、通知、
またはエラーを集中管理システムへ送る場合に有用です。

`echo.UnwrapResponse()` でレスポンスがすでに送信済みか確認し、`echo.HTTPStatusCoder`
でエラーチェーン内のステータスコードを探します。

```go
func customHTTPErrorHandler(c *echo.Context, err error) {
	if resp, uErr := echo.UnwrapResponse(c.Response()); uErr == nil {
		if resp.Committed {
			return // already sent by a handler/middleware
		}
	}

	code := http.StatusInternalServerError
	var sc echo.HTTPStatusCoder
	if errors.As(err, &sc) {
		if tmp := sc.StatusCode(); tmp != 0 {
			code = tmp
		}
	}

	var cErr error
	if c.Request().Method == http.MethodHead {
		cErr = c.NoContent(code)
	} else {
		cErr = c.File(fmt.Sprintf("%d.html", code)) // e.g. 404.html, 500.html
	}
	if cErr != nil {
		c.Logger().Error("failed to send error page", "error", errors.Join(err, cErr))
	}
}

e.HTTPErrorHandler = customHTTPErrorHandler
```

:::tip
logger の代わりに、または logger に加えて、中央のハンドラから Sentry、Elasticsearch、
Splunk などの外部サービスへエラーを転送できます。
:::
