# SACO

The Seattle Area Coding Organization website, built with Astro and deployed as static assets on Cloudflare Workers.

## Development

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

`npm run check` builds the site and checks page titles, descriptions, canonical URLs, social metadata, organization structured data, sitemap coverage, local links, images, FAQs, and client controls. `npm run preview` serves the build locally.

## Deployment

```sh
npm run deploy
```

This runs the checks before publishing `dist/` with the pinned Wrangler CLI. It requires Cloudflare authentication and access to the `saco` Worker. No server, database, or application secrets are required.

The production domain is `https://saco.dev`. Configure that custom domain for the Worker in Cloudflare when publishing. The domain is also used in `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`, and the assertions in `scripts/check.mjs`; update them together if it changes.

`wrangler.jsonc` serves extensionless URLs without trailing slashes and returns the custom 404 page for missing routes. The 404 page is marked `noindex`. After publishing, verify the production domain, page redirects, and missing-page HTTP status, then submit `https://saco.dev/sitemap.xml` in Google Search Console.

## Editing

- Pages: `src/pages/`. Routes are `/`, `/sacc`, `/sacc/2026`, `/about`, `/sponsors`, and `/join`.
- Team, sponsors, navigation, and contact links: `src/data/site.ts`.
- Shared metadata, navigation, and footer: `src/layouts/Layout.astro`.
- Styles: `src/styles/global.css`. Client controls: `src/scripts/controls.js`.
- Sitemap: `public/sitemap.xml`. Add new public pages here; the checks detect missing or duplicate entries.
- Social preview: `public/brand/social.png` (1200 × 630).

SACC 2026 is a past event, archived at `/sacc/2026`. Add future editions as separate pages. Keep dates, rules, and photos with their edition. The team application links directly to the original Google Form.

## Asset sources

SACO logos, sponsor artwork, team portraits, and the SACC 2026 photos were supplied by the organization. Web photos are resized and compressed copies; originals are unchanged. Manrope is self-hosted through `@fontsource-variable/manrope`.

Source content and destinations were checked against [saco.dev](https://saco.dev) on September 7, 2026. Conflicting prize amounts from the source site were omitted pending confirmation. The expired 2026 registration form is not offered on public pages.
