---
title: Rewrite
description: Reescreva o caminho da URL com base em regras configuradas.
sidebar:
  order: 21
---

O middleware Rewrite reescreve o caminho da URL com base nas regras fornecidas. Ele é útil para
compatibilidade retroativa ou para criar links mais limpos e descritivos.

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Uso

```go
e.Pre(middleware.Rewrite(map[string]string{
	"/old":              "/new",
	"/api/*":            "/$1",
	"/js/*":             "/public/javascripts/$1",
	"/users/*/orders/*": "/user/$1/order/$2",
}))
```

Os valores capturados em asteriscos podem ser recuperados por índice, por exemplo `$1`, `$2` e assim por diante. Cada
asterisco é non-greedy (traduzido para um grupo de captura `(.*?)`); ao usar vários asteriscos,
um `*` final corresponde ao restante do caminho.

:::caution
O middleware Rewrite deve ser registrado via `Echo#Pre()` para rodar antes do router.
:::

## Configuração customizada

```go
e := echo.New()
e.Pre(middleware.RewriteWithConfig(middleware.RewriteConfig{}))
```

## Configuração

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

Configuração padrão:

| Nome    | Valor          |
| ------- | -------------- |
| Skipper | DefaultSkipper |

### Regras baseadas em regex

Para reescrita avançada de caminhos, as regras também podem ser definidas usando expressões regulares. Grupos
de captura normais podem ser definidos com `()` e referenciados por índice (`$1`, `$2`, ...) no
caminho reescrito.

`RegexRules` e `Rules` normais podem ser combinados.

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
