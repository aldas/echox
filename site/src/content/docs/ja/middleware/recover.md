---
title: Recover
description: チェーン内のどこで起きた panic からも復旧し、一元化されたエラーハンドラへ委譲します。
sidebar:
  order: 18
---

Recover ミドルウェアは、チェーン内のどこで発生した panic からも復旧し、スタックトレースを出力して、
一元化された [HTTPErrorHandler](/ja/guide/customization/#http-error-handler) に制御を渡します。

## 使い方

```go
e.Use(middleware.Recover())
```

## カスタム設定

```go
e := echo.New()
e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{
	StackSize: 1 << 10, // 1 KB
}))
```

上の例では `StackSize` を 1 KB にし、`DisableStackAll` と `DisablePrintStack` はデフォルト値を使います。

## 設定

```go
type RecoverConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// Size of the stack to be printed.
	// Optional. Default value 4KB.
	StackSize int

	// DisableStackAll disables formatting stack traces of all other goroutines
	// into the buffer after the trace for the current goroutine.
	// Optional. Default value false.
	DisableStackAll bool

	// DisablePrintStack disables printing the stack trace.
	// Optional. Default value false.
	DisablePrintStack bool
}
```

### デフォルト設定

```go
var DefaultRecoverConfig = RecoverConfig{
	Skipper:           DefaultSkipper,
	StackSize:         4 << 10, // 4 KB
	DisableStackAll:   false,
	DisablePrintStack: false,
}
```
