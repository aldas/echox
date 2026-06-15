---
title: Serving Static Files
description: Serve images, JavaScript, CSS, fonts, and other assets with Echo.
sidebar:
  order: 9
---

Echo can serve static assets such as images, JavaScript, CSS, PDFs, and fonts from
the filesystem or an embedded filesystem.

## Default filesystem

Echo uses `os.DirFS(".")` as its default filesystem, rooted at the current working
directory. To change it, set the `Echo#Filesystem` field:

```go
e := echo.New()
e.Filesystem = os.DirFS("assets")
```

## Using the Static middleware

See [Static middleware](/middleware/static/).

## Using Echo#Static()

`Echo#Static(prefix, root string)` registers a route that serves static files under
a path prefix from the given root directory.

Serve any file from `assets` under `/static/*`. A request to `/static/js/main.js`
serves `assets/js/main.js`:

```go
e := echo.New()
e.Static("/static", "assets")
```

Serve any file from `assets` under `/*`. A request to `/js/main.js` serves
`assets/js/main.js`:

```go
e := echo.New()
e.Static("/", "assets")
```

## Using Echo#StaticFS()

Static files can be served from any `fs.FS`, including an `embed.FS`. Use
`echo.MustSubFS` so the served files are rooted at the correct subdirectory — an
`embed.FS` includes its subdirectories as their own entries.

```go
//go:embed "assets/images"
var images embed.FS

func main() {
	e := echo.New()

	e.StaticFS("/images", echo.MustSubFS(images, "assets/images"))

	sc := echo.StartConfig{Address: ":1323"}
	if err := sc.Start(context.Background(), e); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
```

## Using Echo#File()

`Echo#File(path, file string)` registers a route that serves a single static file.

Serve an index page from `public/index.html`:

```go
e.File("/", "public/index.html")
```

Serve a favicon from `app/assets/favicon.ico`:

```go
e := echo.New()
e.Filesystem = os.DirFS("/")
e.File("/favicon.ico", "app/assets/favicon.ico") // The file path must not have a leading slash.
```

:::caution
A leading `/` in the file path does not work with most `fs.FS` implementations. Use
a relative path.
:::
