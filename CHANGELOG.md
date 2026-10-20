# CHANGELOG — business kit

## v1.1 — 2026-10-18 "make it better"

- **Eval suite to all 6 industries:** new 20-question scaffolds for **real estate** (RERA, GST, possession-date honesty, loan-rate invention traps) and **machine shop** (quote integrity, MOQ, materials-scope, no-fabricated-ISO traps) — now the whole allied-services ICP is testable. Files: `WEBSITE/eval-suite.html`, note in A10.
- **Trackers became artifacts:** `trackers/outreach-tracker.csv`, `income-tracker.csv`, `retainer-board.csv` — canonical headers + sample rows + one-click Google Sheets import guide (`trackers/README-import.md`) with the win-rate / reply-rate formulas pre-written.
- **Client dashboard v1.1:** added the **quality verdict chip** (passPct · adversarial · last retest — pasted straight from the eval suite). The retention loop is now closed end-to-end.
- **Research layer:** competitive-gap analysis (Product Hunt landscape, verified Apollo pricing) + two full product specs: **Front Desk voice line** (India/Hinglish, unit economics ₹/min, TRAI-safe scope) and **LeadWorks WhatsApp-reachability field** (consent-first, honest tiers).

## v1.0 — 2026-10-18

- 4-engine system: AI services, CAD services, digital products, outreach engine
- 12 operating files (plan, money, pricing, content, learning, scale)
- 10 execution templates (bots A1/A2, delivery A3, contract A4, proposals A5, thumbnails A6, walkthrough A7, calls A8, one-pager A9, eval manual A10)
- Web funnel: allied-services page, outbound PDF, client dashboard
- Pushed to GitHub `abetworks-business-kit` (private)
## v1.1.1 — 2026-10-18
- **GitHub Pages live site:** `coding4vinayak.github.io/abetworks-business-kit` — landing portal + allied page + eval suite + client dashboard + one-pager, hosted free from the `docs/` folder (source of truth stays in `/WEBSITE`).
## v1.1.2 — 2026-10-20
- **EvalReady product page live** (`WEBSITE/evalready.html` + `docs/` mirror): what it catches, 3-step flow, SHIP/FIX/DO-NOT-SHIP verdicts, FAQ — Hub tool #31 promoted from a stub to a page with a working app behind it.
- Allied-services pages (both copies) gained a 4th free-tool card (EvalReady — the only one visitors can actually try).
- Landing portal gained the EvalReady card (5 cards now: offer, eval suite, dashboard, EvalReady, one-pager).
- `MARKETING/launch-copy.md`: paste-ready LinkedIn post, WhatsApp broadcast, X post + thread, bio lines, outbound DM, 4-week build-in-public cadence.
- Tested: all 6 pages 200, internal links resolve, structure + artifact sweep clean.
## v1.1.3 — 2026-10-20
- **Interactive front-desk demo live** (`WEBSITE/demo-front-desk.html` + `docs/`): pick a niche (dental / restaurant / machine shop), chat against the visible "owner-approved document" — approved prices answered instantly, discounts/unlisted prices/refusals demonstrated, lead-capture strip. Coded refusals + syntax-tested with node.
- Portal gained the demo card (6 cards); allied pages (both copies) link it as proof asset in the free-tools strip.
## v1.1.4 — 2026-10-20
- **Client dashboard is now multi-client**: `CLIENTS` registry in `WEBSITE/client-dashboard.html` (one block per client, fully separate data: niche, plan, stats, quality verdict, leads table, 3 conversations, upgrades).
- Private per-client links `client-dashboard.html?c=slug` · no/unknown slug → chooser screen (cards) · header switcher ( 🌐 All clients… ) for the manager view · contact card hidden on chooser.
- Wired: `onclick` refs moved to `CUR.*`; contact card tagged for hiding; portal card copy updated.
- Tests: node syntax OK + runtime-load OK + DOM-stub render paths all green (no slug / rafi-dental / madrasi-table / precision-gears / unknown).
