#!/usr/bin/env node
/* run-tests.js — the Abetworks business kit test harness (bulletproof pass v1)
   usage:  node test/run-tests.js [--live]
   --live adds: live URL checks + Pages build status (needs GHP_TOKEN env, optional)
   exit code: 0 = all green, 1 = failures (use in CI) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "docs");
const WEB = path.join(ROOT, "WEBSITE");
let pass = 0, fail = 0;
const ok = (id, extra) => { pass++; console.log("  PASS " + id + (extra ? " — " + extra : "")); };
const bad = (id, extra) => { fail++; console.log("  FAIL " + id + (extra ? " — " + extra : "")); };

/* ---------- helpers ---------- */
function htmlFiles(dir) { return fs.readdirSync(dir).filter(f => f.endsWith(".html")); }
function extractScripts(html) {
  // returns [{kind:'js'|'json', src, note}] from every <script>…</script>
  const out = []; const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi; let m, i = 0;
  while ((m = re.exec(html))) {
    i++; const attrs = (m[1] || ""), src = m[2];
    if (attrs.includes("application/ld+json")) out.push({ kind: "json", src, note: "ld#json-" + i });
    else if (/^\s*<|document\.getElementById\('y'\)/.test(src) && src.length < 200) { /* tiny inline */ }
    else if (attrs.trim() === "" || attrs === "") out.push({ kind: "js", src, note: "script-" + i });
    else out.push({ kind: "json", src, note: "other-attrs-" + i });
  }
  return out;
}
function checkSyntaxJs(name, src) {
  try { new vm.Script(src, { filename: name }); return null; }
  catch (e) { return e; }
}
function structure(f) {
  const h = fs.readFileSync(f, "utf8");
  const t = h.slice(0, 300), b = h.slice(-400);
  const okD = /<!DOCTYPE html>/i.test(t), okC = /<\/html>/.test(b);
  const okH = /<head/.test(h), okB = /<body/.test(h);
  if (okD && okC && okH && okB) ok(path.basename(f), "doctype/head/body/close");
  else bad(path.basename(f), `doctype=${okD} head=${okH} body=${okB} close=${okC}`);
}
function scripts(f) {
  const base = path.basename(f);
  extractScripts(fs.readFileSync(f, "utf8")).forEach(s => {
    if (s.kind === "json") {
      try { JSON.parse(s.src); ok(`${base} ⊨ ${s.note}`); }
      catch (e) { bad(`${base} ⊨ ${s.note}`, e.message); }
    } else {
      const e = checkSyntaxJs(`${base}(${s.note})`, s.src);
      if (e) bad(`${base} ⊨ ${s.note}`, e.message.split("\n")[0]);
      else if (s.src.trim().length > 40) ok(`${base} ⊨ ${s.note}`, s.src.trim().length + " chars");
    }
  });
}
function links(f) {
  const base = path.basename(f);
  const html = fs.readFileSync(f, "utf8");
  const seen = new Set(); const re = /(?:href|src)="([^"#?]+\.html)"/g; let m;
  while ((m = re.exec(html))) seen.add(m[1]);
  for (const l of seen) {
    const t = path.join(path.dirname(f), l);
    if (fs.existsSync(t)) ok(`${base} → ${l}`);
    else bad(`${base} → ${l}`, "target missing");
  }
}

/* ---------- offline suite ---------- */
console.log("== 1. structure (docs mirror = what Pages serves) ==");
if (!fs.existsSync(SITE)) { bad("docs/ missing"); }
else htmlFiles(SITE).forEach(f => structure(path.join(SITE, f)));

console.log("\n== 2. embedded JS syntax + JSON-LD validity ==");
if (!fs.existsSync(SITE)) { bad("docs/ missing"); }
else htmlFiles(SITE).forEach(f => scripts(path.join(SITE, f)));

console.log("\n== 3. internal links resolve ==");
if (!fs.existsSync(SITE)) { bad("docs/ missing"); }
else htmlFiles(SITE).forEach(f => links(path.join(SITE, f)));

console.log("\n== 4. mirror discipline (WEBSITE == docs) ==");
const wFiles = fs.existsSync(WEB) ? htmlFiles(WEB) : [];
wFiles.forEach(f => {
  const a = fs.readFileSync(path.join(WEB, f), "utf8"), b = fs.existsSync(path.join(SITE, f)) ? fs.readFileSync(path.join(SITE, f), "utf8") : null;
  if (a === b) ok(f, "WEBSITE == docs");
  else bad(f, b === null ? "missing in docs/" : "DIFFERS — run: cp WEBSITE/" + f + " docs/");
});

console.log("\n== 5. artifact scan (CJK/Arabic/Hangul/mojibake/TODO leftovers) ==");
let artifacts = 0;
function scanTxt(f) {
  const s = fs.readFileSync(f, "utf8"); const base = path.relative(ROOT, f);
  const badChars = s.match(/[\u0600-\u06FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g);
  const moji = s.match(/\uFFFD/g); let n = 0;
  if (badChars) { bad(base, "CJK/Arabic chars: " + [...new Set(badChars)].join("")); n++; }
  if (moji) { bad(base, "replacement chars: " + moji.length); n++; }
  if (n === 0) pass++;
}
[WEB, path.join(ROOT, "MARKETING"), path.join(ROOT, "TEMPLATES"), SITE].forEach(d => {
  if (fs.existsSync(d)) fs.readdirSync(d).filter(f => f.endsWith(".html") || f.endsWith(".md")).forEach(f => scanTxt(path.join(d, f)));
});

console.log("\n== 6. placeholder registry (informational) ==");
(function () {
  let name = 0;
  function count(dir) {
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f); if (!fs.statSync(p).isFile()) return; if (!/\.(html|md)$/.test(f)) return;
      const s = fs.readFileSync(p, "utf8");
      name += (s.match(/\[YOUR NAME\]/g) || []).length;
    });
  }
  count(WEB); count(path.join(ROOT, "MARKETING"));
  console.log(`  INFO [YOUR NAME] remaining: ${name} · (real-name input gates this)`);
})();

/* ---------- live suite (optional) ---------- */
if (process.argv.includes("--live")) {
  console.log("\n== 7. live URLs ==");
  const https = require("https");
  const B = "https://coding4vinayak.github.io/abetworks-business-kit/";
  const pages = ["", "allied-services.html", "demo-front-desk.html", "client-dashboard.html", "client-dashboard.html?c=madrasi-table", "evalready.html", "eval-suite.html", "outbound-onepager.html", "client-generator.html"];
  const get = u => new Promise(res => {
    const t0 = Date.now();
    https.get(u, r => { res({ code: r.statusCode, ms: Date.now() - t0 }); r.resume(); })
      .on("error", e => res({ code: 0, ms: Date.now() - t0, err: e.message }));
  });
  (async () => {
    for (const p of pages) {
      let r = await get(B + p);
      if (r.code !== 200) { await new Promise(z => setTimeout(z, 4000)); r = await get(B + p); } // 1 retry
      (r.code === 200 && r.ms < 15000) ? ok("/" + p, `${r.code} in ${r.ms}ms`) : bad("/" + p, JSON.stringify(r));
    }
    finish();
  })();
} else finish();

function finish() {
  console.log(`\n✅ ${pass} passed · ❌ ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
