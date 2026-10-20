#!/usr/bin/env bash
# domain-check.sh — Abetworks kit domain state inspector (CUSTOM-DOMAIN-GUIDE.md companion)
# Run anytime:  bash scripts/domain-check.sh
# No arguments needed. Exit code 0 = everything the agent needs is true for its next step.
set -u
KIT=kit.abetworks.in

cnam=$(dig CNAME $KIT +short 2>/dev/null | head -1)
aip=$(dig A $KIT +short 2>/dev/null | head -1)
status=$(curl -s -o /tmp/kb.html -w "%{http_code}" --max-time 15 "https://$KIT" 2>/dev/null)
body=$(grep -o "There isn.t a GitHub Pages site here" /tmp/kb.html 2>/dev/null | head -1)

echo "kit.abetworks.in — CNAME: ${cnam:-<none>} · A: ${aip:-<none>} · HTTP: ${status:-<no-reply>}"

if [ "$status" = "200" ]; then
  echo "✅ STATE D — site is LIVE on the kit domain. Nothing left to do."
  exit 0
fi

if [ "$cnam" = "coding4vinayak.github.io." ] || [ "$cnam" = "coding4vinayak.github.io" ]; then
  if [ "$status" = "404" ] && [ -n "$body" ]; then
    echo "✅ STATE B — DNS is live and correct (GitHub's own 404 = the domain reached Pages)."
    echo "   → Say 'dns is live' in chat; the CNAME file + Pages setting are the agent's step."
    exit 0
  fi
  if [ "$status" = "404" ]; then
    echo "⚠️ STATE B-ish — 404 but not GitHub's text: check the record is grey-cloud (DNS only), then retry."
    exit 1
  fi
  echo "⚠️ STATE ? — CNAME is right but HTTP $status. If it's 522/525/526: orange cloud + SSL mismatch — set the record to DNS only."
  exit 1
fi

echo "❌ STATE A — record not added yet (still riding the wildcard origin): A=$aip"
echo "   Fix: Cloudflare → abetworks.in → DNS → Add record:"
echo "        Type CNAME · Name kit · Target coding4vinayak.github.io · Proxy: DNS ONLY (grey cloud) · TTL Auto"
echo "   Then run this script again (wait 5–15 min after saving)."
exit 1
