# Your Lab Marketing: marketing site

The public site for **Your Lab Marketing**, a studio doing social media for
research labs. Built with [Astro](https://astro.build) as static HTML. No
server, no database, no build step Cloudflare Pages can't run.

Live: https://yourlabmarketing.com
Client portal (separate project): https://your-lab-marketing-portal.vercel.app

## Stack

- Astro (static output, no framework islands needed for a marketing page)
- Self-hosted fonts: Inter Variable + Source Serif 4 (`@fontsource`)
- Plain CSS with the same design tokens as the client portal: deep navy,
  teal accent, Source Serif headlines over Inter
- No backend, no env vars, no database

## Identity system

The logo is not artwork. It's a rule. `src/lib/wellmark.ts` renders letters
as filled wells on a microplate grid (5×7, or a coarse 3×5 cut below ~64px).
It's kept in sync with the same file in the client portal repo
(`YourLabPortal/src/lib/wellmark.ts`); if one changes, update the other.

## Development

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs static files to `dist/`.

## Deployment: Cloudflare Pages

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: pinned via `.nvmrc` (22.12.0), which Cloudflare Pages reads
  automatically
- `public/_headers` sets long-lived caching on Astro's fingerprinted assets
  and a few baseline security headers; Cloudflare Pages picks it up with no
  extra config

Connect the `yourlabmarketing-site` GitHub repo in the Cloudflare dashboard
and it redeploys on every push to `main`. Point the `yourlabmarketing.com`
domain at the Pages project under **Custom domains** once the first deploy
is live.
