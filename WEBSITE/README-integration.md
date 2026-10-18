# WEBSITE/README — deploying & integrating the Allied Services page

## What's in this folder
| File | Purpose |
|---|---|
| `allied-services.html` | **Standalone, self-contained page** — open in a browser, works immediately. Drop into your Render static delivery as `/services/allied-services/` |
| `allied-services-page-copy.md` | Full editorial copy + SEO block + deployment notes, matched to your site's voice (honest medians, named exclusions, trust cues) if you're rebuilding it inside your site framework instead |

## Quick deploy today (static)
1. Render service or repo with `public/` or `static/` folder → copy `allied-services.html` → `public/services/allied-services/index.html`
2. Add nav link "Allied services" under the Company/Services dropdown
3. Add to your sitemap page (`/sitemap-page/`) and sitemap.xml under:
   `https://abetworks-website.onrender.com/services/allied-services/` (and the custom domain equivalent)
4. Push/Deploy → test: mobile view, tripetto CTA, hub.abetworks.in links, FAQ accordions

## Proper integration later (site codebase)
- **Tokens:** the page uses `:root` CSS variables (`--bg, --acc...`) — map them to your global design tokens so rebranding stays one edit
- **Header/footer:** replace the minimal sticky header + footer with shared components (keep the announcement bar consistent with site)
- **Router (Next.js/Remix/etc.):** create the route, keep the `<main>` content; replace `<a>` with `<Link>`; the JSON-LD blocks go into the page's head
- Fonts: page uses system stack; switch to your font package on integration

## Conversion plumbing (10 min, do on launch day)
- UTM-tag the trietto button from this page: `?utm_source=site&utm_medium=allied_page&utm_campaign=trial` → so trial→licence conversion from this funnel is measurable
- Add allied page to internal links from: retail/healthcare/education/real-estate/manufacturing solution pages ("smaller setup? → Allied services"), `/pricing/` downmarket matcher, ROI-calculator result screen
- CTA lead capture: connect the "Talk to sales" button to your existing `/contact/` flow — and paste the chat-history intake form questions there so every allied lead arrives pre-qualified

## Naming discipline (important)
ONE product map everywhere: **Lite / Pro / Scale** (this page) = the same Lite/Pro/Scale in your outreach material, A3 delivery pack and A4 contracts. Sales + site + delivery never disagree — that's what makes small clients trust a small team.

## State of the business-kit after this build
`business-kit/` now covers: outreach engine → delivery templates → pricing/contract/negotiation → money/agency/content systems → **the company website funnel page** that mirrors the whole practice. The SMB lane is now: ad/DM → allied page → discovery call (A8) → A1/A2 build (A7) → A3/A4 delivery → care-plan retainer.
