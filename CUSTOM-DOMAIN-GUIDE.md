# 🌐 CUSTOM DOMAIN GUIDE — kit.abetworks.in

**Goal:** serve the kit site (and every future client page) on `https://kit.abetworks.in` instead of `https://coding4vinayak.github.io/abetworks-business-kit/…`.

**Time needed:** 10 minutes of clicks + up to 24h for the HTTPS certificate (usually <30 min).
**Risk to existing stuff:** zero — apex, email, and the github.io URL all keep working. Rollback is one click.

---

## 0 · Diagnosis (done 2026-10-20 — read this first)

| Finding | Meaning |
|---|---|
| DNS hosted on **Cloudflare** (`sharon`/`rory.ns.cloudflare.com`) | Steps below are Cloudflare-specific clicks |
| **Wildcard record `*` exists**, proxied (orange cloud) | Every subdomain — kit included — currently falls through to the main-site origin |
| `abetworks.in` AND `kit.abetworks.in` both return **HTTP 520** | The main site's origin (Render) is erroring behind Cloudflare **right now** — separate problem, see §5 |

Because a wildcard catches `kit`, we do **not** edit anything existing. We **add one explicit record for `kit`** — an explicit record always beats the wildcard for that name. Nothing else is touched.

**Why a subdomain and not `abetworks.in` itself:** the apex carries the main site. Pointing apex at GitHub Pages would break it. `kit.` is free real estate.

---

## 1 · YOUR STEP — add the DNS record (Cloudflare dashboard)

1. Log in to Cloudflare → click zone **abetworks.in** → left menu **DNS → Records**
2. **Add record**:
   | Field | Value |
   |---|---|
   | Type | `CNAME` |
   | Name | `kit` |
   | Target | `coding4vinayak.github.io` |
   | Proxy status | **DNS only — grey cloud** ⚠️ |
   | TTL | Auto |
3. Save.

> ⚠️ **Grey cloud is not optional here.** Orange (proxied) breaks GitHub's certificate issuance and can cause redirect loops. If the zone's global setting is "proxied by default", click the little cloud on the kit row until it's grey.

## 2 · VERIFY the DNS took (5–15 min wait)

**Fastest way:** `bash scripts/domain-check.sh` — prints your exact state (A: not added · B: live & correct, GitHub's 404 · C-ish: wrong proxy/port · D: fully live) and the next move for each.


Open **https://dnschecker.org** → type `kit.abetworks.in` → type `CNAME` → it should show `coding4vinayak.github.io` on green flags worldwide.

Then open **https://kit.abetworks.in** in a browser. Correct result at this stage: GitHub's **404 page** ("There isn't a GitHub Pages site here"). That 404 is GOOD — it proves the domain reached GitHub. Tell me when you see it.

## 3 · MY STEP — wire Pages to the domain (say "dns is live")

I then:
1. Add a `CNAME` file (containing `kit.abetworks.in`) to `docs/` in the repo
2. Set the custom domain on repo Pages settings (API or you click: **Settings → Pages → Custom domain → `kit.abetworks.in` → Save**)
3. Push → after the Pages build, `https://kit.abetworks.in` serves the real site

Both URLs work simultaneously during transition; nothing breaks.

## 4 · CERTIFICATE + finish line

- GitHub issues a Let's Encrypt cert for `kit.abetworks.in` automatically (grey cloud makes this fast). Check **Settings → Pages** — when the green box appears, tick **Enforce HTTPS**.
- Then say "domain live" → I run the **link-bank flip**: every URL in `MARKETING/assets-score.md` + the demo/ROI/generator footer links switch from the `/abetworks-business-kit/…` path to `kit.abetworks.in/…` paths, and the harness is updated to test the new domain.

### Rollback (any time)
Delete the `kit` DNS record → subdomain falls back to the wildcard; the `github.io` URL has never stopped working. Removing the CNAME file + clearing the Pages custom-domain setting returns the repo to pure github.io mode.

---

## 5 · SIDE-ALERT: main site 520 (separate issue, yours)

`https://abetworks.in` and the wildcard subdomains are returning Cloudflare **520 = the origin answered with garbage/died**. Since apex is proxied to (probably) Render:

1. Log in to **Render** → is `abetworks-website` service **running** or suspended? Free tier sleeps — but 520 ≠ sleep (sleep is a slow 200). 
2. If the service was suspended (free instance hours exhausted or billing), restart/upgrade it.
3. Once it serves normally, `abetworks.in` recovers on its own — no DNS change needed.

I cannot see your Render dashboard from here — this is a you-click. Do it **before** sending any link with `abetworks.in` in it to a prospect.

## FAQ

**Will this break email?** No. MX records are untouched; we're only adding a subdomain.
**Costs?** ₹0 — Cloudflare DNS + GitHub Pages + Let's Encrypt are all free.
**Do the demo/ROI/generator links inside the pages break?** No — all internal links are relative. Only the *absolute* URLs in the LINK BANK get rewritten (I do that in step 4).
**Client dashboard files I download — do they care?** No — they're standalone files; links inside them are WhatsApp `wa.me` links you configure.
