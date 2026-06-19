# oriz-finance

> 📊 Finance — SIP, EMI, FIRE, tax — calculators that show the math.

Part of the [oriz](https://oriz.in) family. Lives at
[finance.oriz.in](https://finance.oriz.in).

A static Astro 6 site themed by [`@chirag127/oriz-ui`](https://github.com/chirag127/oriz-ui).
Calculators are React islands; the math runs entirely in your browser. Inputs
never leave your device. Sign-in is optional and only powers cross-site features
(saved scenarios, bookmarks) that follow you across the oriz family via shared
Firebase Auth on `auth.oriz.in`.

## Develop

```bash
pnpm install
npx envpact-cli@0.2.0   # populate .env from the family-wide secrets store
pnpm dev                # astro dev on http://localhost:4321
```

## Build & deploy

Hosted on **Cloudflare Pages**. The custom domain
`finance.oriz.in -> oriz-finance` is bound via the Cloudflare dashboard.

```bash
pnpm build              # static output to ./dist
pnpm preview            # preview the build locally
pnpm deploy             # wrangler deploy to Cloudflare
```

## What lives here

| Path | Contents |
| ---- | -------- |
| `src/pages/` | Astro routes — home, about, contact, account, finish-sign-in, legal/* |
| `src/components/` | `Header.astro`, `Footer.astro`, `SiteSidebar.astro`, `HeaderControls.tsx` |
| `src/components/calculators/` | React-island calculators (SIP, EMI, …) |
| `src/layouts/BaseLayout.astro` | SEO + OG + JSON-LD + theme preflight + sidebar |
| `src/lib/` | `firebase.ts`, `siteConfig.ts`, `preflight.js`, `finmath.ts` |
| `src/styles/global.css` | Tailwind v4 + `@chirag127/oriz-ui/{styles,components.css}` |
| `astro.config.mjs` | Astro + React + Sitemap + Tailwind |
| `wrangler.toml` | Cloudflare Pages assets binding |
| `biome.json` | Lint + format (single quotes, no semicolons, 2-space) |

## Calculators

The catalogue covers four groups; each lives at `/calculators/<slug>/` once
wired up. SIP and EMI are live on the homepage as drop-in islands.

- **Investments** — SIP, lumpsum, step-up SIP, SWP, CAGR/XIRR, goal planner, FIRE
- **Loans & EMI** — home/car/personal/education loans, prepayment, comparison, eligibility
- **Banking & savings** — FD, RD, PPF, NPS, NSC, SSY, compound interest
- **Tax & salary** — take-home, TDS, HRA, gratuity, leave encashment, GST

Each calculator runs entirely in your browser. Inputs never leave the device.

## SEBI disclaimer

oriz-finance is **not** registered with SEBI, IRDAI, or RBI and does not provide
investment, tax, or insurance advice. Calculators are mathematical tools that
compute outputs from your inputs — not predictions or recommendations. Read the
full [disclaimer](./src/pages/legal/disclaimer.astro) before use.

## Design system

All design tokens, theme variants (dark / light / sepia / hc), accents, and
shared components (`AccountPanel`, `FinishSignIn`, `ContactForm`, `Sidebar`,
`AdSlot`, `NewsletterCta`) live in
[`@chirag127/oriz-ui`](https://github.com/chirag127/oriz-ui). This site only
declares its slug, name, tagline, and the calculator-specific React islands.
