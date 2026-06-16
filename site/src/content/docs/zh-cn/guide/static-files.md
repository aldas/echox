---
title: 提供静态文件
description: 使用 Echo 提供图片、JavaScript、CSS、字体和其他资源。
sidebar:
  order: 9
---

Echo 可以从文件系统或嵌入式文件系统提供图片、JavaScript、CSS、PDF、字体等静态资源。

## 默认文件系统

Echo 使用 `os.DirFS(".")` 作为默认文件系统，其根目录是当前工作目录。
要更改它，请设置 `Echo#Filesystem` 字段：

```go
e := echo.New()
e.Filesystem = os.DirFS("assets")
```

## 使用 Static 中间件

参见 [Static 中间件](/zh-cn/middleware/static/)。

## 使用 Echo#Static()

`Echo#Static(prefix, root string)` 会注册一条路由，从给定根目录按路径前缀提供静态文件。

从 `assets` 下通过 `/static/*` 提供任意文件。对 `/static/js/main.js` 的请求会提供
`assets/js/main.js`：

```go
e := echo.New()
e.Static("/static", "assets")
```

从 `assets` 下通过 `/*` 提供任意文件。对 `/js/main.js` 的请求会提供
`assets/js/main.js`：

```go
e := echo.New()
e.Static("/", "assets")
```

## 使用 Echo#StaticFS()

静态文件可以从任何 `fs.FS` 提供，包括 `embed.FS`。使用 `echo.MustSubFS`，
使提供的文件以正确子目录为根；`embed.FS` 会把其子目录作为自己的条目包含进来。

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

## 使用 Echo#File()

`Echo#File(path, file string)` 会注册一条路由，用于提供单个静态文件。

从 `public/index.html` 提供索引页：

```go
e.File("/", "public/index.html")
```

从 `app/assets/favicon.ico` 提供 favicon：

```go
e := echo.New()
e.Filesystem = os.DirFS("/")
e.File("/favicon.ico", "app/assets/favicon.ico") // The file path must not have a leading slash.
```

:::caution
文件路径中前导 `/` 不适用于大多数 `fs.FS` 实现。请使用相对路径。
:::
