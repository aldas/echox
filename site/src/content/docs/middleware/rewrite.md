---
title: Rewrite
description: Rewrite the URL path based on configured rules.
sidebar:
  order: 21
---

Rewrite middleware rewrites the URL path based on the provided rules. It is helpful for
backward compatibility or for creating cleaner and more descriptive links.

All core middleware lives in the `middleware` package:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Usage

```go
e.Pre(middleware.Rewrite(map[string]string{
	"/old":              "/new",
	"/api/*":            "/$1",
	"/js/*":             "/public/javascripts/$1",
	"/users/*/orders/*": "/user/$1/order/$2",
}))
```

The values captured in asterisks can be retrieved by index, e.g. `$1`, `$2`, and so on. Each
asterisk is non-greedy (translated to a capture group `(.*?)`); when using multiple asterisks,
a trailing `*` matches the rest of the path.

:::caution
Rewrite middleware should be registered via `Echo#Pre()` so it runs before the router.
:::

## Custom configuration

```go
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))
```

## Configuration

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

Default configuration:

| Name    | Value          |
| ------- | -------------- |
| Skipper | DefaultSkipper |

### Regex-based rules

For advanced rewriting of paths, rules may also be defined using regular expressions. Normal
capture groups can be defined using `()` and referenced by index (`$1`, `$2`, ...) in the
rewritten path.

`RegexRules` and normal `Rules` can be combined.

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
