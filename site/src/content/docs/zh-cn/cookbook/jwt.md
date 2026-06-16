---
title: JWT
description: 使用 echo-jwt 中间件通过 JSON Web Tokens 认证请求。
sidebar:
  order: 11
---

此示例演示如何使用 [`echo-jwt`](https://github.com/labstack/echo-jwt) 中间件在 Echo 中进行
JWT 认证：

- 使用 HS256 算法进行 JWT 认证。
- 从 `Authorization` 请求 header 读取 token。

完整配置选项请参见 [JWT 中间件](/zh-cn/middleware/jwt/)页面。

## 服务器

### 使用自定义 claims

定义一个嵌入 `jwt.RegisteredClaims` 的 claims 类型，然后通过 `NewClaimsFunc` 将中间件指向它。
在受限处理函数中，使用泛型 `echo.ContextGet` 从上下文获取已解析的 token。

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

// jwtCustomClaims are custom claims extending default ones.
// See https://github.com/golang-jwt/jwt for more examples
type jwtCustomClaims struct {
	Name  string `json:"name"`
	Admin bool   `json:"admin"`
	jwt.RegisteredClaims
}

func login(c *echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	// Demo only: hard-coded credentials compared in plain text. In production,
	// look up the user and verify a hashed password with a constant-time compare
	// (e.g. golang.org/x/crypto/bcrypt's CompareHashAndPassword) to avoid timing attacks.
	if username != "jon" || password != "shhh!" {
		return echo.ErrUnauthorized
	}

	// Set custom claims
	claims := &jwtCustomClaims{
		"Jon Snow",
		true,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": t,
	})
}

func accessible(c *echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c *echo.Context) error {
	token, err := echo.ContextGet[*jwt.Token](c, "user")
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}
	claims := token.Claims.(*jwtCustomClaims)
	name := claims.Name
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// Login route
	e.POST("/login", login)

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")

	// Configure middleware with the custom claims type
	config := echojwt.Config{
		NewClaimsFunc: func(c *echo.Context) jwt.Claims {
			return new(jwtCustomClaims)
		},
		SigningKey: []byte("secret"),
	}
	r.Use(echojwt.WithConfig(config))
	r.GET("", restricted)

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### 使用用户定义的 KeyFunc

当 token 由外部身份提供商签名时，请提供一个 `KeyFunc` 来动态解析签名 key。
此示例通过获取 Google 公钥集来验证 Google Sign-In 签发的 token。

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	echojwt "github.com/labstack/echo-jwt/v5"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/lestrrat-go/jwx/v3/jwk"
)

func getKey(token *jwt.Token) (any, error) {

	// For a demonstration purpose, Google Sign-in is used.
	// https://developers.google.com/identity/sign-in/web/backend-auth
	//
	// This user-defined KeyFunc verifies tokens issued by Google Sign-In.
	//
	// Note: In this example, it downloads the keyset every time the restricted route is accessed.
	keySet, err := jwk.Fetch(context.Background(), "https://www.googleapis.com/oauth2/v3/certs")
	if err != nil {
		return nil, err
	}

	keyID, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("expecting JWT header to have a key ID in the kid field")
	}

	key, found := keySet.LookupKeyID(keyID)

	if !found {
		return nil, fmt.Errorf("unable to find key %q", keyID)
	}

	return key.PublicKey()
}

func accessible(c *echo.Context) error {
	return c.String(http.StatusOK, "Accessible")
}

func restricted(c *echo.Context) error {
	user, err := echo.ContextGet[*jwt.Token](c, "user")
	if err != nil {
		return echo.ErrUnauthorized.Wrap(err)
	}
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.String(http.StatusOK, "Welcome "+name+"!")
}

func main() {
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	// Unauthenticated route
	e.GET("/", accessible)

	// Restricted group
	r := e.Group("/restricted")
	{
		config := echojwt.Config{
			KeyFunc: getKey,
		}
		r.Use(echojwt.WithConfig(config))
		r.GET("", restricted)
	}

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

:::caution
如上所示，在每个请求上获取 key set 仅用于演示。在生产环境中，请缓存 key set 并定期刷新。
:::

## 客户端

### 登录

使用用户名和密码登录以获取 token。

```sh
curl -X POST -d 'username=jon' -d 'password=shhh!' localhost:1323/login
```

响应：

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"
}
```

### 请求

使用 `Authorization` 请求 header 中的 token 请求受限资源。

```sh
curl localhost:1323/restricted -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjE5NTcxMzZ9.RB3arc4-OyzASAaUhC2W3ReWaXAt_z2Fd3BN4aWTgEY"
```

响应：

```sh
Welcome Jon Snow!
```
