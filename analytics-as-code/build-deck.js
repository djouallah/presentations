const pptxgen = require("pptxgenjs");
const { applyTheme } = require("C:/Users/mdjouallah/.claude/skills/synced/96ccf6bb-e63d-44da-a58c-307ede8bc5dd_74b3cd02-1017-48f0-873d-842937303a4b/pptx/scripts/apply_theme.js");

const IMG = "C:/git/presentations/analytics-as-code/img/history/";
const AS = "C:/git/presentations/analytics-as-code/img/deck/";
const OUT = process.env.OUT || "C:/git/presentations/analytics-as-code/analytics-as-code.pptx";

const THEME = {
  name: "Numurkah",
  headFontFace: "Segoe UI Semibold",
  bodyFontFace: "Segoe UI",
  colors: {
    dk1: "F2F4F8", lt1: "111318", dk2: "9AA3B2", lt2: "1C1F26",
    accent1: "F5A623", accent2: "2BB3A3", accent3: "E5484D",
    accent4: "6B7483", accent5: "C9CED8", accent6: "3A3F4B",
    hlink: "F5A623", folHlink: "C9CED8",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Analytics as code";
pres.author = "Mimoune Djouallah";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const W = 13.333, H = 7.5, M = 0.6;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "TITLE", background: { color: HEX.lt1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.2, w: W - 2 * M, h: 1.4, fontSize: 54, bold: true, color: C.text1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 3.75, w: W - 2 * M, h: 0.9, fontSize: 24, color: C.text2, align: "left", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT", background: { color: HEX.lt1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: W - 2 * M, h: 0.9, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: W - 1.0, y: H - 0.45, w: 0.5, h: 0.3, fontSize: 10, color: C.accent4, align: "right" },
});
pres.defineSlideMaster({ title: "BLANK", background: { color: HEX.lt1 } });

let n = 0, STEP = 0, PARA = false;
// at(k): what is added next appears on click k of its slide (para: one click per paragraph); 0 = always there
const at = (k, para = false) => { STEP = k; PARA = para; };
const slide = (master, section) => {
  at(0);
  if (section) pres.addSection({ title: section });
  return pres.addSlide({ masterName: master, sectionTitle: currentSection(section) });
};
let _sec = null;
function currentSection(s) { if (s) _sec = s; return _sec; }
const name = () => (STEP ? `a${STEP}${PARA ? "p" : ""}_obj${++n}` : `obj${++n}`);

const caption = (s, text, opts = {}) => s.addText(text, {
  x: M, y: H - 0.85, w: W - 2 * M, h: 0.4, fontSize: 14, color: C.text2, margin: 0,
  isTextBox: true, objectName: name(), ...opts,
});
const code = (s, text, x, y, w, h, fontSize = 16) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, rectRadius: 0.08, objectName: name() });
  s.addText(text, { x: x + 0.25, y: y + 0.2, w: w - 0.5, h: h - 0.4, fontFace: "Consolas", fontSize, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: name() });
};
const fullPhoto = (s, path) => s.addImage({ path, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H }, objectName: name() });

// image fitted into a box, keeping its aspect ratio
const fit = (s, path, iw, ih, x, y, w, h, extra = {}) => {
  const r = Math.min(w / iw, h / ih), ww = iw * r, hh = ih * r;
  s.addImage({ path, x: x + (w - ww) / 2, y: y + (h - hh) / 2, w: ww, h: hh, objectName: name(), ...extra });
};

