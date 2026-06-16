---
title: Instalación
description: Agrega Echo v5 a tu módulo Go.
sidebar:
  order: 2
---

Echo se distribuye como un módulo Go: `github.com/labstack/echo/v5`.

## Requisitos

Echo v5 requiere **Go 1.25 o posterior**.

```bash
go version
```

## Agregar a un proyecto

Dentro de un módulo existente:

```bash
go get github.com/labstack/echo/v5
```

O inicia un módulo nuevo:

```bash
mkdir myapp && cd myapp
go mod init myapp
go get github.com/labstack/echo/v5
```

Impórtalo en tu código:

```go
import "github.com/labstack/echo/v5"
```

## Versiones

| Versión | Import path                     | Estado |
| ------- | ------------------------------- | ------ |
| **v5**  | `github.com/labstack/echo/v5`   | Actual |
| v4      | `github.com/labstack/echo/v4`   | LTS (mantenimiento) |

:::note
Echo sigue [semantic import versioning](https://go.dev/blog/v2-go-modules): la
versión major forma parte del import path, por lo que v4 y v5 pueden coexistir durante una migración.
:::

## Mantenerse actualizado

```bash
go get github.com/labstack/echo/v5
go mod tidy
```
