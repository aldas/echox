---
title: Casbin Auth
description: Autoriza requests con la biblioteca de control de acceso Casbin usando un middleware personalizado pequeño.
sidebar:
  order: 4
---

[Casbin](https://github.com/casbin/casbin) es una biblioteca de control de acceso open-source
potente y eficiente para Go. Soporta aplicar autorización en muchos modelos:

- ACL (Access Control List)
- ACL con superuser
- ACL sin usuarios, útil para sistemas sin autenticación o log-ins de usuario
- ACL sin recursos: apunta a un tipo de recurso (por ejemplo `write-article`, `read-log`) en lugar de a uno individual
- RBAC (Role-Based Access Control)
- RBAC con roles de recursos: tanto usuarios como recursos pueden tener roles
- RBAC con dominios/tenants: los usuarios pueden tener conjuntos de roles distintos por dominio/tenant
- ABAC (Attribute-Based Access Control)
- RESTful
- Deny-override: se soportan reglas allow y deny; deny sobrescribe allow

Consulta el [resumen de API](https://casbin.org/docs/api-overview) y la
[documentación de Casbin](https://casbin.org/docs/) para más detalles.

## Dependencias

```bash
go get github.com/casbin/casbin/v3
```

```go
import (
	"github.com/casbin/casbin/v3"
)
```

## Implementación

Echo no incluye un middleware Casbin; la integración es un wrapper pequeño alrededor del
enforcer de Casbin:

```go
// NewCasbinMiddleware returns middleware for Casbin (https://casbin.org/).
func NewCasbinMiddleware(enforcer *casbin.Enforcer, userGetter func(*echo.Context) (string, error)) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			username, err := userGetter(c)
			if err != nil {
				return echo.ErrUnauthorized.Wrap(err)
			}
			if pass, err := enforcer.Enforce(username, c.Request().URL.Path, c.Request().Method); err != nil {
				return echo.ErrInternalServerError.Wrap(err)
			} else if !pass {
				return echo.NewHTTPError(http.StatusForbidden, "access denied")
			}
			return next(c)
		}
	}
}
```

## Ejemplo

Crea un archivo de modelo Casbin `auth_model.conf`:

```ini
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && (r.act == p.act || p.act == "*")
```

Crea un archivo de policy Casbin `auth_policy.csv`:

```csv
p, 1234567890, /dataset1/*, GET
p, alice, /dataset1/*, GET
p, alice, /dataset1/resource1, POST
p, bob, /dataset2/resource1, *
p, bob, /dataset2/resource2, GET
p, bob, /dataset2/folder1/*, POST
p, dataset1_admin, /dataset1/*, *
g, cathy, dataset1_admin
```

La autenticación y la autorización son responsabilidades separadas. Autentica al usuario con
otro middleware (como JWT o Basic Auth), y luego proporciona un `userGetter` para que Casbin
pueda autorizar el request.

### Con JWT

```go
e.Use(echojwt.JWT([]byte("secret")))               // JWT middleware does authentication
jwtUser := func(c *echo.Context) (string, error) { // JWT user getter for Casbin authorization
	token, err := echo.ContextGet[*jwt.Token](c, "user")
	if err != nil {
		return "", err
	}
	return token.Claims.GetSubject()
}
e.Use(NewCasbinMiddleware(ce, jwtUser)) // Casbin does authorization
```

Pruébalo con:

```bash
curl -v "http://localhost:8080/dataset1/any" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
```

### Con Basic Auth

```go
// BasicAuth middleware does authentication
e.Use(middleware.BasicAuth(func(c *echo.Context, user, password string) (bool, error) {
	return subtle.ConstantTimeCompare([]byte(user), []byte("alice")) == 1 &&
		subtle.ConstantTimeCompare([]byte(password), []byte("password")) == 1, nil
}))
basicAuthUser := func(c *echo.Context) (string, error) { // Basic auth user getter for Casbin authorization
	username, _, _ := c.Request().BasicAuth() // password is verified by the BasicAuth middleware above
	return username, nil
}
e.Use(NewCasbinMiddleware(ce, basicAuthUser)) // Casbin does authorization
```

Pruébalo con:

```bash
# should pass
curl -v -u "alice:password" http://localhost:8080/dataset1/any
# should fail
curl -v -u "alice:password" http://localhost:8080/dataset2/resource2
```

### Ejemplo completo de Casbin + JWT

```go
package main

import (
	"log/slog"
	"net/http"

	"github.com/casbin/casbin/v3"
	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v5"
	"github.com/labstack/echo/v5"
)

// NewCasbinMiddleware returns middleware for Casbin (https://casbin.org/).
func NewCasbinMiddleware(enforcer *casbin.Enforcer, userGetter func(*echo.Context) (string, error)) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c *echo.Context) error {
			username, err := userGetter(c)
			if err != nil {
				return echo.ErrUnauthorized.Wrap(err)
			}
			if pass, err := enforcer.Enforce(username, c.Request().URL.Path, c.Request().Method); err != nil {
				return echo.ErrInternalServerError.Wrap(err)
			} else if !pass {
				return echo.NewHTTPError(http.StatusForbidden, "access denied")
			}
			return next(c)
		}
	}
}

func main() {
	e := echo.New()

	ce, err := casbin.NewEnforcer("auth_model.conf", "auth_policy.csv")
	if err != nil {
		slog.Error("failed to initialize Casbin enforcer", "error", err)
	}

	e.Use(echojwt.JWT([]byte("secret")))               // JWT middleware does authentication
	jwtUser := func(c *echo.Context) (string, error) { // JWT user getter for Casbin authorization
		token, err := echo.ContextGet[*jwt.Token](c, "user")
		if err != nil {
			return "", err
		}
		return token.Claims.GetSubject()
	}
	e.Use(NewCasbinMiddleware(ce, jwtUser)) // Casbin does authorization

	e.GET("/*", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	if err := e.Start(":8080"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