// section divider: number, title, one line, and the journey as a timeline with this stop lit
const STOPS = [["The beginning", "2019"], ["The rabbit hole", "2019–2025"], ["dbt, Iceberg and AI", "2025–2026"], ["Back to the semantic model", "August 2026"], ["Where we're going", "next"]];
const divider = (k, line, notes, section) => {
  const s = slide("BLANK", section);
  s.addText(String(k + 1).padStart(2, "0"), { x: M, y: 1.3, w: 3, h: 1.0, fontSize: 40, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  s.addText(STOPS[k][0], { x: M, y: 2.3, w: W - 2 * M, h: 1.3, fontSize: 60, bold: true, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  s.addText(line, { x: M, y: 3.65, w: W - 2 * M, h: 0.6, fontSize: 24, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  const y = 5.75, step = (W - 2 * M) / STOPS.length;
  s.addShape(pres.shapes.LINE, { x: M + step / 2, y, w: step * (STOPS.length - 1), h: 0, line: { color: C.accent6, width: 1.5 }, objectName: name() });
  STOPS.forEach(([t, d], i) => {
    const cx = M + step * i + step / 2, on = i === k, r = on ? 0.13 : 0.08;
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: y - r, w: 2 * r, h: 2 * r, fill: { color: on ? C.accent1 : (i < k ? C.text2 : C.accent6) }, line: { color: C.background1, width: 1 }, objectName: name() });
    s.addText([{ text: t, options: { bold: on, breakLine: true } }, { text: d, options: { fontSize: 11 } }],
      { x: cx - step / 2, y: y + 0.25, w: step, h: 0.7, fontSize: 13, color: on ? C.text1 : C.text2, align: "center", valign: "top", margin: 0, isTextBox: true, objectName: name() });
  });
  s.addNotes(notes);
};

// ---------- 1. title ----------
{
  const s = slide("TITLE", "The beginning");
  s.addText("Analytics as code", { placeholder: "title" });
  s.addText("Seven years, one solar farm, and an AI that writes every line", { placeholder: "body" });
  s.addText([
    { text: "Mimoune Djouallah", options: { bold: true, color: C.text1, breakLine: true } },
    { text: "I work for Microsoft. This is a personal project, and these are my own opinions.", options: { color: C.text2, breakLine: true } },
    { text: "nemtracker.github.io  ·  github.com/djouallah/analytics-as-code", options: { color: C.accent1 } },
  ], { x: M, y: 5.4, w: W - 2 * M, h: 1.2, fontSize: 16, margin: 0, paraSpaceAfter: 4, isTextBox: true, objectName: name() });
  s.addNotes("I work for Microsoft. But this is not a Microsoft talk. It's a hobby project I have been running on my own time since 2019, and everything I say here is my own opinion.");
}

{ divider(0, "A solar farm, and a simple question", "2019. It started with a solar farm."); }

// ---------- 2. Numurkah ----------
{
  const s = slide("BLANK");
  fullPhoto(s, AS + "numurkah.jpg");
  s.addNotes("In 2019 I was working on a solar farm in Numurkah. During commissioning, my manager asked a simple question: how much are we producing?\n\nThe data was public. AEMO publishes everything, every five minutes. He was happy with a monthly figure, but I thought I could do better. I was just curious.");
}

// ---------- 3. Power BI 2019 ----------
{
  const s = slide("CONTENT");
  s.addText("2019: Power BI, published to the web", { placeholder: "title" });
  fit(s, IMG + "2019-06_powerbi.png", 1675, 920, M, 1.5, W - 2 * M, 4.9);
  at(1); caption(s, "Shared as a public web page. People could see the data, but not download it.");
  s.addNotes("I'm a civil engineer, not a programmer. I used what I knew: Power BI and Power Query. It worked. And because the data was public, I shared it as a public web page.\n\nThen I hit the limits. The free version doesn't let people download the data, and the reality is that export to Excel is the most important feature in any dashboard.");
}

{ divider(1, "Learning to code, one question at a time", "Then I went down the rabbit hole.", "The rabbit hole"); }

// ---------- 4. raw data + 2019 SQL ----------
{
  const s = slide("CONTENT");
  s.addText("I didn't write code", { placeholder: "title" });
  at(1); s.addText("What AEMO publishes", { x: M, y: 1.45, w: 5.8, h: 0.4, fontSize: 16, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  fit(s, IMG + "2019-09_datastudio_4.jpg", 808, 287, M, 1.95, 5.8, 2.6);
  at(2); s.addText("My first SQL, 2019", { x: 6.9, y: 1.45, w: 5.8, h: 0.4, fontSize: 16, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  fit(s, IMG + "2019-09_datastudio_6.jpg", 939, 294, 6.9, 1.95, 5.8, 2.6);
  at(3); s.addText([
    { text: "The smart people spun up a virtual machine and wrote everything by hand.", options: { breakLine: true } },
    { text: "So I learned anyway: Python, pandas, SQL, a cloud warehouse.", options: {} },
  ], { x: M, y: 4.95, w: W - 2 * M, h: 1.1, fontSize: 20, color: C.text1, margin: 0, paraSpaceAfter: 8, isTextBox: true, objectName: name() });
  caption(s, "Note MAX(SCADAVALUE)/12 AS Mwh: in 2019 I worked out the divide-by-twelve myself.");
  s.addNotes("So I went looking at what other people did. The smart people spun up a virtual machine and wrote everything by hand. I didn't write code.\n\nI learned anyway. Python, pandas, a cloud data warehouse, and a free BI service on top.");
}

// ---------- 5. Stack Overflow ----------
{
  const s = slide("CONTENT");
  s.addText("Asking for help in 2019", { placeholder: "title" });
  at(1); fit(s, IMG + "stackoverflow_1_blurred.png", 1156, 825, M, 1.45, 5.9, 5.9 * 825 / 1156);
  at(2); fit(s, IMG + "stackoverflow_2.png", 1117, 886, 6.83, 1.45, 5.9, 5.9 * 886 / 1117);
  at(3); caption(s, "Most people were helpful. Not all of them.");
  s.addNotes("I asked a lot of questions on Stack Overflow. Most people were helpful. Not all of them. In 2019 I asked whether you could deploy a whole project using only code. Minus two. I asked how to download the zip files from AEMO's site, the same job this project does every hour today. Minus two. If you don't know the answer, you ask, and the question may well be stupid. Getting downvoted for it is just not cool.");
}

// ---------- 6. the free BI service ----------
{
  const s = slide("CONTENT");
  s.addText("Six years on a free BI service", { placeholder: "title" });
  fit(s, AS + "report_2019.png", 600, 840, M, 1.45, 4.0, 5.3);
  at(1); s.addText("Near real time, on a phone, for free.", { x: 5.2, y: 2.2, w: 7.5, h: 0.6, fontSize: 24, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(2); s.addText("Then the free tier changed, and paying for a warehouse was too much risk for a hobby dashboard.", { x: 5.2, y: 3.0, w: 7.5, h: 1.4, fontSize: 24, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(0); caption(s, "September 2019", { x: 5.2, w: 7.5 });
  s.addNotes("That version ran for about six years. Then the free tier I depended on changed, and paying for a warehouse was too much risk for a hobby dashboard.");
}

{ divider(2, "Open tables, and an AI that writes every line", "Then AI arrived, and made a rebuild possible.", "dbt, Iceberg and AI"); }

// ---------- 11. commits per month ----------
{
  const s = slide("CONTENT");
  s.addText("Then AI", { placeholder: "title" });
  s.addChart(pres.charts.BAR, [{ name: "Commits", labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct 1–16"], values: [81, 9, 10, 5, 3, 40, 8, 334] }], {
    x: M, y: 1.4, w: 8.2, h: 5.0, barDir: "col", chartColors: [HEX.accent1],
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk2, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    catAxisLineShow: false, showLegend: false, showTitle: true, title: "My commits to this repo per month, 2026",
    titleColor: HEX.dk2, titleFontSize: 14, titleFontFace: "+mn-lt", barGapWidthPct: 40, objectName: name(),
  });
  at(1); s.addText([
    { text: "2025", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "I connected Claude to the database. It worked out on its own that MW every five minutes, divided by twelve, is energy.", options: { color: C.text1 } },
  ], { x: 9.2, y: 1.6, w: 3.5, h: 2.0, fontSize: 18, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(2); s.addText([
    { text: "2026", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: "Every line of this repo is written by AI. Without it, I would never have rewritten the SQL in dbt and the front end in JavaScript.", options: { color: C.text1 } },
  ], { x: 9.2, y: 3.75, w: 3.5, h: 2.6, fontSize: 18, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  s.addNotes("AI had been creeping in for a while. In 2025 I connected Claude to the database and asked what it thought. It worked out on its own that power in megawatts, sampled every five minutes, divided by twelve, is energy. That was the moment I knew things would not be the same.\n\nThis year it became useful enough to change how I work. This version was written by AI from its first day. Most of the repository was written in the last few weeks, and every line of it was written by AI. Without it, I would never have rewritten the SQL in dbt and the front end in JavaScript. dbt and Iceberg were the infrastructure; AI made it possible.\n\nAnd it is too powerful. That's a good thing, and that's the problem.");
}

// ---------- 13. the test rewrite ----------
{
  const s = slide("CONTENT");
  s.addText("It rewrote the test to pass", { placeholder: "title" });
  at(1); s.addText("13:41  the test I asked for", { x: M, y: 1.4, w: 5.9, h: 0.4, fontSize: 16, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: name() });
  code(s, "-- newest interval with power AND a price\nLEAST(\n  MAX(SETTLEMENTDATE) FROM fct_scada_today,\n  MAX(SETTLEMENTDATE) FROM fct_price_today\n)", M, 1.9, 5.9, 1.95, 15);
  at(2); s.addText("14:31  the same test, fifty minutes later", { x: 6.83, y: 1.4, w: 5.9, h: 0.4, fontSize: 16, bold: true, color: C.accent3, margin: 0, isTextBox: true, objectName: name() });
  code(s, "-- price gone, copied from the new model\nGREATEST(\n  MAX(SETTLEMENTDATE) FROM fct_scada,\n  MAX(SETTLEMENTDATE) FROM fct_scada_today\n)", 6.83, 1.9, 5.9, 1.95, 15);
  at(3); s.addText("“Also reverts test to use GREATEST (matching the corrected logic).”", { x: M, y: 4.3, w: W - 2 * M, h: 0.6, fontSize: 22, italic: true, color: C.text1, margin: 0, isTextBox: true, objectName: name() });
  s.addText("Claude's commit message, 9 March 2026", { x: M, y: 4.9, w: W - 2 * M, h: 0.4, fontSize: 14, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  at(4); caption(s, "Green build. Wrong numbers.", { fontSize: 20, bold: true, color: C.accent3 });
  s.addNotes("On the second day of the project I added a test: the newest interval in the summary must be the newest one that has both power and a price. Fifty minutes later the AI changed the model and dropped the price. Then it changed the test to match the model, and called it a correction. Green build. Wrong numbers.");
}

// ---------- 8. the browser does the work ----------
{
  const s = slide("CONTENT");
  s.addText("2026: the browser does the work", { placeholder: "title" });
  fit(s, AS + "nemtracker_flows.png", 2376, 1385, M, 1.4, 8.6, 5.3);
  ["Open tables in cheap object storage", "DuckDB runs the queries in your browser", "No server, no warehouse, nothing running while nobody is looking"].forEach((t, i) => {
    at(i + 1); s.addText(t, { x: 9.5, y: 1.6 + i * 1.2, w: 3.2, h: 1.1, fontSize: 18, color: C.text1, bullet: true, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  });
  s.addNotes("With AI writing the code, I rebuilt everything on two open pieces: Iceberg, and DuckDB in the browser. Store the tables as open files in cheap object storage, and let the reader's browser run the queries. No server, no warehouse, nothing running while nobody is looking.");
}

// ---------- 10b. the backend ----------
{
  const s = slide("CONTENT");
  s.addText("The backend: dbt, every hour", { placeholder: "title" });
  s.addText("One dbt run an hour on GitHub Actions: 25 models, written by AI, writing Iceberg tables.", { x: M, y: 1.35, w: W - 2 * M, h: 0.5, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  const steps = [
    ["Download", "a Python model fetches AEMO's new files"],
    ["Archive", "gzipped CSVs and a log, in object storage"],
    ["Landing", "the raw facts, as published"],
    ["Mart", "the dimensions, facts and daily tables the model reads"],
    ["Iceberg", "every table in an Iceberg REST catalog"],
    ["Test", "34 data tests on the live tables, every day"],
  ];
  const gap = 0.2, bw = (W - 2 * M - gap * (steps.length - 1)) / steps.length, y = 2.6, bh = 2.4;
  steps.forEach(([t, sub], i) => {
    const x = M + i * (bw + gap);
    at(i + 1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: bh, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, rectRadius: 0.1, objectName: name() });
    s.addText(String(i + 1), { x: x + 0.18, y: y + 0.15, w: bw - 0.36, h: 0.5, fontSize: 24, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
    s.addText([{ text: t, options: { bold: true, breakLine: true } }, { text: sub, options: { fontSize: 14, color: C.text2 } }],
      { x: x + 0.18, y: y + 0.75, w: bw - 0.36, h: bh - 0.9, fontSize: 18, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: name() });
  });
  at(steps.length + 1); caption(s, "Keep the source as raw as possible; transform in the next layer.", { color: C.accent1, fontSize: 16 });
  s.addNotes("The backend is one dbt project, run every hour by GitHub Actions. A Python model downloads AEMO's new files and archives them, gzipped, in object storage, with a log of what it fetched. The landing tables keep the facts as AEMO published them. The mart builds what the semantic model reads: the dimensions, the five-minute facts, the daily and monthly tables. Every table is Iceberg, in a REST catalog. And every day, 34 data tests run on the live tables: one row per key, every file loaded, the feeds fresh.\n\nOne rule I kept: the source stays as raw as possible, and every transformation happens in the next layer. So a rule can change and every table can be rebuilt from the archive, without downloading anything again.");
}

// ---------- 10c. same SQL, other engines ----------
{
  const s = slide("CONTENT");
  s.addText("It's SQL, so it isn't tied to DuckDB", { placeholder: "title" });
  s.addText("dbt models are SQL: the same project runs on any engine that reads and writes Iceberg.", { x: M, y: 1.35, w: W - 2 * M, h: 0.5, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  const engines = [
    ["DuckDB", "one node, in process"],
    ["Spark", "a cluster"],
    ["Polars", "DataFrames, with SQL"],
    ["Trino", "distributed SQL"],
  ];
  const gap = 0.3, bw = (W - 2 * M - gap * (engines.length - 1)) / engines.length, y = 2.4, bh = 1.6;
  at(1);
  engines.forEach(([t, sub], i) => {
    const x = M + i * (bw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: bh, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, rectRadius: 0.1, objectName: name() });
    s.addText([{ text: t, options: { bold: true, fontSize: 24, color: C.text1, breakLine: true } }, { text: sub, options: { fontSize: 15, color: C.text2 } }],
      { x: x + 0.25, y: y + 0.2, w: bw - 0.5, h: bh - 0.4, valign: "middle", margin: 0, isTextBox: true, objectName: name() });
  });
  at(2); s.addText("The engine is a choice, like the storage.", { x: M, y: 4.8, w: W - 2 * M, h: 0.6, fontSize: 26, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  s.addNotes("Nothing in this setup belongs to a vendor. Iceberg runs on any object store, with any catalog, and it's not tied to DuckDB either. dbt models are SQL, so the same project can run on any engine that reads and writes Iceberg: DuckDB on one node, Spark on a cluster, Polars, Trino.\n\nThe engine is a choice, like the storage.");
}

// ---------- 9. one commit: the storage is a choice too ----------
{
  const s = slide("CONTENT");
  s.addText("Changing storage vendor took one commit", { placeholder: "title" });
  at(1); s.addText("48", { x: M, y: 1.7, w: 3.6, h: 1.6, fontSize: 96, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  s.addText("lines of code. One commit, I promise. OK, 48 lines. 25 August 2026", { x: M, y: 3.35, w: 3.6, h: 1.2, fontSize: 18, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(2); code(s,
    "attach:\n" +
    "  - path: \"{{ env_var('WAREHOUSE_PATH') }}\"\n" +
    "    type: iceberg\n" +
    "    options:\n" +
    "      endpoint: \"{{ env_var('ONELAKE_ENDPOINT') }}\"\n" +
    "      token: \"{{ env_var('ONELAKE_TOKEN') }}\"",
    4.7, 1.7, 8.0, 2.5, 17);
  s.addText("profiles.yml: point dbt at the new catalog. The models, the SQL and the data format stay the same.", { x: 4.7, y: 4.4, w: 8.0, h: 0.8, fontSize: 16, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(3); caption(s, "Iceberg is the contract, not the vendor. That is the boring reason open formats matter.");
  s.addNotes("And the storage is a choice too. In August 2026 I moved the tables to another catalog, OneLake.\n\nThat move was one commit. The models barely changed, because the table format was Iceberg, not a vendor's. That is the boring reason open formats matter.");
}

// ---------- 10d. still not happy (segue) ----------
{
  const s = slide("CONTENT");
  s.addText("Still not fully happy", { placeholder: "title" });
  at(1); s.addText("Every chart had its own SQL, and no single place said what a number means.", { x: M, y: 1.4, w: W - 2 * M, h: 0.5, fontSize: 20, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  at(2); s.addText("AI makes a dashboard a walk in the park. Every chart works.", { x: M, y: 2.4, w: W - 2 * M, h: 1.0, fontSize: 36, bold: true, color: C.text1, margin: 0, isTextBox: true, objectName: name() });
  at(3); s.addText("Without a semantic model, it's anarchy.", { x: M, y: 3.7, w: W - 2 * M, h: 1.0, fontSize: 36, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  at(4); s.addText("In 2019 I had one. Then I lost it.", { x: M, y: 5.0, w: W - 2 * M, h: 0.6, fontSize: 24, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  s.addNotes("It worked, but I wasn't fully happy. Every chart had its own SQL, and no single place said what a number means.\n\nWith AI, generating a dashboard is a walk in the park, and every chart may well work. But if the numbers are not pinned down in a semantic model, it's anarchy: every chart is its own definition of the number.\n\nIn 2019 I had a semantic model. Then I lost it.");
}

{ divider(3, "What I had in 2019. Not the BI tool: one definition of every number.", "And then, back to the semantic model I had in 2019. Not to the BI tool: to one definition of every number.", "Back to the semantic model"); }

// ---------- 10. architecture: one model, many front ends ----------
{
  const s = slide("CONTENT");
  s.addText("One model, many front ends", { placeholder: "title" });
  const box = (x, y, w, h, t, sub, hot = false) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.background2 }, line: { color: hot ? C.accent1 : C.accent6, width: hot ? 2 : 0.75 }, rectRadius: 0.1, objectName: name() });
    s.addText([{ text: t, options: { bold: true, fontSize: hot ? 28 : 22, color: hot ? C.accent1 : C.text1, breakLine: true } }, { text: sub, options: { fontSize: 15, color: C.text2 } }],
      { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: h - 0.3, valign: "middle", margin: 0, isTextBox: true, objectName: name() });
  };
  const arrow = (x, y, w, h, flipV = false) => s.addShape(pres.shapes.LINE, { x, y, w, h, flipV, line: { color: C.accent4, width: 1.5, endArrowType: "triangle" }, objectName: name() });
  const midY = 3.85;
  box(M, midY - 0.65, 2.7, 1.3, "Iceberg tables", "dbt, every hour");
  arrow(M + 2.7, midY, 0.7, 0);
  box(4.0, midY - 0.9, 3.7, 1.8, "Semantic model", "one Ossie file: every measure, once", true);
  const ends = [
    ["Public page", "DuckDB in the browser"],
    ["Behind a sign-in", "the same page, internal"],
    ["A BI tool", "a Power BI report"],
  ];
  at(1);
  ends.forEach(([t, sub], i) => {
    const cy = midY + (i - 1) * 1.55;
    if (cy < midY) arrow(7.7, cy, 0.9, midY - cy, true);
    else if (cy > midY) arrow(7.7, midY, 0.9, cy - midY);
    else arrow(7.7, midY, 0.9, 0);
    box(8.6, cy - 0.6, W - M - 8.6, 1.2, t, sub);
  });
  at(2); caption(s, "One definition of every number, whatever draws the chart.");
  s.addNotes("So yes, back to where I started after seven years. Not to a BI tool: to the semantic model. The tables are Iceberg, built by dbt every hour. One semantic model, one Ossie file, defines every measure once. Then anything can draw the chart: the public page with DuckDB in the browser, the same page behind a sign-in, or a Power BI report. They all ask the same model, so they all give the same number.");
}

// ---------- 14. 84 of 683 ----------
{
  const s = slide("CONTENT");
  s.addText("Every chart right, the numbers still disagree", { placeholder: "title" });
  at(1); s.addText("84", { x: M, y: 1.8, w: 4.2, h: 2.0, fontSize: 120, bold: true, color: C.accent3, margin: 0, isTextBox: true, objectName: name() });
  s.addText("of 683 questions gave a different number, when each chart had its own SQL", { x: M, y: 3.9, w: 4.6, h: 1.4, fontSize: 18, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(2); s.addText("0", { x: 7.0, y: 1.8, w: 4.2, h: 2.0, fontSize: 120, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: name() });
  s.addText("of 683 since both pages ask the semantic model", { x: 7.0, y: 3.9, w: 4.6, h: 1.4, fontSize: 18, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(3); caption(s, "An agent fixes a wrong number where it sees it, in the query, so the rule is copied once more, a little differently each time.");
  s.addNotes("The dashboard was doing arithmetic everywhere. Summing stations, subtracting for changes, carrying prices forward. Every chart was right on its own, so every check passed. What was lost was one definition of each number. A second version of the page, with its SQL written chart by chart, disagreed with the first on 84 questions out of 683.");
}

// ---------- 15. the AI's SQL ----------
{
  const s = slide("CONTENT");
  s.addText("Ask an AI for generation by fuel", { placeholder: "title" });
  at(1); code(s, "SELECT d.FuelSourceDescriptor AS fuel,\n       SUM(f.mw) AS mw\nFROM v_fct_summary f\nJOIN v_dim_duid d ON d.DUID = f.DUID\nWHERE f.date = DATE '…' AND f.time = …\nGROUP BY 1\nORDER BY 2 DESC;", M, 1.5, 7.3, 3.6, 17);
  at(2); s.addText("“Here you go! This query is correct and efficient.”", { x: M, y: 5.35, w: 7.3, h: 0.5, fontSize: 16, italic: true, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  const verdict = (t, y, h, color) => s.addText(t, { x: 8.4, y, w: 4.3, h, fontSize: 32, bold: true, color, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  at(3); verdict("Fast.", 1.5, 0.6, C.text1);
  at(4); verdict("Confident.", 2.1, 0.6, C.text1);
  at(5); verdict([{ text: "Off by hundreds", options: { breakLine: true } }, { text: "of megawatts." }], 2.7, 1.3, C.accent3);
  s.addText("SUM(f.mw) counts a charging battery as negative generation.", { x: 8.4, y: 4.45, w: 4.3, h: 1.0, fontSize: 16, color: C.text2, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  s.addNotes("And if you ask an AI for generation by fuel, it gives you SQL fast and confidently. It counts a charging battery as negative generation. On a sunny afternoon in New South Wales that's off by hundreds of megawatts. I'll show you in a minute.");
}

// ---------- 16. the harness ----------
{
  const s = slide("CONTENT");
  s.addText("The semantic model is the harness", { placeholder: "title" });
  at(1); code(s, "- name: Generation MW\n  expression:\n    dialects:\n      - dialect: DAX\n        expression: SUMX(fct_summary, MAX(fct_summary[mw], 0))", M, 1.5, 8.2, 2.3, 15);
  s.addText("A battery charging is not negative generation. Written once, in one text file.", { x: M, y: 4.05, w: 8.2, h: 0.8, fontSize: 18, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  [["The AI doesn't write the SQL any more. It names the measure.", C.text1],
   ["The business knowledge lives in the model, not in the AI.", C.text1],
   ["I don't review 683 queries. I review one file.", C.accent1]].forEach(([t, color], i) => {
    at(2 + i); s.addText(t, { x: 9.2, y: 1.6 + i * 1.15, w: 3.5, h: 1.0, fontSize: 18, color, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  });
  s.addNotes("So the AI doesn't write the SQL any more. It names the measure.\n\nThe semantic model is one text file. It says what generation means, which fuels are renewable, which units are batteries. Power BI runs it. The same file runs in your browser, compiled to SQL for DuckDB. A chart can only pick fields, filters and measures. No arithmetic, no SQL.\n\nThe business knowledge lives in the model, not in the AI. And because it's text, I don't review 683 queries. I review one file.");
}

// ---------- 16b. how it works ----------
{
  const s = slide("CONTENT");
  s.addText("How it works", { placeholder: "title" });
  s.addText("What happens when you click a visual. The same steps in every BI tool; here each one runs in your browser.", { x: M, y: 1.35, w: W - 2 * M, h: 0.5, fontSize: 18, color: C.text2, margin: 0, isTextBox: true, objectName: name() });
  const steps = [
    ["Visual query", "the fields and filters of a click"],
    ["Semantic model", "the measures it names"],
    ["Query language", "written as DAX"],
    ["Compile to SQL", "the BI tool translates DAX to SQL"],
    ["Catalog", "where the tables are"],
    ["Scan & aggregate", "DuckDB in the browser"],
    ["Visual", "the chart draws the rows"],
  ];
  const gap = 0.18, bw = (W - 2 * M - gap * (steps.length - 1)) / steps.length, y = 2.6, bh = 2.2;
  steps.forEach(([t, sub], i) => {
    const x = M + i * (bw + gap);
    const hi = i === 1;
    at(i + 1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: bw, h: bh, fill: { color: hi ? C.accent1 : C.background2 }, line: { color: hi ? C.accent1 : C.accent6, width: 0.75 }, rectRadius: 0.1, objectName: name() });
    s.addText(String(i + 1), { x: x + 0.15, y: y + 0.15, w: bw - 0.3, h: 0.5, fontSize: 24, bold: true, color: hi ? C.background1 : C.accent1, margin: 0, isTextBox: true, objectName: name() });
    s.addText([{ text: t, options: { bold: true, breakLine: true } }, { text: sub, options: { fontSize: 13, color: hi ? C.background1 : C.text2 } }],
      { x: x + 0.15, y: y + 0.75, w: bw - 0.3, h: bh - 0.9, fontSize: 16, color: hi ? C.background1 : C.text1, valign: "top", margin: 0, isTextBox: true, objectName: name() });
  });
  at(steps.length + 1); caption(s, "LIVE DEMO: nemtracker.github.io/how", { color: C.accent1, bold: true, fontSize: 18 });
  s.addNotes("[Demo: nemtracker.github.io/how. Pick a region on the slicer, then Next through the cards: the visual query, the measures it names in the semantic model, the DAX, the SQL it compiles to, and the plan that runs in the browser. On the Compile to SQL card, open 'let an AI write the SQL': the battery mistake, live. Click through the seven cards first, then switch to the browser.]\n\nEvery BI tool answers a click with these steps. The names change from tool to tool; what really differs is performance and complexity. Here every step runs in your browser, and the model in step 2 is the same file Power BI runs.");
}

{ divider(4, "What I learned, and what I think comes next", "So where are we going?", "Where we're going"); }

// ---------- 17b. less is more ----------
{
  const s = slide("CONTENT");
  s.addText("Less is more", { placeholder: "title" });
  s.addText("What fails my build", { x: M, y: 1.45, w: 6.0, h: 0.4, fontSize: 16, bold: true, color: C.accent1, margin: 0, isTextBox: true, objectName: name() });
  const checks = [
    ["Every push", "a lint fails the build on any arithmetic in the page"],
    ["Every push", "every model and test, built on real AEMO files"],
    ["Every day", "34 tests on the live tables: one row per key, every file loaded, feeds fresh"],
  ];
  checks.forEach(([when, what], i) => {
    const y = 2.0 + i * 1.05;
    at(i + 1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 6.0, h: 0.9, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, rectRadius: 0.08, objectName: name() });
    s.addText([{ text: when, options: { bold: true, fontSize: 13, color: C.accent2, breakLine: true } }, { text: what, options: { fontSize: 15, color: C.text1 } }],
      { x: M + 0.2, y: y + 0.08, w: 5.6, h: 0.75, valign: "middle", margin: 0, isTextBox: true, objectName: name() });
  });
  at(5); s.addText("Your users won't write these.", { x: 7.2, y: 1.95, w: 5.5, h: 0.6, fontSize: 26, bold: true, color: C.text1, valign: "top", margin: 0, isTextBox: true, objectName: name() });
  at(6); s.addText("The traditional dashboard got one thing right: a small surface. Pick fields, filters and measures, and nobody can write a new definition of a number.", { x: 7.2, y: 2.75, w: 5.5, h: 1.6, fontSize: 18, color: C.text2, valign: "top", margin: 0, isTextBox: true, objectName: name() });
  at(7); s.addText("Free SQL, for a user or an AI, is a new definition every time.", { x: 7.2, y: 4.5, w: 5.5, h: 1.0, fontSize: 18, color: C.accent1, valign: "top", margin: 0, isTextBox: true, objectName: name() });
  s.addNotes("Every one of these checks exists because something went wrong first. On every push, a lint fails the build if the page does any arithmetic, and every model and test is built on real AEMO files. Every day, 34 tests run on the live tables: one row per key, every file loaded, the feeds fresh.\n\nYour users won't write these. Nobody builds a parity check for their Friday report.\n\nIn a sense, the traditional dashboard was better: it's a limited surface. You pick fields, filters and measures, and you can't invent a new definition of a number. Free SQL, for a user or for an AI, is a new definition every time. Less is more.");
}

// ---------- 18. what comes next ----------
{
  const s = slide("CONTENT");
  s.addText("What I think comes next", { placeholder: "title" });
  const items = [
    ["Storage is already decoupled", "Changing vendor took one commit."],
    ["The semantic model will be decoupled from compute", "With BI tools we can already use many warehouses: they translate the model into each one's SQL."],
    ["Many front ends, one definition", "The GUI isn't going away, not in the medium term."],
    ["You still need to understand the tests", "And to know the business, and what your users actually want."],
  ];
  items.forEach(([h, sub], i) => {
    const y = 1.6 + i * 1.2;
    at(i + 1);
    s.addText(String(i + 1), { x: M, y, w: 0.7, h: 0.9, fontSize: 40, bold: true, color: C.accent1, margin: 0, valign: "top", isTextBox: true, objectName: name() });
    s.addText([{ text: h, options: { bold: true, fontSize: 24, color: C.text1, breakLine: true } }, { text: sub, options: { fontSize: 16, color: C.text2 } }],
      { x: M + 0.9, y, w: W - 2 * M - 0.9, h: 1.0, margin: 0, valign: "top", isTextBox: true, objectName: name() });
  });
  at(items.length + 1); caption(s, "Apache Ossie: an open format for semantic models, backed by Snowflake, Databricks, Google and Microsoft.", { color: C.accent1, fontSize: 16 });
  s.addNotes("Storage is already decoupled from compute. The semantic model will be decoupled from compute too, from the BI tool and from the warehouse. At least with BI tools, we can already use multiple warehouses: the BI tool translates the model into each one's SQL. And there is now an open format for it: Apache Ossie, backed by Snowflake, Databricks, Google and Microsoft. The semantic model in this repo is an Ossie file. The technology matters less and less. The primitives matter, cost and performance matter, and AI will do the rest.\n\nBut you still need to understand the tests. And you still need to know the business and what your users actually want, which is not obvious at all.");
}

// ---------- 19. the end ----------
{
  const s = slide("BLANK");
  s.addText("If I had had AI in 2019, I probably wouldn't be giving this talk.", { x: 1.2, y: 2.4, w: W - 2.4, h: 2.4, fontSize: 40, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0, isTextBox: true, objectName: name() });
  s.addNotes("If I had had AI in 2019, I probably wouldn't be giving this talk.\n\nNobody asked me to build any of this. I was just curious, and I loved figuring it out. Now AI does it in a minute. It's a bit sad, but it is what it is.\n\nSometimes the journey matters more than the destination. At least for a human.\n\n[Pause. A few seconds of silence, then: thank you.]");
}

// ---------- 21. thanks ----------
{
  const s = slide("TITLE");
  s.addText("Thank you", { placeholder: "title" });
  s.addText([{ text: "nemtracker.github.io", options: { breakLine: true } }, { text: "github.com/djouallah/analytics-as-code", options: { breakLine: true } }, { text: "datamonkeysite.com" }], { placeholder: "body" });
  s.addImage({ path: AS + "qr_nemtracker.png", x: W - M - 3.0, y: 2.0, w: 3.0, h: 3.0, objectName: name() });
  s.addText("Try it after the talk", { x: W - M - 3.0, y: 5.1, w: 3.0, h: 0.4, fontSize: 14, color: C.text2, align: "center", margin: 0, isTextBox: true, objectName: name() });
  s.addNotes("Questions. The QR code is here, after the demos, so the room's Wi-Fi was free during them.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
