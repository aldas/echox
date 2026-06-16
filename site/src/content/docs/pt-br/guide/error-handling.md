---
title: Tratamento de erros
description: Tratamento centralizado de erros HTTP retornando erros de handlers e middleware.
sidebar:
  order: 6
---

Echo defende o tratamento de erros **centralizado**: handlers e middleware retornam um
`error`, e um único handler de erros o transforma em uma response HTTP. Isso mantém logs
e formatação de response em um só lugar.

Retorne um `error` simples ou um `*echo.HTTPError`:

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

`echo.NewHTTPError(code)` sem mensagem usa o texto do status (por exemplo, `"Unauthorized"`).
Echo também fornece erros sentinela como `echo.ErrBadRequest`, `echo.ErrNotFound` e
`echo.ErrUnauthorized`.

## Handler de erro padrão

O handler padrão do Echo responde em JSON:

```json
{ "message": "error connecting to redis" }
```

Um `error` simples vira `500 Internal Server Error` (a mensagem original é incluída
quando a aplicação roda com erros expostos). Um `*HTTPError` usa seu código de status e mensagem.

## Handler de erro customizado

Defina o seu via `e.HTTPErrorHandler` — útil para páginas de erro, notificações ou
envio de erros para um sistema centralizado.

Verifique se a response já foi enviada com `echo.UnwrapResponse()`, e encontre um
código de status na cadeia de erros via `echo.HTTPStatusCoder`:

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
Em vez de (ou além de) usar o logger, encaminhe erros para um serviço externo como
Sentry, Elasticsearch ou Splunk a partir do handler central.
:::
