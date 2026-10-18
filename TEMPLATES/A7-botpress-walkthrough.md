# TEMPLATE A7 — BOTPRESS WALKTHROUGH (build the clinic bot, button by button)

**Total build time: ~90 min first run, ~60 min for every clone after.** Works for clinic/restaurant/shop — only Part 2 content changes (use A1/A2).

⚠️ Botpress updates its UI sometimes. Every step below names the FUNCTION you're clicking, not just the expected label — if a label moved, find the function by name in the same left menu. Don't panic; rebuilds are cheap.

---

## PART 0 — Account (5 min)

1. Go to **botpress.com** → "Get started" → sign up with **Google** (your money email)
2. Free tier gives monthly usage credits — enough to run 3–4 small client bots. When a client's usage grows, THEIR upgrade pays for it (put this in A4 extras).
3. Land in "Studio" — that's home forever. Bookmark it.

## PART 1 — Create the bot (5 min)

1. Studio → **Create Bot / New bot**
2. Name: `Rafi Dental — AI Front Desk` · Description: `Answer patient FAQs + capture appointment leads — built by [YOUR NAME]`
3. Template: pick the simplest **"Knowledge base / Assistant"** style template if shown; otherwise blank — the instructions below build it fully.
4. Open it → you're in the **Studio** with a chat flow area + left sidebar.

## PART 2 — Knowledge base (15 min) ← the heart

1. Left menu → **Knowledge / Knowledge Base** → **Add** → choose **document/text/URL**
2. Paste or upload the A1 knowledge (hours, services+prices, doctors, policies). One clean doc is better than ten tiny ones.
3. Title: `Clinic Info — approved by owner` (title = proof of data source)
4. Format tips: use the A1 tables as-is (bot reads tables fine). Prices EXACT. Add a line: "Anything not in this document → collect contact."
5. Save/Train if shown. ⚠️ Nothing beats fresh text — if the owner sends updated prices later, image-in this + republish (that's the Care plan work).

## PART 3 — The brain (25 min)

1. Left menu → **Flows** → open the Main flow. You'll see the **Start node**.
2. Click the + on the Start node → add an **Agent / Autonomous / AI Reply** type node (name varies by version — the function is "AI answers from knowledge + instructions").
3. Click it → paste into **Instructions** EXACTLY:

```
You are the front-desk assistant of [BUSINESS NAME], a [clinic/restaurant/shop] in [CITY].

RULES (never break):
1. Answer ONLY from the connected knowledge base ([Clinic Info — approved by owner]).
2. If a question is not covered by the knowledge base, do NOT guess. Say kindly: "I'll have our staff confirm that for you — may I take your name and phone number?" Then capture both.
3. [MEDICAL/FOOD/SAFETY STATE — e.g. "No medical advice — for any health concern, invite the user to book an appointment."]
4. Ask ONE question at a time. Mirror the customer's language (auto-translate behavior).
5. After answering 2 questions from the menu/prices, politely offer the booking/lead step.
6. Collect: full name → phone → preferred date/time (booking only).
7. Tone: warm, brief, helpful staff member — never robotic, never apologetic about the bot being AI unless asked.
```

4. In the same node's settings, tick **Knowledge / use Knowledge Base** and select the KB(s) you made in Part 2.
5. **Capture step:** after the Agent node in the flow, add 3 *question* cards chained (the "capture block":
   - Q1 "Great — can I get your full name?" → store in variable `lead_name` (choose "session" scope)
   - Q2 "And the best phone number to reach you?" → `lead_phone`
   - Q3 "Preferred date or time? (optional)" → `lead_time`
6. Add a **final say/thank-you card**: `Thank you, {{lead_name}}! Staff will call {{lead_phone}} to confirm. Anything else I can help with?`
7. **Table (where leads land):** left menu → **Tables** → create table `Leads` with columns: name, phone, time, source("Website"). In the capture block, add an **insert-row card** mapping your 3 variables into the table. (This is your client's lead sheet; later you mirror it to their Google Sheet for the wow moment.)

## PART 4 — Test like an enemy (10 min)

1. Bottom-right **Emulator / Preview** panel — chat with your bot.
2. Run the 20-question drill from A1: prices ✅, hours ✅, booking ✅, PLUS the 5 nasty ones (health-advice probe, out-of-list item, wrong language, "why so expensive?", 1am availability test).
3. Anything wrong: fix knowledge text (Part 2) or instructions (Part 3) — NOT by hard-coding random answers. Iterate until clean. This drill is your brand; do it every build.

## PART 5 — Publish + get the link (5 min)

1. Top-right **Publish** → wait for the build ticker.
2. Left / Integration area → **Channels / Integrations** → **Webchat** → enable → copy the **shareable link** (`…webchat/shareable.html…`). This link is what goes into every Loom + DM.
3. **Website embed (for paid clients):** in Webchat settings, copy the `<script>` snippet. On WordPress: Add Block → "Custom HTML" → paste. Other platforms: send the snippet to their web person with: "Paste before `</body>` on every page; hour of work."
4. Re-publish after EVERY future change. (Get in the habit: change → publish → retest one question.)

## PART 6 — The Loom demo video (15 min, your money-moment)

Record (Loom free, ≤5 min — target 2):
1. (0:00–0:15) "Hi [Owner name], I built this in about 30 minutes using the info from your page — here it is live." ← NAME FIRST, always
2. (0:15–1:15) Ask the bot 3 REAL questions from THEIR page (open their menu/price photo in a tab, type it into the bot) — show match
3. (1:15–1:45) The **2am test**: change the device clock joke aside — just say "it's 2am — a customer asks right now…" and show the answer + lead capture landing in the `Leads` table
4. (1:45–2:30) "Imagine this with your real [menu/prices]. Full setup in 5 days, done-for-you: $X one-time. Want it for your business?" → stop video.

## PART 7 — Cloning (the real scaling move)

1. Studio home → your bot → **Duplicate/Clone** → rename for the next niche
2. Swap: knowledge doc (A2 for restaurants) + persona line 1 + booking fields (party size vs doctor)
3. 30 min later you have a gym bot, a real-estate bot… each becomes a portfolio piece.

## PART 8 — Fix table (when the emulator misbehaves)

| Symptom | Fix |
|---|---|
| Bot answers something NOT in the KB | Strengthen rule 1 in instructions (add: "refuse and redirect"), check KB is ticked on the Agent node, lower "creativity/temperature" setting if shown |
| Bot never asks for contact | Make instruction 2/6 harder: "ALWAYS end unknown topics by requesting name+phone" |
| Doesn't mirror language | Add: "Reply in the exact language the user wrote in." |
| Lead missing in table | Check insert-row card maps each variable; run one test lead yourself |
| Embed invisible on site | Theme needs footer edit, or clear cache; test in incognito |
| Usage credit warning | It's per-bot usage; if a client is heavy, that's when you upgrade — paid partly by them (A4 extras table) |
