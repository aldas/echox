---
title: メソッドオーバーライド
description: header、form、query の値で POST リクエストの HTTP メソッドを上書きします。
sidebar:
  order: 13
---

Method Override ミドルウェアは、リクエストから上書きされたメソッドを読み取り、
元のメソッドの代わりに使います。

:::note
セキュリティ上の理由により、上書きできるのは `POST` メソッドだけです。
:::

## 使い方

```go
e.Pre(middleware.MethodOverride())
```

## カスタム設定

```go
e := echo.New()
e.Pre(middleware.MethodOverrideWithConfig(middleware.MethodOverrideConfig{
	Getter: middleware.MethodFromForm("_method"),
}))
```

メソッドは `MethodFromHeader`、`MethodFromForm`、`MethodFromQuery` から取得できます。

## 設定

```go
type MethodOverrideConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Getter is a function that gets the overridden method from the request.
	// Optional. Default value MethodFromHeader(echo.HeaderXHTTPMethodOverride).
	Getter MethodOverrideGetter
}
```

### デフォルト設定

```go
DefaultMethodOverrideConfig = MethodOverrideConfig{
	Skipper: DefaultSkipper,
	Getter:  MethodFromHeader(echo.HeaderXHTTPMethodOverride),
}
```
