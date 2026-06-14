# Echo Docs — from-scratch rebuild (Astro, "Terminal" design)

**Date:** 2026-06-14
**Status:** Design — awaiting review
**Repo:** `labstack/echox` (the docs site lives in `website/`)

## 1. Goal

Replace the current Docusaurus docs site with a custom-built, professional docs
platform that matches the quality and feel of `docs.openclaw.ai`, branded for Echo.
The look kept reading as "default/amateur" because it used generic system-sans on a
cool palette; the new design commits to a **monospace, terminal-precise** aesthetic.

## 2. Locked decisions

| Decision | Choice | Why |
|---|---|---|
| Build approach | **Astro** (custom, no docs preset) | Total design control like a hand-build, but routing / MDX / i18n / fast builds / image+font optimization come free; stays free & self-hosted. |
| Design direction | **"Terminal"** | Chosen from 3 directions. Closest to OpenClaw, most "Go developer". |
| Body font | **Fragment Mono** (Google) | Exact font OpenClaw declares; the defining trait. |
| Heading font | **DM Sans** 700/800 | Heavy sans against mono body = OpenClaw's contrast. |
| Palette | Warm near-black `#0d0b0b`, warm grays, **Echo cyan `#00AFD1`→`#4AE1FF`** | Cyan pulled from the Echo logo; warm dark from OpenClaw. |
| Theme | **Dark-first**, light theme also shipped | Matches the chosen aesthetic; light is a polished secondary. |
| Content | **Rewritten fresh** | User chose a clean-slate content pass (new IA + new prose), not a Docusaurus auto-port. |
| Coverage goal | **Full** (all guide/cookbook/middleware/API topics) | Sequenced in phases (§8). |

## 3. Must-have features

1. **Versioning** — separate docs trees for **v4** and **v5** with a version switcher.
2. **i18n** — locale routing + language switcher (en first; zh-Hans/ja/es/fr scaffolded).
3. **Full-text search** — **Pagefind** (static, free, self-hosted; indexes the built site).
4. **Ask Echo (AI)** — ⌘K command palette with streamed answers + cited sources. UI ships
   now; wired to a provider (**kapa.ai** OSS tier or self-hosted Inkeep) via a single
   integration point — answers are stubbed until a key is supplied.

## 4. Architecture (Astro)

```
website/                      # Astro project (replaces Docusaurus)
  astro.config.mjs            # integrations: mdx, sitemap, pagefind; i18n routing
  src/
    content/
      config.ts               # content collections schema (docs)
      docs/<version>/<locale>/...   # MDX content, e.g. docs/v5/en/core/routing.mdx
    components/
      Nav.astro  Sidebar.astro  Toc.astro  DocActions.astro
      CodeBlock.astro  Callout.astro  Card.astro  VersionSwitcher.astro
      LocaleSwitcher.astro  AskEcho.tsx  Search.astro  Hero.astro
    layouts/
      Base.astro              # <head>, fonts, theme bootstrap, nav, footer
      DocLayout.astro         # sidebar + content + toc + doc actions
    pages/
      index.astro             # homepage (hero + features)
      [...slug].astro         # docs routes from the content collection
    styles/
      tokens.css              # design tokens (the design system)
      global.css
  public/                     # logo, favicon, og image
```

**Design-for-isolation:** each component has one purpose and a clear prop interface —
`Sidebar` (nav tree in → highlighted list out), `Toc` (headings in → list out),
`AskEcho` (self-contained island), `CodeBlock` (lang + code in → highlighted out). The
content collection is the single source of truth; layouts compose components; pages are
thin. Versioning and i18n are expressed in the content path (`docs/<version>/<locale>/…`)
and resolved by `[...slug].astro`, so no component needs to know about them internally.

## 5. Design system (`tokens.css`)

- **Type:** `--font-body: "Fragment Mono", ui-monospace, …`; `--font-head: "DM Sans", …`;
  base 13.5–14px, line-height 1.7; headings 700/800, tracking −0.02em.
