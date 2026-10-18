# SPEC — LeadWorks "WhatsApp-reachable" field (category-creation data product)

**Product lane:** LeadWorks P0 (competitive-gap-analysis §2.3 — the category-creation wedge)
**One-line pitch:** *"Your leads, WhatsApp-verified, before your team dials."* No data vendor (Apollo ✓ checks done, Clay, Seamless) sells whether a phone number actually **receives/reads WhatsApp** in India. This spec turns that absence into a proprietary field.

---

## 1. What the field IS (and honestly isn't)

`whatsapp_reachable` = a **verified-communication surface** attribute on a contact, with provenance. It is NOT a "this number has WhatsApp installed" guess (no product can know that without consented signals), and it is NOT legal to hound numbers with test pings. The honest version has tiers:

| Tier | Meaning | How it's learned | Consent needed? |
|---|---|---|---|
| **T0 · signal-only** | `heuristic`: number format/country/line-type plausibility from partner data | data enrichment only | no — but explicitly labeled "signal", never "verified" |
| **T1 · verified-by-outreach** | business-initiated **utility** WhatsApp template was **delivered** to the number | happens as a side-effect of a REAL message your customer already chose to send (LeadGenius/outreach or booking confirmation) | yes — the owner's opt-in from their own consent flow |
| **T2 · verified-by-inbound** | the person has messaged the business (or the network) before | AbetConnect conversation history | n/a (their action) |

**The strategic point:** T1/T2 are only possible because CRLeads, outreach and inbox are one data model (your meta-thesis from §0 of the gap analysis). Point tools physically cannot build this field without integration work. That's the moat line for the NuCRM/LeadWorks marketing page: **"Verified where others guess."**

## 2. Field schema (API + DB)

```json
{
  "phone_e164": "+919876543210",
  "country": "IN",
  "wa_status": "verified_inbound" | "verified_outreach" | "signal_good" | "signal_unknown" | "unreachable_recent" | "blocked_by_user",
  "confidence": 0.0–1.0,
  "verified_at": "2026-11-08T19:02Z",
  "freshness_days": 12,
  "decay_policy": "auto → signal_unknown after 90 days without refresh",
  "consent_ref": "dpdp-consent-record-id | null",
  "source": "abetconnect-inbound | leadgenius-template-ack | partner-signal",
  "notes": "delivery+read receipt seen on template #HSM123"
}
```
Distinct state for `blocked_by_user` (user blocked the business — delivery will look "failed" forever) — treating blockers as "unreachable" would poison pipeline for owners; they deserve the truth and an honest "don't contact" respect flag.

## 3. Pipeline (who does what, in suite terms)

1. **LeadWorks** imports/creates contact → runs T0 heuristics → shows `signal_*` badge immediately (fast value)
2. **Owner's own flow** sends the first legitimate message (outreach/booking/newsletter) via **LeadGenius/AbetConnect** — Meta BSP delivery + read webhooks stream back
3. **LeadWorks** consumes those webhooks → flips to `verified_outreach` w/ timestamp + template ref → **confidence rises**, price of the "verified lead segment" earned
4. **NuCRM** shows the badge on the lead card + segments: "WhatsApp-verified India leads" (instantly the most-dialable list a rep owns)
5. Nightly job: hygiene (dedupe, re-check signals, apply 90-day decay, sample-audit 1% of flips for false positives)

## 4. API + UI surface

- `GET /contacts/{id}/reachability` (returns the schema above)
- `GET /segments/whatsapp-verified` (list + counts, filter: country/city/consent)
- Webhook topics: `reachability.verified`, `reachability.decayed`, `reachability.blocked`
- UI: badge chip in NuCRM lead card & LeadWorks rows (blue = verified ≤90d, gray = signal, red-outline = blocked/honest) + one-line provenance tooltip ("verified 12d ago: read receipt on a utility template")
- Export: the field rides along in every CSV the customer already exports — no per-field pricing (anti-credit stance, §4 of gap analysis). Its cost is inside the plans it activates.

## 5. Truth-in-lead-data rules (this is your brand, don't break it)

1. **Never sell "verified" where only a signal exists.** Three visual levels minimum; the word "verified" appears only for T1/T2.
2. **Verification is a by-product of messages the customer meant to send.** No silent pings, no test blasts — Meta quality ratings live downstream of this decision; one spam pattern throttles every client on the BSP.
3. **Utility templates only** for T1 triggers (real purpose: quote reply, booking confirm, service update). Marketing templates arrive much too hot to learn reachability from.
4. **Blocked-by-user is final respect:** auto-suppress that contact from outreach surfaces; log and move on.
5. **Freshness decays honestly** (90 days → downgrade to signal) because numbers get recycled — stale "verified" is a false friend that costs your customer deals.

## 6. Acceptance gates (pilot → GA)

- Coverage: ≥60% of a pilot customer's active India leads reach verified/outreach state within 30 days (their own messaging)
- False-positive audit: 1% sample monthly; mislabeled `verified` <2%
- Owner impact claim for the sales page: outreach reply-rate delta on verified vs signal-only lists (target ≥1.6×; cite methodology on your benchmarks page — house-style ✓ matches what the site promises)
- 90-day decay practiced on day 90, publicly documented

## 7. GTM (when the field exists)

- Sales call line (A8 plug-in): "Anyone can sell you a phone list in 2026. We tell you which leads will actually pick up WhatsApp — with proof and dates."
- Blog: "The death of the cold call list: verified-reachability" — funnel to ROI calculator (✓ exists)
- Free-tool version for the Hub: **"ReachCheck"** — paste one number, get the signal-only read + an honest explanation of what tier-1 verification requires. Viral bait for the same ICP; CTA → Allied services / NuCRM.

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Meta policy: templates need opt-in per user | T1 fires only on consent-backed sends (consent_ref mandatory); audit trail in DPDP ledger |
| Quality-rating throttles if any customer spams | launch-gate in LeadGenius (already spec'd) + this field NEVER triggers sends itself |
| Partner-signal data wrong (T0 noise) | confidence caps + "signal" labeling; auto-downgrade on bounce evidence |
| Recycled numbers | 90-day decay + re-verify on any new inbound |
| Perceived as "spy on contacts" | publish the pipeline openly (this page exists — that's the trust play) |
