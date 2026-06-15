---
title: HTTP/2 Server
description: Serve traffic over HTTP/2 by starting Echo with a TLS certificate.
sidebar:
  order: 9
---

HTTP/2 improves latency through request multiplexing, header compression, and
server push. Go's HTTP server negotiates HTTP/2 automatically over TLS, so serving
HTTP/2 with Echo is a matter of starting the server with a certificate.

## 1. Generate a self-signed X.509 TLS certificate

Run the following command to generate `cert.pem` and `key.pem`:

```sh
go run $GOROOT/src/crypto/tls/generate_cert.go --host localhost
```

:::note
For demonstration purposes we use a self-signed certificate. In production, obtain
a certificate from a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority).
:::

## 2. Create a handler that echoes request information

```go
e.GET("/request", func(c *echo.Context) error {
	req := c.Request()
	format := `
		<code>
			Protocol: %s<br>
			Host: %s<br>
			Remote Address: %s<br>
			Method: %s<br>
			Path: %s<br>
		</code>
	`
	return c.HTML(http.StatusOK, fmt.Sprintf(format, req.Proto, req.Host, req.RemoteAddr, req.Method, req.URL.Path))
})
```

## 3. Start the TLS server

Start the server with the generated certificate and key:

```go
sc := echo.StartConfig{Address: ":1323"}
if err := sc.StartTLS(context.Background(), e, "cert.pem", "key.pem"); err != nil {
	e.Logger.Error("failed to start server", "error", err)
}
```

Alternatively, use a custom `http.Server` with your own `tls.Config`:

```go
s := http.Server{
  Addr:    ":8443",
  Handler: e, // set Echo as handler
  TLSConfig: &tls.Config{
    //Certificates: nil, // <-- s.ListenAndServeTLS will populate this field
  },
  //ReadTimeout: 30 * time.Second, // use custom timeouts
}
if err := s.ListenAndServeTLS("cert.pem", "key.pem"); err != http.ErrServerClosed {
  log.Fatal(err)
}
```

## 4. Verify

Start the server and browse to `https://localhost:1323/request`. You should see
output similar to:

```sh
Protocol: HTTP/2.0
Host: localhost:1323
Remote Address: [::1]:60288
Method: GET
Path: /
```

## Source code

```go
package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
)

func main() {
	e := echo.New()
	e.GET("/request", func(c *echo.Context) error {
		req := c.Request()
		format := `
			<code>
				Protocol: %s<br>
				Host: %s<br>
				Remote Address: %s<br>
				Method: %s<br>
				Path: %s<br>
			</code>
		`
		return c.HTML(http.StatusOK, fmt.Sprintf(format, req.Proto, req.Host, req.RemoteAddr, req.Method, req.URL.Path))
	})
	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.StartTLS(context.Background(), e, "cert.pem", "key.pem"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```