- **Color (dark):** bg `#0d0b0b`, surface `#151210`, line `#221e1c`/`#2d2724`,
  text `#aaa19d`, heading `#f4f1ef`, muted `#817a76`, accent `#00afd1`/`#4ae1ff`,
  accent-soft `rgba(0,175,209,.12)`.
- **Color (light):** warm paper `#faf8f7`, ink `#1a1614`, accent darkened cyan for contrast.
- **Radius** 9–13px; hairline 1px borders; single soft cyan glow top-right; faint grain.
- **Code:** `#0a0908` bg, cyan keywords, warm strings, muted comments (Shiki theme tuned to match).

## 6. Information architecture

- **Top nav:** logo + `v5` version pill, primary links (Guide, Cookbook, Middleware, API),
  prominent **Search ⌘K**, locale switcher, GitHub.
- **Sidebar:** sectioned (Getting Started / Core / Guides / …), mono uppercase captions,
  cyan active pill with left bar.
- **Doc page:** breadcrumb → H1 → **DocActions** (Ask Echo / Copy / ChatGPT / Claude) →
  content (MDX) → right-hand **On this page** TOC. Floating **Ask Echo ⌘K** launcher.
- **Homepage:** split hero (headline + CTAs + `go get` line beside a code terminal window),
  stat strip, "Why Echo" feature grid, footer. Hero = **split-with-code** variant; feature
  icons = **Phosphor** (consistency). (Both adjustable.)

## 7. Feature design detail

- **Versioning:** content keyed by version dir; default version = latest (v5). Version
  switcher rewrites the path to the same page in the other version (fallback to that
  version's index if the page doesn't exist). v4 is LTS until 2026-12-31.
- **i18n:** Astro i18n routing; locale dir under each version; `LocaleSwitcher` swaps the
  locale segment; untranslated pages fall back to `en`.
- **Search:** Pagefind runs as a post-build step over `dist/`; `Search.astro` mounts the
  Pagefind UI behind the ⌘K shortcut (separate from Ask Echo, or unified — see open Qs).
- **Ask Echo:** `AskEcho.tsx` island; ⌘K + floating launcher; streamed answer + sources.
  Integration point: `askProvider(query) -> stream` — swap the stub for kapa.ai/Inkeep
  with one function + an API key. Answers honor the active locale.

## 8. Implementation phasing (within the full-coverage goal)

- **Phase 1 — Platform + design system + slice.** Astro scaffold, `tokens.css`, Base/Doc
  layouts, Nav/Sidebar/Toc/DocActions/CodeBlock/Callout/Card, homepage, and a
  representative content slice (Quickstart, Routing w/ code, one nested page). Dark+light.
  *This is the first implementation plan.*
- **Phase 2 — Content.** Author the full docs set fresh (Guide, Core, Cookbook,
  Middleware, API) as MDX in the collection.
- **Phase 3 — Features.** Versioning (v4/v5), i18n locales, Pagefind search, Ask Echo
  provider wiring, deploy pipeline (GitHub/Cloudflare Pages), redirects from old URLs.

## 9. Out of scope (now)

- Live AI backend account/keys (UI + integration point only).
- Full translations (locale scaffolding only; en authored).
- Marketing pages beyond the homepage.

## 10. Risks / notes

- **Content rewrite is the largest cost** — it's a writing effort independent of the
  platform; Phase 2 may itself need decomposition by section.
- Old URL structure must be preserved via redirects (Docusaurus had `/guide`, `/cookbook`,
  `/middleware` aliases) to avoid breaking inbound links and SEO.
- `onBrokenLinks`-style checking must be re-established in the Astro build.

## 11. Open questions (with my recommended default)

1. Search & Ask Echo — **recommend: one ⌘K** with tabs (Search | Ask Echo); single,
   familiar entry point. Alt: two separate launchers.
2. Versioning at launch — **recommend: v5-only first**, add v4 in Phase 3 (don't block the
   rebuild on porting v4 content). Alt: both from day one.
3. Deploy target — **recommend: Cloudflare Pages** (fast, Pagefind-friendly) with redirects
   from the old paths. Alt: stay on GitHub Pages.

Defaults above are assumed unless you say otherwise.
