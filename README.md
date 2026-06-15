# echox

Source for the [Echo](https://github.com/labstack/echo) documentation site —
published at **[echo.labstack.com](https://echo.labstack.com)** — together with
the runnable cookbook recipes the docs reference.

## Layout

| Path        | What it is                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------- |
| `site/`     | The docs site — [Astro](https://astro.build) + [Starlight](https://starlight.astro.build). Content lives in `site/src/content/docs/`. |
| `cookbook/` | Standalone, runnable Go example apps referenced from the docs.                                       |
| `docs/`     | Internal design specs.                                                                               |

## Documentation site

Requires [Node.js](https://nodejs.org) (LTS).

```bash
cd site
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # production build to site/dist
npm run preview  # preview the production build
```

Content is Markdown/MDX under `site/src/content/docs/` (`guide/`, `middleware/`,
`cookbook/`). To add a page, drop a file in the right folder — the sidebar is
generated from each page's `sidebar.order` frontmatter. Every page needs a
`title` and `description`.

## Cookbook recipes

Each folder under `cookbook/` is a self-contained example. Run one with:

```bash
cd cookbook/hello-world
go run .
```

## Deployment

The site auto-deploys to GitHub Pages on every push to `master` (and once daily,
to refresh build-time data such as the GitHub star count) via
[`.github/workflows/deploy.yaml`](.github/workflows/deploy.yaml). Dependencies
are installed with `npm ci --ignore-scripts` and pinned via the committed
lockfile.

## License

[MIT](LICENSE)
