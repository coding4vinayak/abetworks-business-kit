# Importing your trackers into Google Sheets (2 minutes total)

1. **sheets.new** (new sheet) → File → Import → Upload → `outreach-tracker.csv` → **Replace current sheet**
   - repeat per file: one workbook, 3 tabs named `Outreach`, `Income`, `Retainers`
2. One-time formatting (90 seconds):
   - **Outreach tab:** select all → Format → Alternating colors; add Filter (Data → Create a filter)
   - Column `Next follow-up` → conditional format: dates **equal to TODAY()** → bold yellow
   - Column `Status` → conditional: "Won" green · "Negotiating" blue · "Lost/Dropped" gray
   - **Income tab:** select `USD-per-hr` column → conditional: red when < 15 (delivery too slow = re-template that type)
   - **Retainers tab:** `What is due this month` → conditional: "Pending"/"No" → red
3. Phone: install the Sheets app, but turn OFF push noise — the daily 10-minute admin slot is from 06-A, not the app
4. **Monday reset:** Data → Filter → "Next follow-up = TODAY" → that's your morning calling list

## Formulas worth pasting (Outreach tab, below your data)

- Win rate after demo: `=ROUND(COUNTIF(J:J,"Won")/COUNTIF(H:H,"<>")*100)&"%"`
- Reply rate: `=ROUND(COUNTIF(G:G,"Y")/COUNTA(F:F)*100)&"%"`
- This week added: `=COUNTIF(A:A,">"&TODAY()-7)`

## Sync contract with the rest of the kit

- These CSV headers are canonical — import 05-TRACKERS.md any time to re-understand meanings
- If a status hasn't changed in 14 days → the day-7 + archive rule (04) applies
- Monthly: Income tab feeds the 09 ritual; Retainers tab feeds the client-dashboard.html updates
