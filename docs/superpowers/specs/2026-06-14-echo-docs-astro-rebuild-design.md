# Echo Docs — rebuild on Astro Starlight ("Terminal" theme)

**Date:** 2026-06-14 (rev. 2 — post-review)
**Status:** Design — hardened after architecture + docs-platform review
**Repo:** `labstack/echox` (docs site in `website/`), branch `docs-astro-rebuild`

## 1. Goal

Replace the current Docusaurus docs with a professional, `docs.openclaw.ai`-grade site
branded for Echo. The previous attempts read as "default/amateur" because of generic
system-sans on a cool palette; the new design commits to a **terminal-precise** aesthetic.

## 2. Locked decisions (rev. 2)

| Decision | Choice | Notes |
|---|---|---|
| Platform | **Astro Starlight** (base) + custom Terminal theme | *Changed from full-custom Astro after review.* Starlight gives sidebar, i18n+fallback, Pagefind search, prev/next, TOC, edit links, last-updated, per-page SEO/OG, sitemap, 404, theme toggle, mobile drawer, a11y baseline — we override the theme for the look. Far less to build/own. |
| Design direction | **Terminal** | Locked via mockups (`refine-terminal.html`, `home.html`). |
| Fonts | **DM Sans** for prose & headings · **Fragment Mono** for code + UI chrome (nav, sidebar, labels, ⌘K) | *Changed from mono-everywhere* for long-form readability; terminal feel kept in chrome/code. |
| Palette | warm near-black `#0d0b0b`, warm grays, **Echo cyan** | Cyan from logo; **contrast-tuned** (see §6). |
| Theme | dark-first + light | Starlight toggle; dark default. |
| Content | rewritten fresh, **seeded by porting existing pages** | Avoid blank-page risk on 61 existing pages (review). |
| Launch versioning | **v5 only**; v4 added later via `starlight-versions` | Defers Starlight's one weak area. |
| Search + Ask Echo | **unified ⌘K** with Search (Pagefind) + Ask tabs | Override Starlight `Search` component. |
| Deploy | **Cloudflare Pages** (+ `_redirects`) | Fast, Pagefind-friendly, native 301s. |

## 3. What Starlight gives us vs. what we build

- **Starlight (free):** content collections, sidebar config, prev/next, TOC, Pagefind ⌘K,
  i18n routing + en-fallback, per-page `<title>`/description/canonical/OG/Twitter, sitemap,
  `404`, edit-on-GitHub (`editLink`), `lastUpdated` from git, dark/light toggle + persistence,
  mobile drawer, keyboard-accessible nav.
- **We build/own:**
  1. **Terminal theme** — `src/styles/terminal.css` (Starlight CSS custom props + targeted
     overrides), Shiki theme JSON, font wiring (DM Sans prose / Fragment Mono chrome+code).
  2. **Unified ⌘K** — override `components.Search` with `CommandPalette.tsx` (Pagefind tab + Ask tab).
  3. **Ask Echo** — provider-pluggable island; stub stream now, `askProvider(query, locale)` hook
     for kapa.ai / Inkeep + key later.
  4. **DocActions** — Copy page / Open in ChatGPT / Open in Claude (Edit + Last-updated already from Starlight).
  5. **Homepage** — custom `index.astro` (Starlight `splash` template or standalone): split hero
     + code window + stats + feature grid.
  6. **Redirect map, analytics, contrast/a11y tuning, cutover** (§6, §7).

## 4. Architecture

```
website/
  astro.config.mjs            # starlight() integration: title, logo, social, editLink,
                              #   lastUpdated, sidebar, locales, components overrides, sitemap
  src/
    content/docs/             # MDX content (Starlight collection)
      index.mdx               # homepage (splash) OR pages/index.astro
      <locale>/core/routing.mdx  ...    # en authored first
    components/               # Starlight component overrides
      Search.astro            # mounts CommandPalette island (unified ⌘K)
      CommandPalette.tsx      # island: Search (Pagefind JS API) + Ask Echo tabs
      DocActions.astro        # copy / ChatGPT / Claude toolbar (in PageFrame or content)
    styles/
      terminal.css            # the design system (tokens + overrides)
    shiki/echo-terminal.json  # custom Shiki theme (warm bg, cyan keywords)
  public/
    logo-*.svg  og-*.png  robots.txt  _redirects   # Cloudflare 301 map
```

**Isolation:** the theme is pure CSS over Starlight's documented custom properties → no fork
of Starlight internals; only two component overrides (`Search`, optionally `Head`/`PageFrame`
for DocActions). `CommandPalette.tsx` and `AskEcho` logic are self-contained islands. Content
is the single source of truth; everything else is configuration + theme.

## 5. Design system (`terminal.css`)

