---
title: Body Limit
description: Rejeite requests cujo body exceda um tamanho máximo configurado.
sidebar:
  order: 3
---

O middleware Body Limit define o tamanho máximo permitido para o body de um request. Se o tamanho
exceder o limite configurado, ele envia uma response `413 Request Entity Too Large`.

O limite é aplicado tanto ao header de request `Content-Length` quanto ao conteúdo real
lido, o que o torna resistente a headers falsificados. O limite é especificado
em bytes.

## Uso

```go
e := echo.New()
e.Use(middleware.BodyLimit(2_097_152)) // 2 MB
```

## Configuração customizada

```go
e := echo.New()
e.Use(middleware.BodyLimitWithConfig(middleware.BodyLimitConfig{}))
```

## Configuração

```go
type BodyLimitConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// LimitBytes is the maximum allowed size in bytes for a request body.
	LimitBytes int64
}
```

### Configuração padrão

```go
// Effective defaults applied when fields are left unset (Limit is required).
BodyLimitConfig{
	Skipper: DefaultSkipper,
}
```
