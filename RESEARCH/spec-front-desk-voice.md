# SPEC — Front Desk Voice Line (AI phone receptionist, India · Hinglish)

**Product lane:** Allied services P1 (from competitive-gap-analysis §2.9) · **Status:** spec — build after Front Desk web chat is at 10+ paying care-plan clients
**The wedge:** the US voice wave (Goodcall/Rosie/Slang, $49–199/mo) never got INR-pricing or Hinglish-localized. In India the phone is still SMB's #1 inbound channel — and the missed-call economy is real: every unanswered ring at 7pm is a lost customer who never fills a web form.

---

## 1. Goal & non-goals

**Goal:** inbound calls to the business are answered 24/7 by an AI receptionist that speaks Hindi/English (code-switching), answers ONLY from the approved knowledge base (same zero-hallucination discipline as chat), captures the caller's name+number+need into the same lead pipeline, and hands off to humans whenever the call leaves the knowledge's scope.

**Non-goals for v1 (explicit):** outbound calls (TRAI/DLT compliance minefield), payments over the call, dialects beyond Hindi/English/Hinglish, insurance/medical advice.

## 2. Reference architecture (build vs buy per layer)

| Layer | Buy first (v1) | Own later (v2+) |
|---|---|---|
| Telephony (India number, SIP→media) | Exotel / MyOperator / Ozonetel (or Twilio India numbers where available) | keep vendor; abstract via adapter |
| Speech-to-text | Sarvam AI (Hindi strong) + Bhashini (govt-subsidized tier) for Hindi; Deepgram/Whisper for English | fine-tune on call vocab |
| Brain (turn logic) | **Same knowledge base + persona as the web bot** — one document, two surfaces (the suite pitch) | AbetAgent tool-calling runtime |
| Text-to-speech | Sarvam / vendor voices (Hindi+Marathi female/male presets) | voice-consistency brand pack |
| Orchestration/call-state | simple state machine in AbetFlow | dedicated call-session service |
| Lead capture | straight into NuCRM + the client sheet (same capture fields as chat: name/number/need/time) | — |

**Latency budget (hard requirement):** ≤1.5s end-to-end per turn; ASR partial-streaming + streamed TTS; barge-in (caller can interrupt). >2.5s turns kill trust — acceptance gate below.

## 3. Call flows (the 4 that matter)

1. **Info answers** — hours/price/services/landmark: answer + offer booking.
2. **Booking capture** — collect name → number (caller-ID confirmed, ask to confirm last 4) → preferred time → NuCRM lead w/ source=`voice`.
3. **Missed call → instant WhatsApp/SMS**: "Missed your call, [Business] here — reply this message: your name + what you need, or tap to book [link]." This alone sells the product to owners.
4. **Leaving scope / after-hours** — polite handoff: "Connecting you to our staff message system… we'll call you back within X hours" + transcript summary pushed to owner's WhatsApp.

Escalation triggers mirror A1/A2 templates (pain/severe complaints → promise callback, capture always).

## 4. Compliance box (India specifics — non-negotiable)

- **Inbound service calls: legal.** Outbound promo dialing = DND/DLT/telemarketer registration territory — hence v1 is inbound-only.
- **Recording:** play the consent disclosure ("this call may be recorded for quality") in the greeting; recordings kept 30 days rolling, then auto-delete; DPDP consent note in the delivery pack (A3/A4).
- **Voice data:** transcripts (not raw audio) are the long-lived artifact; audio encrypted, Mumbai storage if offered in-region by vendor; PII mask on transcripts before LLM calls (PromptShield discipline).
- **Caller-ID honesty:** display the business's real number as the caller-ID — telcos flag or block spoofed/mismatched labels, and owners don't want clients called from random numbers.

## 5. Unit economics (the sheet that decides pricing)

| Cost item | Range (₹/answered minute) |
|---|---|
| Telephony (inbound India) | 0.30–0.80 |
| ASR + TTS + LLM turns | 0.80–2.00 |
| Infra overhead/vendor margin | 0.15–0.40 |
| **Total COGS** | **₹1.3–3.2 /min** |

Average front-desk call: 90–150 sec → COGS ≈ ₹2–8 per call. Priced add-on (attach to Pro/Scale): **₹4,999/mo incl. 250 minutes answered + ₹4/min overage** → margin lands 55–70% at typical volumes (600–1,200 answered min/mo). If COGS trend toward >₹3/min at pilot, renegotiate ASR before GA.

## 6. MVP definition (3 weeks, one engineer + one voice-tuning sprint)

**In:** inbound both languages · knowledge answers · booking capture · missed-call WhatsApp flow · owner transcript digest daily.
**In (gating):** recorded-consent greeting · call-transfer-to-staff during business hours (SMS the owner "press to take over" isn't reliable on plain PSTN — v1 uses warm SMS alert + hold-music transfer if vendor supports).
**Out:** v1 explicitly: outbound, payments, multi-branch routing.

Acceptance gates to GA (per pilot bot, 2-week sampling):
- Call answer containment ≥70% (no human needed)
- Zero hallucinated prices (eval suite ported to voice: same 20Q set spoken)
- p50 turn latency ≤1.2s, p95 ≤2.0s, barge-in works
- Booking capture rate ≥25% of info-only calls
- Owner-reported "didn't know it was AI" ≥10% (the delight metric)

## 7. Pilot plan (before pricing is public)

3 pilot clients (1 clinic, 1 restaurant, 1 real-estate agent) at COGS-only pricing for 4 weeks in exchange for: recorded calls as portfolio evidence + a written testimonial + weekly feedback call. Landing the pilot = the exact play from your `business-kit` monthly-report muscle (07/A10 discipline — verdicts, not vibes).

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Hinglish code-switching ASR errors | Hindi-primary ASR; test and log code-switch rate; English fallback phrase ("main English me bata du?" meta-question allowed) |
| Latency creep under load | vendor regional endpoints; one-call-one-session; load-test at 3 p95 concurrency before bookings |
| Telco/BSP vendor lock-in | adapter layer from day 1; export leads/transcripts to CSV weekly |
| Owner complain: "AI answers weird" | daily digest includes 1 flagged transcript; Care plan = tuning loop |
| Regulatory shift (TRAI/AI rules) | inbound-only scope keeps blast radius small; revisit on change |
