---
title: ボディ制限
description: ボディが設定済みの最大サイズを超えるリクエストを拒否します。
sidebar:
  order: 3
---

Body Limit ミドルウェアはリクエストボディに許可される最大サイズを設定します。
サイズが設定値を超えた場合、`413 Request Entity Too Large` レスポンスを送信します。

この制限は `Content-Length` リクエスト header と実際に読み取られた内容の両方に適用されるため、
偽装された header に対しても耐性があります。制限値はバイト単位で指定します。

## 使い方

```go
e := echo.New()
e.Use(middleware.BodyLimit(2_097_152)) // 2 MB
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.BodyLimitWithConfig(middleware.BodyLimitConfig{}))
```

## 設定

```go
type BodyLimitConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// LimitBytes is the maximum allowed size in bytes for a request body.
	LimitBytes int64
}
```

### デフォルト設定

```go
// Effective defaults applied when fields are left unset (Limit is required).
BodyLimitConfig{
	Skipper: DefaultSkipper,
}
```