- **Fonts:** `--sl-font: "DM Sans", ui-sans-serif, system-ui, sans-serif` (prose+headings);
  `--sl-font-mono: "Fragment Mono", ui-monospace, SFMono-Regular, Menlo, monospace` (code).
  Apply Fragment Mono to UI chrome (`.sidebar`, site nav, `.sl-markdown-content` inline UI,
  labels, ⌘K) via targeted selectors. **Self-host both fonts** (woff2, subset), `font-display:swap`,
  `preload` the prose font (FOUT fix).
- **Color (dark):** bg `#0d0b0b`, surface `#151210`, line `#221e1c`/`#2d2724`, text `#aaa19d`,
  heading `#f4f1ef`, muted `#817a76`. Map to Starlight `--sl-color-*`.
- **Accent (contrast-tuned):** use brighter cyan **`#33c9e6`** for small text/links on dark
  (≥ ~7:1) and reserve `#00afd1`→`#4ae1ff` for fills/large/decorative — fixes the ~5.9:1 issue.
- Light theme: warm paper `#faf8f7`, ink `#1a1614`, darker cyan for AA.
- Radius 9–13px; hairline borders; one soft cyan glow; faint grain (disabled under
  `prefers-reduced-motion`).

## 6. Production / launch requirements (added per review)

- **SEO:** rely on Starlight per-page title/description/canonical/OG; ensure every MDX has
  `title` + `description` frontmatter. Add **JSON-LD** (`TechArticle` + `BreadcrumbList`) and
  `public/robots.txt` → sitemap. Set **v5 as `rel=canonical`** version.
- **Redirects (deliverable):** crawl the live site, produce an explicit **old→new 301 table**
  in `public/_redirects`. Cover the 3 alias families (`/guide`, `/cookbook`, `/middleware`),
  the one-off redirects, and any old slug with no 1:1 new home (resolve each). No silent drops.
- **Analytics:** carry over **GA4 `G-H19TMZLQFN`** (anonymizeIP) via Starlight `head` inject;
  confirm whether to keep or replace.
- **Broken-link gate:** CI step (`lychee`/`astro-broken-link-checker`) that **fails the build**,
  matching the old `onBrokenLinks: throw`.
- **Accessibility:** WCAG-AA contrast audit of every token pair; `:focus-visible` rings;
  `prefers-reduced-motion` disables glow/grain; the ⌘K palette uses an accessible
  combobox pattern (focus trap, `aria-activedescendant`, SR announcements).
- **Responsive:** Starlight handles sidebar/TOC drawers; we ensure the **homepage hero stacks**
  (terminal window below headline) on mobile.
- **i18n realism:** keep non-en locales **behind a flag** until real translations exist; add
  `hreflang` + `x-default` when they ship; Ask Echo answers carry a `locale` param with an
  "answers in English" note where the provider lacks localization.
- **CodeBlock features:** copy button, language label, filename, line-highlighting, and
  tabbed examples (Starlight Expressive-Code or our wrapper).

## 7. Implementation phasing

- **Phase 1 — Platform + theme + slice (first plan).** Starlight scaffold in `website/`
  (replacing Docusaurus), `terminal.css` design system + Shiki theme + self-hosted fonts,
  `Search`→`CommandPalette` override with Ask Echo island (stubbed), `DocActions`, custom
  **homepage**, contrast/a11y tokens, and a real **content slice** (Quickstart, Routing w/ code,
  one nested page). Final `/...` URL/Pagefind/i18n config in place. Dark+light. Shippable to a
  **preview** subdomain.
- **Phase 2 — Content.** Author full v5/en docs (Guide, Core, Cookbook, Middleware, API),
  seeded by porting+editing existing pages. Site is launch-ready at completion.
- **Phase 3 — Versioning + locales + cutover.** `starlight-versions` for v4, enable locales +
  translations, finalize `_redirects`, GA, JSON-LD, broken-link CI, **cutover runbook**
  (preview → verify redirects/SEO/search → domain swap on `echo.labstack.com` → keep old
  Docusaurus deployable ~2 weeks for rollback).

## 8. Out of scope (now)

Live AI provider keys (UI + hook only); real translations (scaffold only); marketing pages
beyond the homepage; v4 content (Phase 3).

## 9. Risks

- **Content rewrite is the largest cost** (61 pages × locales) — Phase 2 may need its own
  decomposition; mitigate by porting existing prose rather than blank-page rewriting.
- **Starlight theming ceiling:** the Terminal look must be achievable via custom props +
  light component overrides; if a surface resists theming, prefer a small component override
  over forking Starlight. (Low risk — the look was already achieved via CSS on Docusaurus.)
- **`starlight-versions` maturity** for v4 in Phase 3 — re-evaluate at that point; v5-only
  launch de-risks it.
