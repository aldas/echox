import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://echo.labstack.com',
  // Preserve every live Docusaurus URL at cutover. The old site served docs under
  // /docs/... (flattened guide pages via slug overrides); Astro generates a static
  // meta-refresh page per entry (works on GitHub Pages — no _redirects needed).
  redirects: {
    '/docs': '/guide/quickstart/',
    '/docs/binding': '/guide/binding/',
    '/docs/category/cookbook': '/cookbook/hello-world/',
    '/docs/category/guide': '/guide/quickstart/',
    '/docs/category/middleware': '/middleware/basic-auth/',
    '/docs/cookbook/auto-tls': '/cookbook/auto-tls/',
    '/docs/cookbook/cors': '/cookbook/cors/',
    '/docs/cookbook/crud': '/cookbook/crud/',
    '/docs/cookbook/embed-resources': '/cookbook/embed-resources/',
    '/docs/cookbook/file-download': '/cookbook/file-download/',
    '/docs/cookbook/file-upload': '/cookbook/file-upload/',
    '/docs/cookbook/graceful-shutdown': '/cookbook/graceful-shutdown/',
    '/docs/cookbook/hello-world': '/cookbook/hello-world/',
    '/docs/cookbook/http2': '/cookbook/http2/',
    '/docs/cookbook/http2-server-push': '/cookbook/http2-server-push/',
    '/docs/cookbook/jsonp': '/cookbook/jsonp/',
    '/docs/cookbook/jwt': '/cookbook/jwt/',
    '/docs/cookbook/load-balancing': '/cookbook/load-balancing/',
    '/docs/cookbook/middleware': '/cookbook/middleware/',
    '/docs/cookbook/reverse-proxy': '/cookbook/reverse-proxy/',
    '/docs/cookbook/sse': '/cookbook/sse/',
    '/docs/cookbook/streaming-response': '/cookbook/streaming-response/',
    '/docs/cookbook/subdomain': '/cookbook/subdomain/',
    '/docs/cookbook/timeout': '/cookbook/timeout/',
    '/docs/cookbook/websocket': '/cookbook/websocket/',
    '/docs/cookies': '/guide/cookies/',
    '/docs/customization': '/guide/customization/',
    '/docs/error-handling': '/guide/error-handling/',
    '/docs/ip-address': '/guide/ip-address/',
    '/docs/middleware/basic-auth': '/middleware/basic-auth/',
    '/docs/middleware/body-dump': '/middleware/body-dump/',
    '/docs/middleware/body-limit': '/middleware/body-limit/',
    '/docs/middleware/casbin-auth': '/middleware/casbin-auth/',
    '/docs/middleware/context-timeout': '/middleware/context-timeout/',
    '/docs/middleware/cors': '/middleware/cors/',
    '/docs/middleware/csrf': '/middleware/csrf/',
    '/docs/middleware/decompress': '/middleware/decompress/',
    '/docs/middleware/gzip': '/middleware/gzip/',
    '/docs/middleware/jwt': '/middleware/jwt/',
    '/docs/middleware/key-auth': '/middleware/key-auth/',
    '/docs/middleware/logger': '/middleware/logger/',
    '/docs/middleware/method-override': '/middleware/method-override/',
    '/docs/middleware/open-telemetry': '/middleware/open-telemetry/',
    '/docs/middleware/prometheus': '/middleware/prometheus/',
    '/docs/middleware/proxy': '/middleware/proxy/',
    '/docs/middleware/rate-limiter': '/middleware/rate-limiter/',
    '/docs/middleware/recover': '/middleware/recover/',
    '/docs/middleware/redirect': '/middleware/redirect/',
    '/docs/middleware/request-id': '/middleware/request-id/',
    '/docs/middleware/rewrite': '/middleware/rewrite/',
    '/docs/middleware/secure': '/middleware/secure/',
    '/docs/middleware/session': '/middleware/session/',
    '/docs/middleware/static': '/middleware/static/',
    '/docs/middleware/trailing-slash': '/middleware/trailing-slash/',
    '/docs/quick-start': '/guide/quickstart/',
    '/docs/request': '/guide/request/',
    '/docs/response': '/guide/response/',
    '/docs/routing': '/guide/routing/',
    '/docs/start-server': '/guide/customization/',
    '/docs/static-files': '/guide/static-files/',
    '/docs/templates': '/guide/templates/',
    '/docs/testing': '/guide/testing/',
    '/search': '/',
  },
  integrations: [
    starlight({
      title: 'Echo',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      customCss: ['./src/styles/terminal.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/labstack/echo' },
      ],
      editLink: {
        baseUrl: 'https://github.com/labstack/echox/edit/master/site/',
      },
      lastUpdated: true,
      // Echo "E" cube mark; .ico kept as legacy fallback, apple-touch-icon added in head.
      favicon: '/favicon.svg',
      // Keep Starlight's built-in Pagefind ⌘K search; add Ask Echo + DocActions via overrides.
      components: {
        Footer: './src/components/Footer.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      head: [
        // Dark-first: default new visitors to dark unless they've chosen otherwise.
        {
          tag: 'script',
          content: "try{if(!localStorage.getItem('starlight-theme')){localStorage.setItem('starlight-theme','dark');document.documentElement.dataset.theme='dark';}}catch(e){document.documentElement.dataset.theme='dark';}",
        },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fragment+Mono&display=swap',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css',
          },
        },
        // Default social card. Starlight already emits og:title/description/url
        // and twitter:card=summary_large_image, but no image — add a site-wide
        // default so shares aren't imageless. Absolute URLs are required by
        // social scrapers. Per-page overrides can set their own og:image later.
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://echo.labstack.com/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://echo.labstack.com/og.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
      ],
      // Autogenerated from the content dirs — new pages appear automatically,
      // ordered by each page's `sidebar.order` frontmatter.
      sidebar: [
        { label: 'Guide', items: [{ autogenerate: { directory: 'guide' } }] },
        { label: 'Middleware', items: [{ autogenerate: { directory: 'middleware' } }] },
        { label: 'Cookbook', items: [{ autogenerate: { directory: 'cookbook' } }] },
      ],
      // tune the built-in code theme toward our terminal palette
      expressiveCode: { themes: ['github-dark', 'github-light'] },
    }),
  ],
});
