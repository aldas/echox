---
title: 重写
description: 根据配置规则重写 URL 路径。
sidebar:
  order: 21
---

Rewrite 中间件会根据提供的规则重写 URL 路径。它有助于保持向后兼容，或创建更简洁、
更具描述性的链接。

## 用法

```go
e.Pre(middleware.Rewrite(map[string]string{
	"/old":              "/new",
	"/api/*":            "/$1",
	"/js/*":             "/public/javascripts/$1",
	"/users/*/orders/*": "/user/$1/order/$2",
}))
```

星号捕获的值可以按索引获取，例如 `$1`、`$2` 等。每个星号都是非贪婪的
（转换为捕获组 `(.*?)`）；使用多个星号时，尾随 `*` 会匹配路径剩余部分。

:::caution
Rewrite 中间件应通过 `Echo#Pre()` 注册，使它在路由器之前运行。
:::

## 自定义配置

```go
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))
```

## 配置

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

默认配置：

| 名称    | 值             |
| ------- | -------------- |
| Skipper | DefaultSkipper |

### 基于正则表达式的规则

对于路径的高级重写，也可以使用正则表达式定义规则。可以用 `()` 定义普通捕获组，
并在重写后的路径中按索引引用（`$1`、`$2` 等）。

`RegexRules` 可以和普通 `Rules` 组合使用。

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
