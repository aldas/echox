---
title: Request Logger
description: Logging de requests totalmente customizável que se integra a bibliotecas de logging estruturado.
sidebar:
  order: 12
---

O middleware `RequestLogger` registra informações sobre cada request HTTP. Ele permite customizar
totalmente o que é registrado e como, tornando-o adequado para uso com bibliotecas de terceiros
(logging estruturado).

Os valores que o logger pode extrair são controlados pelos campos booleanos e slices de
`RequestLoggerConfig`. Habilite um campo (por exemplo `LogStatus: true`) para ter seu valor
preenchido em `RequestLoggerValues`, que é passado para seu `LogValuesFunc`.

```go
type RequestLoggerConfig struct {
	// Skipper defines a function to skip middleware.
	Skipper Skipper

	// BeforeNextFunc is called before the next middleware or handler in the chain.
	BeforeNextFunc func(c *echo.Context)

	// LogValuesFunc is called with the values extracted by the logger from the
	// request/response.
	// Mandatory.
	LogValuesFunc func(c *echo.Context, v RequestLoggerValues) error

	// HandleError instructs the logger to call the global error handler when the next
	// middleware/handler returns an error. A side effect is that the response is then
	// committed and sent, so middlewares up the chain can no longer change the status
	// code or body.
	HandleError bool

	// LogLatency records the duration of the rest of the handler chain (the next(c) call).
	LogLatency bool
	// LogProtocol extracts the request protocol (for example HTTP/1.1 or HTTP/2).
	LogProtocol bool
	// LogRemoteIP extracts the request remote IP. See echo.Context.RealIP() for details.
	LogRemoteIP bool
	// LogHost extracts the request host value (for example example.com).
	LogHost bool
	// LogMethod extracts the request method (for example GET).
	LogMethod bool
	// LogURI extracts the request URI (for example /list?lang=en&page=1).
	LogURI bool
	// LogURIPath extracts the request URI path part (for example /list).
	LogURIPath bool
	// LogRoutePath extracts the route path the request matched (for example /user/:id).
	LogRoutePath bool
	// LogRequestID extracts the request ID from the X-Request-ID request header, or the
	// response if the request did not have a value.
	LogRequestID bool
	// LogReferer extracts the request referer value.
	LogReferer bool
	// LogUserAgent extracts the request user agent value.
	LogUserAgent bool
	// LogStatus extracts the response status code. If the chain returns an echo.HTTPError,
	// the status code is taken from it.
	LogStatus bool
	// LogError extracts the error returned from the handler chain.
	LogError bool
	// LogContentLength extracts the Content-Length header value. Note: this can differ
	// from the actual request body size as it may be spoofed.
	LogContentLength bool
	// LogResponseSize extracts the response content length. Note: when used with Gzip
	// middleware this value may not always be correct.
	LogResponseSize bool
	// LogHeaders extracts the given list of request headers. A slice of values is logged
	// per header since a request can contain more than one. Names are canonicalized with
	// http.CanonicalHeaderKey (for example "accept-encoding" becomes "Accept-Encoding").
	LogHeaders []string
	// LogQueryParams extracts the given list of query parameters from the request URI. A
	// slice of values is logged per name since a request can repeat a parameter.
	LogQueryParams []string
	// LogFormValues extracts the given list of form values from the request body and URI.
	// A slice of values is logged per name since a request can repeat a value.
	LogFormValues []string
}
```

Todo o middleware principal fica no pacote `middleware`:

```go
import "github.com/labstack/echo/v5/middleware"
```

## Exemplos

### fmt.Printf

```go
skipper := func(c *echo.Context) bool {
	// Skip the health check endpoint.
	return c.Request().URL.Path == "/health"
}
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogStatus: true,
	LogURI:    true,
	Skipper:   skipper,
	BeforeNextFunc: func(c *echo.Context) {
		c.Set("customValueFromContext", 42)
	},
	LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
		value, _ := c.Get("customValueFromContext").(int)
		fmt.Printf("REQUEST: uri: %v, status: %v, custom-value: %v\n", v.URI, v.Status, value)
		return nil
	},
}))
```

Saída de exemplo:

```text
REQUEST: uri: /hello, status: 200, custom-value: 42
```

### slog ([log/slog](https://pkg.go.dev/log/slog))

```go
logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogStatus:   true,
	LogURI:      true,
	LogError:    true,
	HandleError: true, // forwards the error to the global error handler so it can pick the status code
	LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
		if v.Error == nil {
			logger.LogAttrs(context.Background(), slog.LevelInfo, "REQUEST",
				slog.String("uri", v.URI),
				slog.Int("status", v.Status),
			)
		} else {
			logger.LogAttrs(context.Background(), slog.LevelError, "REQUEST_ERROR",
				slog.String("uri", v.URI),
				slog.Int("status", v.Status),
				slog.String("err", v.Error.Error()),
			)
		}
		return nil
	},
}))
```

Saída de exemplo:

```text
{"time":"2024-12-30T20:55:46.2399999+08:00","level":"INFO","msg":"REQUEST","uri":"/hello","status":200}
```

### Zerolog ([rs/zerolog](https://github.com/rs/zerolog))

```go
logger := zerolog.New(os.Stdout)
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
		logger.Info().
			Str("URI", v.URI).
			Int("status", v.Status).
			Msg("request")
		return nil
	},
}))
```

Saída de exemplo:

```text
{"level":"info","URI":"/hello","status":200,"message":"request"}
```

### Zap ([uber-go/zap](https://github.com/uber-go/zap))

```go
logger, _ := zap.NewProduction()
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c *echo.Context, v middleware.RequestLoggerValues) error {
		logger.Info("request",
			zap.String("URI", v.URI),
			zap.Int("status", v.Status),
		)
		return nil
	},
}))
```

Saída de exemplo:

```text
{"level":"info","ts":1735564026.3197417,"caller":"cmd/main.go:20","msg":"request","URI":"/hello","status":200}
```

### Logrus ([sirupsen/logrus](https://github.com/sirupsen/logrus))

```go
log := logrus.New()
e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogURI:    true,
	LogStatus: true,
	LogValuesFunc: func(c *echo.Context, values middleware.RequestLoggerValues) error {
		log.WithFields(logrus.Fields{
			"URI":    values.URI,
			"status": values.Status,
		}).Info("request")
		return nil
	},
}))
```

Saída de exemplo:

```text
time="2024-12-30T21:08:49+08:00" level=info msg=request URI=/hello status=200
```

## Solução de problemas

### panic: missing LogValuesFunc callback function for request logger middleware

Esse panic ocorre quando o callback obrigatório `LogValuesFunc` não é definido. Defina uma
função compatível com a assinatura `LogValuesFunc` e atribua-a na configuração:

```go
func logValues(c *echo.Context, v middleware.RequestLoggerValues) error {
	fmt.Printf("Request Method: %s, URI: %s\n", v.Method, v.URI)
	return nil
}

e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
	LogValuesFunc: logValues,
}))
```

### Parâmetros nos logs estão vazios

Se valores como `v.URI` e `v.Status` estiverem vazios dentro de `LogValuesFunc`, verifique se as
flags de extração correspondentes (`LogStatus`, `LogURI` e assim por diante) estão definidas como `true` na
configuração. Cada valor só é preenchido quando sua flag está habilitada.
