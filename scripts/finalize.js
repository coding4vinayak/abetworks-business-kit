#!/usr/bin/env node
/*
 * finalize.js — Abetworks kit placeholder & price finalizer
 *
 * Replaces, in one pass:
 *   [YOUR NAME]        → --name "..."            (README, WEBSITE, docs, MARKETING, TEMPLATES)
 *   919XXXXXXXXX       → --wa <digits>           (everywhere the token appears)
 *   care-plan prices   → --care-lite/--care-pro/--care-scale  (₹1,999/₹4,999/₹14,999 per month lines)
 *   setup prices       → --lite/--pro/--scale    ("from ₹X" lines, then bare ₹ mentions, then code literals)
 *
 * DRY-RUN by default: prints what WOULD change. Add --apply to write.
 * After writing, runs node test/run-tests.js (skippable with --no-test).
 *
 * Usage:
 *   node scripts/finalize.js --name "Vinayak S" --wa 919XXXXXXXXXX \
 *     --lite 14999 --pro 34999 --scale 89999 \
 *     --care-lite 1999 --care-pro 4999 --care-scale 14999
 */
"use strict";
var fs = require("fs");
var path = require("path");

/* ---------- args ---------- */
var argv = process.argv.slice(2);
function arg(flag) {
  var i = argv.indexOf(flag);
  return (i > -1 && argv[i + 1] && !argv[i + 1].startsWith("--")) ? argv[i + 1] : null;
}
var APPLY = argv.includes("--apply");
var NOTEST = argv.includes("--no-test");
var CFG = {
  name: arg("--name"),
  wa: arg("--wa"),
  lite: arg("--lite"), pro: arg("--pro"), scale: arg("--scale"),
  careLite: arg("--care-lite"), carePro: arg("--care-pro"), careScale: arg("--care-scale")
};
if (!APPLY) console.log("DRY RUN — nothing will be written. Add --apply to write.\n");

/* ---------- helpers ---------- */
function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  });
  return out;
}
var ROOT = path.join(__dirname, "..");
var FILES = []
  .concat(walk(path.join(ROOT, "WEBSITE"), []))
  .concat(walk(path.join(ROOT, "docs"), []))
  .concat(walk(path.join(ROOT, "MARKETING"), []))
  .concat(walk(path.join(ROOT, "TEMPLATES"), []))
  .concat([path.join(ROOT, "README.md"), path.join(ROOT, "00-MASTER-PLAN.md")])
  .filter(function (p) { return /\.(html|md)$/.test(p); });

/* code-literal price files (numeric, no ₹) */
var CODE_FILES = FILES.filter(function (p) {
  return /roi-calculator|proposal-generator/.test(p);
});

/* replacement plans: [pattern, replacement, label] — ORDER MATTERS */
var plan = [];
if (CFG.name) plan.push([/\[YOUR NAME\]/g, CFG.name, "name"]);
if (CFG.wa) plan.push([/919XXXXXXXXX/g, String(CFG.wa).replace(/\D/g, ""), "whatsapp"]);
if (CFG.careScale) plan.push([/₹14,999\/month/g, inr(CFG.careScale) + "/month", "Scale care/mo"]);   // before setup!
if (CFG.carePro) plan.push([/₹4,999\/month/g, inr(CFG.carePro) + "/month", "Pro care/mo"]);
if (CFG.careLite) plan.push([/₹1,999\/month/g, inr(CFG.careLite) + "/month", "Lite care/mo"]);
if (CFG.scale) plan.push([/from ₹89,999/g, "from " + inr(CFG.scale), "Scale setup"]);
if (CFG.pro) plan.push([/from ₹34,999/g, "from " + inr(CFG.pro), "Pro setup"]);
if (CFG.lite) plan.push([/from ₹14,999/g, "from " + inr(CFG.lite), "Lite setup"]);
if (CFG.scale) plan.push([/₹89,999/g, inr(CFG.scale), "Scale ₹ (bare)"]);
if (CFG.pro) plan.push([/₹34,999/g, inr(CFG.pro), "Pro ₹ (bare)"]);
if (CFG.lite) plan.push([/₹14,999/g, inr(CFG.lite), "Lite ₹ (bare)"]);

var codePlan = [];
if (CFG.scale) codePlan.push([/\b89999\b/g, String(CFG.scale), "89999"]);
if (CFG.pro) codePlan.push([/\b34999\b/g, String(CFG.pro), "34999"]);
if (CFG.lite) codePlan.push([/\b14999\b/g, String(CFG.lite), "14999"]);

/* ---------- execute ---------- */
var total = 0, hits = {};
FILES.forEach(function (p) {
  var src = fs.readFileSync(p, "utf8"), n0 = src, count = 0, tags = [];
  var rules = CODE_FILES.indexOf(p) > -1 ? plan.concat(codePlan) : plan;
  rules.forEach(function (r) {
    var m = src.match(r[0]);
    if (m) { count += m.length; tags.push(r[2] + "×" + m.length); src = src.replace(r[0], r[1]); }
  });
  if (count) {
    hits[p] = tags.join(" · ");
    total += count;
    if (APPLY) fs.writeFileSync(p, src);
    console.log((APPLY ? "✔ wrote " : "→ would edit ") + path.relative(ROOT, p) + "  [" + tags.join(", ") + "]");
  }
});

if (!Object.keys(hits).length) {
  console.log(APPLY ? "Nothing matched — already finalized or wrong values?" : "No matches found for the given values.");
  process.exit(0);
}
console.log("\n" + (APPLY ? "Wrote " : "Would write ") + total + " replacement(s) across " + Object.keys(hits).length + " file(s).");

/* ---------- post-apply: leftover scan + tests ---------- */
if (!APPLY) process.exit(0);
var left = [];
FILES.forEach(function (p) {
  var s = fs.readFileSync(p, "utf8");
  if (CFG.name && /\[YOUR NAME\]/.test(s)) left.push(path.relative(ROOT, p) + " · [YOUR NAME]");
  if (CFG.wa && /919XXXXXXXXX/.test(s)) left.push(path.relative(ROOT, p) + " · 919XXXXXXXXX");
});
if (left.length) console.log("⚠️ leftovers:\n  " + left.join("\n  "));
else if (CFG.name || CFG.wa) console.log("✓ no [YOUR NAME]/919XXXXXXXXX leftovers in scanned files.");

if (APPLY && !NOTEST) {
  console.log("\n--- running test harness ---");
  require("child_process").execSync("node test/run-tests.js", { stdio: "inherit", cwd: ROOT });
}
