---
title: Server-Sent Events (SSE)
description: Transmite server-sent events desde un handler Echo, por conexión o como broadcast a muchos clientes.
sidebar:
  order: 14
---

[Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format)
se pueden usar de varias formas. El primer ejemplo de abajo es SSE por conexión y por handler.
Para lógica de broadcast más compleja, consulta el segundo ejemplo usando
[r3labs/sse](https://github.com/r3labs/sse).

:::caution
Las conexiones SSE son de larga duración, por lo que debe deshabilitarse el write timeout del servidor.
Ambos ejemplos establecen `s.WriteTimeout = 0` mediante `BeforeServeFunc`.
:::

## Usar SSE

### Servidor

El handler escribe los headers SSE y luego emite un evento cada segundo hasta que el cliente
se desconecta. `http.NewResponseController(w).Flush()` empuja cada evento al cliente de inmediato.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())
	e.File("/", "./index.html")

	e.GET("/sse", func(c *echo.Context) error {
		log.Printf("SSE client connected, ip: %v", c.RealIP())

		w := c.Response()
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		count := uint64(0)
		for {
			select {
			case <-c.Request().Context().Done():
				log.Printf("SSE client disconnected, ip: %v", c.RealIP())
				return nil
			case <-ticker.C:
				count++
				event := Event{
					Data: []byte(fmt.Sprintf("count: %d, time: %s\n\n", count, time.Now().Format(time.RFC3339Nano))),
				}
				if err := event.MarshalTo(w); err != nil {
					return err
				}
				if err := http.NewResponseController(w).Flush(); err != nil {
					return err
				}
			}
		}
	})

	sc := echo.StartConfig{
		Address: ":8080",
		BeforeServeFunc: func(s *http.Server) error {
			s.WriteTimeout = 0 // IMPORTANT: disable for SSE
			return nil
		},
	}
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM) // start shutdown process on ctrl+c
	defer cancel()

	if err := sc.Start(ctx, e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### Estructura Event y método Marshal

```go
package main

import (
	"bytes"
	"fmt"
	"io"
)

// Event represents Server-Sent Event.
// SSE explanation: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
type Event struct {
	// ID is used to set the EventSource object's last event ID value.
	ID []byte
	// Data field is for the message. When the EventSource receives multiple consecutive lines
	// that begin with data:, it concatenates them, inserting a newline character between each one.
	// Trailing newlines are removed.
	Data []byte
	// Event is a string identifying the type of event described. If this is specified, an event
	// will be dispatched on the browser to the listener for the specified event name; the website
	// source code should use addEventListener() to listen for named events. The onmessage handler
	// is called if no event name is specified for a message.
	Event []byte
	// Retry is the reconnection time. If the connection to the server is lost, the browser will
	// wait for the specified time before attempting to reconnect. This must be an integer, specifying
	// the reconnection time in milliseconds. If a non-integer value is specified, the field is ignored.
	Retry []byte
	// Comment line can be used to prevent connections from timing out; a server can send a comment
	// periodically to keep the connection alive.
	Comment []byte
}

// MarshalTo marshals Event to given Writer
func (ev *Event) MarshalTo(w io.Writer) error {
	// Marshalling part is taken from: https://github.com/r3labs/sse/blob/c6d5381ee3ca63828b321c16baa008fd6c0b4564/http.go#L16
	if len(ev.Data) == 0 && len(ev.Comment) == 0 {
		return nil
	}

	if len(ev.Data) > 0 {
		if _, err := fmt.Fprintf(w, "id: %s\n", ev.ID); err != nil {
			return err
		}

		sd := bytes.Split(ev.Data, []byte("\n"))
		for i := range sd {
			if _, err := fmt.Fprintf(w, "data: %s\n", sd[i]); err != nil {
				return err
			}
		}

		if len(ev.Event) > 0 {
			if _, err := fmt.Fprintf(w, "event: %s\n", ev.Event); err != nil {
				return err
			}
		}

		if len(ev.Retry) > 0 {
			if _, err := fmt.Fprintf(w, "retry: %s\n", ev.Retry); err != nil {
				return err
			}
		}
	}

	if len(ev.Comment) > 0 {
		if _, err := fmt.Fprintf(w, ": %s\n", ev.Comment); err != nil {
			return err
		}
	}

	if _, err := fmt.Fprint(w, "\n"); err != nil {
		return err
	}

	return nil
}
```

### HTML que sirve SSE

```html
<!DOCTYPE html>
<html>
<body>

<h1>Getting server-sent updates</h1>
<div id="result"></div>

<script>
    // Example taken from: https://www.w3schools.com/html/html5_serversentevents.asp
    if (typeof (EventSource) !== "undefined") {
        const source = new EventSource("/sse");
        source.onmessage = function (event) {
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
    }
</script>

</body>
</html>
```

## Broadcast con r3labs/sse

Cuando necesitas hacer broadcast de un único stream de eventos a muchos suscriptores, la
biblioteca [r3labs/sse](https://github.com/r3labs/sse) maneja por ti la gestión de streams
y suscriptores.

### Servidor

```go
package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/r3labs/sse/v2"
)

func main() {
	e := echo.New()

	server := sse.New()             // create SSE broadcaster server
	server.AutoReplay = false       // do not replay messages for each new subscriber that connects
	_ = server.CreateStream("time") // EventSource in "index.html" connecting to stream named "time"

	go func(s *sse.Server) {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				s.Publish("time", &sse.Event{
					Data: []byte("time: " + time.Now().Format(time.RFC3339Nano)),
				})
			}
		}
	}(server)

	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())
	e.File("/", "./index.html")

	//e.GET("/sse", echo.WrapHandler(server))

	e.GET("/sse", func(c *echo.Context) error { // longer variant with disconnect logic
		e.Logger.Info("New client connected", "ip", c.RealIP())
		go func() {
			<-c.Request().Context().Done() // Received Browser Disconnection
			e.Logger.Info("Client disconnected", "ip", c.RealIP())
		}()

		server.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	sc := echo.StartConfig{
		Address: ":8080",
		BeforeServeFunc: func(s *http.Server) error {
			s.WriteTimeout = 0 // IMPORTANT: disable for SSE
			return nil
		},
	}
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM) // start shutdown process on ctrl+c
	defer cancel()

	if err := sc.Start(ctx, e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

### HTML que sirve SSE

```html
<!DOCTYPE html>
<html>
<body>

<h1>Getting server-sent updates</h1>
<div id="result"></div>

<script>
    // Example taken from: https://www.w3schools.com/html/html5_serversentevents.asp
    if (typeof (EventSource) !== "undefined") {
        const source = new EventSource("/sse?stream=time");
        source.onmessage = function (event) {
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
    }
</script>

</body>
</html>
```
