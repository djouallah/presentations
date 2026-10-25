const pptxgen = require("pptxgenjs");
const { applyTheme } = require("C:/Users/mdjouallah/.claude/skills/synced/96ccf6bb-e63d-44da-a58c-307ede8bc5dd_74b3cd02-1017-48f0-873d-842937303a4b/pptx/scripts/apply_theme.js");

// STILLS=1: every slide in its last state, no animation, for the PDF backup (a PDF can't animate).
// FRAMES=1: one slide per step of each step-through, to check every step without clicking.
const STILLS = !!process.env.STILLS, FRAMES = !!process.env.FRAMES;
// The stills deck only feeds the PDF export, so it goes to the temp folder, not next to the real deck.
const OUT = process.env.OUT || (STILLS ? require("path").join(require("os").tmpdir(), "state-of-the-union-stills.pptx")
  : "c:/git/presentations/python-engine/state-of-the-union-python-engines-2026.pptx");

const THEME = {
  name: "Iceberg",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0B2233", lt1: "F7FAFC", dk2: "3D5566", lt2: "E3EEF3",
    accent1: "1B7F8E", accent2: "D9661F", accent3: "8FD3DE", accent4: "C9D6DE",
    accent5: "5B7083", accent6: "F2B880", hlink: "1B7F8E", folHlink: "5B7083",
  },
};
const H = THEME.colors; // hex, for hex-only options and layout backgrounds

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Python Data Engines: State of the Union 2026";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

const W = 13.333;
const MX = 0.6;
const CW = W - 2 * MX;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "TITLE",
  background: { color: H.dk1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.2, w: 11.7, h: 1.9, fontSize: 54, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.35, w: 11.0, h: 1.2, fontSize: 22, color: C.accent3, valign: "top", margin: 0 }, text: "" } },
  ],
});
const SECTION_KICKER = () => ({ placeholder: { options: { name: "kicker", type: "body", x: 0.8, y: 2.0, w: 11.7, h: 0.5, fontSize: 20, bold: true, color: C.accent3, charSpacing: 2, margin: 0 }, text: "" } });
const SECTION_TITLE = () => ({ placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.6, w: 11.7, h: 1.5, fontSize: 48, bold: true, color: C.background1, valign: "top", margin: 0 }, text: "" } });
const SECTION_NUMBER = { x: 12.2, y: 6.95, w: 0.6, h: 0.3, fontSize: 11, color: H.accent5, align: "right" };
pres.defineSlideMaster({
  title: "SECTION",
  background: { color: H.dk1 },
  objects: [
    SECTION_KICKER(), SECTION_TITLE(),
    { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.3, w: 10.5, h: 1.4, fontSize: 24, color: C.accent4, valign: "top", margin: 0 }, text: "" } },
  ],
  slideNumber: SECTION_NUMBER,
});
// A section header with no subtitle: no empty body placeholder left on the slide.
pres.defineSlideMaster({ title: "SECTION_BARE", background: { color: H.dk1 }, objects: [SECTION_KICKER(), SECTION_TITLE()], slideNumber: SECTION_NUMBER });
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: H.lt1 },
  margin: [0.5, 0.6, 0.7, 0.6],
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: MX, y: 0.4, w: CW, h: 0.9, fontSize: 34, bold: true, color: C.text1, valign: "middle", margin: 0 }, text: "" } },
    { text: { text: "Python Data Engines · State of the Union 2026", options: { x: MX, y: 6.95, w: 6, h: 0.3, fontSize: 11, color: H.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.3, fontSize: 11, color: H.accent5, align: "right" },
});
// A picture with no title: the CONTENT background, footer and slide number.
pres.defineSlideMaster({
  title: "SHOT",
  background: { color: H.lt1 },
  objects: [
    { text: { text: "Python Data Engines · State of the Union 2026", options: { x: MX, y: 6.95, w: 6, h: 0.3, fontSize: 11, color: H.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.3, fontSize: 11, color: H.accent5, align: "right" },
});
// One line, alone, on the dark background: no footer, no slide number.
pres.defineSlideMaster({
  title: "PUNCHLINE",
  background: { color: H.dk1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "center", x: 0.8, y: 2.0, w: 11.7, h: 3.5, fontSize: 60, bold: true, color: C.background1, valign: "middle", margin: 0 }, text: "" } },
  ],
});
// A content slide whose title is a statement of up to three lines.
pres.defineSlideMaster({
  title: "STATEMENT",
  background: { color: H.lt1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: MX, y: 0.4, w: CW, h: 2.4, fontSize: 30, bold: true, color: C.text1, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "Python Data Engines · State of the Union 2026", options: { x: MX, y: 6.95, w: 6, h: 0.3, fontSize: 11, color: H.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 6.95, w: 0.6, h: 0.3, fontSize: 11, color: H.accent5, align: "right" },
});

// ---------- click builds ----------
// at(n): everything added after it on the current slide appears on click n (0 = always visible).
// Elements are tagged through objectName "a<in>-<out>-<effect>-<in delay ms>-<out delay ms>-<uid>": shown on click
// <in>, hidden on click <out> (0 = never); addBuilds() turns the tags into PowerPoint animations.
let TAG = null, UID = 0;
const at = (n) => { TAG = n ? { enter: n, exit: 0, fx: "fade", delay: 0 } : null; };
function tagBuilds(s) {
  const tag = (o) => {
    if (TAG && !STILLS && o && !o.placeholder) o.objectName = `a${TAG.enter}-${TAG.exit}-${TAG.fx}-${Math.round(TAG.delay)}-${Math.round(TAG.outDelay ?? TAG.delay)}-${++UID}`;
  };
  for (const m of ["addText", "addShape"]) {
    const orig = s[m].bind(s);
    s[m] = (a, o) => { tag(o); return orig(a, o); };
  }
  const img = s.addImage.bind(s);
  s.addImage = (o) => { tag(o); return img(o); };
  TAG = null;
  return s;
}

// ---------- helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, ...o });

function card(slide, name, x, y, w, h, fill = C.background2) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" } });
}

const fs = require("fs");
const SHOTS = "c:/git/presentations/python-engine/shots/";
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function shot(slide, name, file, x, y, w, h) {
  const path = SHOTS + "crop_" + file + ".png";
  const { w: iw, h: ih } = pngSize(path);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name + "-frame", x, y, w, h, rectRadius: 0.1, fill: { color: "FAFAF9" }, line: { color: H.accent4, width: 1 } });
  const pad = 0.15, bw = w - 2 * pad, bh = h - 2 * pad;
  const r = iw / ih;
  const fw = bw / bh > r ? bh * r : bw, fh = bw / bh > r ? bh : bw / r;
  slide.addImage({ objectName: name, path, x: x + pad + (bw - fw) / 2, y: y + pad + (bh - fh) / 2, w: fw, h: fh, altText: "Dashboard screenshot: " + file });
}
function shotSlide(sectionTitle, title, file, caption, notes) {
  const s = content(sectionTitle, title, notes);
  shot(s, "shot-" + file, file, MX, 1.45, CW, caption ? 4.75 : 5.3);
  if (caption) at(1);
  if (caption) T(s, caption, { x: MX, y: 6.3, w: CW, h: 0.45, fontSize: 18, italic: true, color: C.text2 });
  return s;
}

function screenshot(slide, name, x, y, w, h, tab) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    objectName: name, x, y, w, h, rectRadius: 0.12,
    fill: { color: C.background2 }, line: { color: H.accent5, width: 1.25, dashType: "dash" },
  });
  T(slide, [
    { text: "Dashboard screenshot", options: { fontSize: 20, bold: true, color: C.text2, breakLine: true } },
    { text: tab, options: { fontSize: 16, color: C.accent1 } },
  ], { objectName: name + "-label", x, y, w, h, align: "center", valign: "middle" });
}

function stat(slide, name, x, y, w, big, label, color = C.accent1, bigSize = 54) {
  T(slide, big, { objectName: name + "-value", x, y, w, h: 1.0, fontSize: bigSize, bold: true, color, valign: "bottom" });
  T(slide, label, { objectName: name + "-label", x, y: y + 1.05, w, h: 0.8, fontSize: 16, color: C.text2, valign: "top" });
}

function line(slide, x1, y1, x2, y2, color, width = 1.5) {
  slide.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: (x2 < x1) !== (y2 < y1), line: { color, width },
  });
}

function section(title, kicker, heading, sub, notes) {
  pres.addSection({ title });
  const s = pres.addSlide({ masterName: sub ? "SECTION" : "SECTION_BARE", sectionTitle: title });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(heading.length > 30 ? [{ text: heading, options: { fontSize: 40 } }] : heading, { placeholder: "title" });  // a long heading on one line
  if (sub) s.addText(sub, { placeholder: "body" });
  if (notes) s.addNotes(notes);
  return s;
}

function content(sectionTitle, title, notes) {
  const s = tagBuilds(pres.addSlide({ masterName: "CONTENT", sectionTitle }));
  s.addText(title, { placeholder: "title" });
  if (notes) s.addNotes(notes);
  return s;
}

// ---------- the dashboard's own pictures, redrawn as shapes ----------
// docs/index.html draws its step-throughs as SVG from a pure function of the step: picture(t). The same
// functions are ported here, returning elements in the SVG's own units; stepped() turns the steps into clicks.
// An element that stays the same over a run of steps is one shape, shown on the click the run starts and hidden on
// the click after it ends, so a change (a colour, a counter, a caption) is a cross-fade, as on the site.

// The dashboard's light palette (docs/index.html :root).
const D = {
  bg: H.lt1, raised: "FFFFFF", ink: "0B0B0B", ink2: "52514E", ink3: "8A8984", grid: "D8D7D2", track: "F0EFEB",
  accent: "2A78D6", yes: "23955D", no: "C2412D", noop: "B07D00",
};
const ENGINE_COLOR = {
  duckdb_iceberg: "2A78D6", chdb_iceberg: "EB6834", polars_iceberg: "1BAF7A", lakesail_iceberg: "EDA100",
  daft_iceberg: "8A5CD1", pyspark_iceberg: "D6468F", pyspark_gluten_iceberg: "A8642A", starrocks_iceberg: "980067",
  trino_iceberg: "3C0FD9", pandas_iceberg: "932601", databend_iceberg: "99A7F9",
};
const LABEL = {
  duckdb_iceberg: "DuckDB", chdb_iceberg: "chDB", polars_iceberg: "Polars", lakesail_iceberg: "LakeSail",
  daft_iceberg: "Daft", pyspark_iceberg: "Spark-OSS", pyspark_gluten_iceberg: "Gluten/Velox",
  starrocks_iceberg: "StarRocks", trino_iceberg: "Trino", pandas_iceberg: "Pandas", databend_iceberg: "Databend",
};
// w of colour a over colour b: the SVG's colour-mix() and opacity.
function mix(a, b, w) {
  const ch = (h, i) => parseInt(h.slice(i, i + 2), 16);
  return [0, 2, 4].map((i) => Math.round(ch(a, i) * w + ch(b, i) * (1 - w)).toString(16).padStart(2, "0")).join("").toUpperCase();
}
const ghost = (c) => c && mix(c, D.bg, 0.15);  // .gone { opacity: .15 }

// Elements, in the SVG's units. z: boxes, lines, files, text.
const R = (x, y, w, h, o = {}) => ({ type: "rect", x, y, w, h, r: 0, fill: D.raised, line: D.grid, lw: 1.5, z: 0, ...o });
const Ov = (x, y, w, h, o = {}) => ({ ...R(x, y, w, h, o), type: "oval" });
const Tx = (x, y, text, o = {}) => ({ type: "text", x, y, text, px: 12, color: D.ink2, align: "l", z: 3, ...o });
const Ln = (x1, y1, x2, y2, o = {}) => ({ type: "line", x1, y1, x2, y2, color: mix(D.ink3, D.bg, 0.5), lw: 2, z: 1, ...o });
const gone = (els) => els.map((e) => ({ ...e, fill: ghost(e.fill), line: ghost(e.line), color: ghost(e.color) }));
const CAP = (text) => ({ type: "caption", text, z: 4 });

// The .arch classes (docs/index.html L256-288).
const T_ = { px: 15, bold: true, color: D.ink }, S_ = { px: 12, color: D.ink2 }, SI_ = { px: 12, bold: true, color: D.ink };
const LB_ = { px: 12, color: D.ink3 }, OK_ = { px: 13, bold: true, color: D.yes }, X_ = { px: 13, bold: true, color: D.no };
const lnCls = (cls) => ({
  live: { color: D.ink, lw: 3, dash: "sysDot" }, ok: { color: D.yes, lw: 3 }, no: { color: D.no, lw: 3 },
  off: { color: mix(D.ink3, D.bg, 0.15) },
}[cls] || {});
const arLine = (x1, y1, x2, y2, cls = "") => Ln(x1, y1, x2, y2, { arrow: true, ...lnCls(cls) });
const has = (cls, c) => cls.split(" ").includes(c);
const arBox = (b, cls, title, sub) => [
  R(b.x, b.y, b.w, b.h, {
    r: 14, fill: has(cls, "flash") ? mix(D.yes, D.raised, 0.3) : D.raised,
    line: has(cls, "ja") ? D.accent : has(cls, "cat") ? D.ink3 : D.grid,
    lw: has(cls, "ja") || has(cls, "cat") ? 2 : 1.5, dash: has(cls, "p") ? "dash" : undefined,
  }),
  Tx(b.x + 14, b.y + 26, title, T_),
  ...(sub ? [Tx(b.x + 14, b.y + 44, sub, S_)] : []),
];
const sbox = (cls) => ({
  r: 8, z: 0.5, fill: has(cls, "flash") ? mix(D.yes, D.raised, 0.3) : D.raised,
  line: has(cls, "ja") ? D.accent : D.ink3, lw: has(cls, "ja") ? 2 : 1.5, dash: has(cls, "p") ? "dash" : undefined,
});
const anNode = (cx, y, w, label, cls = "") => [R(cx - w / 2, y, w, 32, sbox(cls)), Tx(cx, y + 21, label, { ...SI_, align: "c" })];
const arSnap = (b, label, flash) => [R(b.x, b.y, b.w, b.h, sbox(flash ? "flash" : "")), Tx(b.x + 10, b.y + 16, label, SI_)];
function fileRect(x, y, w, h, cls, r = 3) {
  let fill = D.track, line = D.ink3, lw = 1, dash;
  if (has(cls, "read")) { fill = D.grid; line = D.grid; }
  if (has(cls, "hot")) { line = D.ink; lw = 2.5; }
  if (has(cls, "p")) { fill = null; lw = 1.5; dash = "sysDot"; }
  if (has(cls, "ja")) line = D.accent;
  if (has(cls, "jb")) line = D.noop;
  if (has(cls, "c") && (has(cls, "ja") || has(cls, "jb"))) fill = line;
  return R(x, y, w, h, { r, fill, line, lw, dash, z: 2 });
}
const arFiles = (x, y, classes) => classes.map((c, i) => fileRect(x + i * 17, y, 12, 16, c, 2));
const arKeeps = (b, text, x = b.x + 14, align = "l") => Tx(x, b.y + b.h + 18, text, { ...S_, align });

// Paint one element. M maps the SVG's units to the slide: origin (x, y) in inches, s inches per unit, f a font
// boost (the site's 12-15px text is small on a projector).
function paint(slide, el, M) {
  const X = (u) => M.x + u * M.s, Y = (u) => M.y + u * M.s, L = (u) => u * M.s;
  const pt = (w) => Math.max(0.75, w * M.s * 72 * (M.lf || 1));
  const line = (c, w, dash) => (c ? { color: c, width: pt(w), dashType: dash } : { type: "none" });
  const fill = (c) => (c ? { color: c } : { color: "FFFFFF", transparency: 100 });
  if (el.type === "rect" || el.type === "oval") {
    slide.addShape(el.type === "oval" ? pres.shapes.OVAL : el.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
      x: X(el.x), y: Y(el.y), w: L(el.w), h: L(el.h),
      ...(el.r && el.type === "rect" ? { rectRadius: Math.min(L(el.r), L(Math.min(el.w, el.h)) / 2) } : {}),
      fill: fill(el.fill), line: line(el.line, el.lw, el.dash),
    });
  } else if (el.type === "line") {
    slide.addShape(pres.shapes.LINE, {
      x: X(Math.min(el.x1, el.x2)), y: Y(Math.min(el.y1, el.y2)), w: L(Math.abs(el.x2 - el.x1)), h: L(Math.abs(el.y2 - el.y1)),
      flipH: el.x2 < el.x1, flipV: el.y2 < el.y1,
      line: { ...line(el.color, el.lw, el.dash), ...(el.arrow ? { endArrowType: "triangle" } : {}) },
    });
  } else if (el.type === "curve") {  // a cubic Bezier from (x1, y1) to (x2, y2), the SVG's "M C" edge
    const x0 = Math.min(el.x1, el.x2), y0 = Math.min(el.y1, el.y2);
    const P = (x, y) => ({ x: L(x - x0), y: L(y - y0) });
    slide.addShape(pres.shapes.CUSTOM_GEOMETRY, {
      x: X(x0), y: Y(y0), w: L(Math.abs(el.x2 - el.x1)), h: L(Math.abs(el.y2 - el.y1)),
      fill: fill(null), line: line(el.color, el.lw, el.dash),
      points: [P(el.x1, el.y1), { ...P(el.x2, el.y2), curve: { type: "cubic", ...rename(P(el.cx1, el.cy1), "1"), ...rename(P(el.cx2, el.cy2), "2") } }],
    });
  } else if (el.type === "text") {
    const size = el.pt || el.px * M.s * 72 * M.f, em = size / 72;
    const o = {
      isTextBox: true, margin: 0, fontSize: size, bold: !!el.bold, italic: !!el.italic, color: el.color,
      align: { l: "left", c: "center", r: "right" }[el.align],
    };
    const text = el.runs ? el.runs.map(([t, bold]) => ({ text: t, options: { bold } })) : el.text;
    if (el.h) {  // a paragraph: (x, y) is its top-left corner, and it wraps in w x h
      slide.addText(text, { ...o, x: X(el.x), y: Y(el.y), w: L(el.w), h: L(el.h), valign: "top", lineSpacingMultiple: 1.05 });
    } else {  // one line: (x, y) is the baseline, as in SVG
      const w = el.w ? L(el.w) : 6;
      const x = el.align === "c" ? X(el.x) - w / 2 : el.align === "r" ? X(el.x) - w : X(el.x);
      slide.addText(text, { ...o, x, y: Y(el.y) - 1.15 * em, w, h: 1.4 * em, valign: "bottom", wrap: false });
    }
  } else if (el.type === "caption") {
    slide.addText(el.text, { isTextBox: true, margin: 0, x: MX, y: 6.2, w: CW, h: 0.6, fontSize: 18, color: H.dk2, valign: "top" });
  }
}

const rename = (p, k) => ({ ["x" + k]: p.x, ["y" + k]: p.y });

// Fit a W x H picture into the slide's body, centred across.
function fit(W, H, f = 1, box = { x: MX, y: 1.45, w: CW, h: 4.6 }) {
  const s = Math.min(box.w / W, box.h / H);
  return { x: box.x + (box.w - W * s) / 2, y: box.y, s, f };
}

// One slide that steps through draw(t) for each t in steps, one click per step.
function stepped(sectionTitle, title, notes, steps, draw, M) {
  const frames = steps.map(draw), last = frames.length - 1;
  if (STILLS || FRAMES) {
    (STILLS ? [last] : frames.map((_, i) => i)).forEach((i) => {
      const s = content(sectionTitle, title, i ? null : notes);
      frames[i].forEach((el) => paint(s, el, M));
    });
    return;
  }
  const s = content(sectionTitle, title, notes);
  const runs = [], open = new Map();
  frames.forEach((els, i) => els.forEach((el, j) => {
    const sig = JSON.stringify(el), run = open.get(sig);
    if (run && run.end === i - 1) run.end = i;
    else { const r = { el, start: i, end: i, j }; open.set(sig, r); runs.push(r); }
  }));
  runs.sort((a, b) => a.el.z - b.el.z || a.start - b.start || a.j - b.j);
  for (const { el, start, end } of runs) {
    const exit = end < last ? end + 1 : 0;
    TAG = start || exit ? { enter: start, exit, fx: el.fx || "fade", delay: el.delay || 0 } : null;
    paint(s, el, M);
  }
  TAG = null;
}

// The Timeline tab (docs/index.html ERAS, L903; CSS L357-380): the eras land one at a time on a rail that draws
// itself. Units here are 1/100 inch.
const ERAS = [
  { when: "1990s", title: "The warehouse",
    text: "Storage and compute in one product. The engine owns the data; changing engine is a migration." },
  { when: "2006", title: "Big data: Hadoop",
    text: "Files spread over a cluster's disks. The data is open, but you need the cluster to read it." },
  { when: "2010s", title: "The cloud warehouse",
    text: "Elastic compute, but the tables live inside one vendor." },
  { when: "2017", title: "Open table formats",
    text: "Iceberg (Netflix), Hudi, Delta: tables in object storage, but writing one needed a Java cluster (Spark, Trino)." },
  { when: "Now", title: "The open lakehouse", now: true,
    text: "A REST catalog, and table libraries in Rust, C++ and Python: a library in a Python process writes the same tables as a cluster." },
];
function timelineEls(k) {
  const n = ERAS.length, gap = 22, cw = (CW * 100 - gap * (n - 1)) / n, railY = 30, top = 80;
  const col = (j) => j * (cw + gap), dot = (j) => col(j) + 40;
  const els = [R(24, railY, CW * 100 - 48, 7, { r: 3.5, fill: D.grid, line: null })];
  ERAS.forEach((e, j) => {
    if (j > k) return;
    const now = !!e.now, from = j ? dot(j - 1) : 24, d = 300;  // the rail reaches the dot, then the era lands
    els.push(R(from, railY, dot(j) - from, 7, { fill: mix(D.accent, D.ink3, j / (n - 1)), line: null, fx: "wipe", z: 0.2 }));
    els.push(R(col(j), top, cw, 400, {
      r: 20, fill: now ? mix(D.accent, D.raised, 0.08) : D.raised, line: now ? D.accent : D.grid, lw: now ? 3 : 1.2, delay: d,
    }));
    els.push(Ov(dot(j) - 15, railY - 12, 30, 30, { fill: now ? D.accent : D.ink3, line: D.bg, lw: 5, z: 0.4, delay: d }));
    els.push(Tx(col(j) + 22, top + 22, e.when, { pt: 40, bold: true, color: now ? D.accent : D.ink3, w: cw - 44, h: 70, delay: d }));
    els.push(Tx(col(j) + 22, top + 100, e.title, { pt: 21, bold: true, color: D.ink, w: cw - 44, h: 80, delay: d }));
    els.push(Tx(col(j) + 22, top + 185, e.text, { pt: 15, color: D.ink2, w: cw - 44, h: 200, delay: d }));
  });
  return els;
}

// The File pruning tab (pruningSvg, docs/index.html L2039-2094), wide layout. The query box is wider here, for
// the bigger text.
const PR_MONTHS = ["Jan", "Feb", "Mar"], PR_DAYS = ["1–10", "11–20", "21–31"], PR_GROUPS = ["11–13", "14–15", "16–18", "19–20"];
const PR_READ = [36, 36, 12, 4, 1, 1, 12, 1];
const PR_ROWS = ["Query", "Manifest list", "Manifest files", "Data files", "Row groups"];
const pruningSay = (t) => [
  "One day, 14 March, from a quarter: 9 files of 4 row groups.",
  "No pruning: open all 9 files, read all 36 row groups, keep one day.",
  "The manifest list has each manifest's partition range: January and February are skipped, unopened.",
  "The March manifest has min and max per file: only days 11–20 can hold the 14th.",
  "The Parquet footer has min and max per row group: read 1 of 4.",
  "1 row group of 36, before a single row was read.",
  "Random order: every March file spans days 1–31, so 12 row groups instead of 1.",
][t];
function pruningEls(t) {
  const mid = 500, box = 400, mc = [330, 500, 670], node = 150, fw = 28, fd = 54, rc = 670, rw = 32, rd = 56;
  const r = [10, 100, 180, 266, 360];
  const random = t === 6, groups = t >= 4;
  const isGone = (i) => t >= 2 && i < 2;
  const file = (i, k) => isGone(i) ? "" : t === 1 || (i === 2 && (random || (t >= 3 && k === 1))) ? "ja c" : i === 2 && t >= 3 ? "skip" : "";
  const els = PR_ROWS.map((name, i) => Tx(0, r[i] + (i ? i < 3 ? 21 : 20 : 33), name, T_));
  els.push(...arBox({ x: mid - box / 2, y: r[0], w: box, h: 56 }, t ? "cat" : "", "WHERE sale_date = '2026-03-14'",
    `row groups to read: ${PR_READ[t]} of 36`));
  els.push(...anNode(mid, r[1], node, "manifest list"), arLine(mid, r[0] + 60, mid, r[1] - 4));
  PR_MONTHS.forEach((m, i) => {
    const g = [arLine(mid, r[1] + 36, mc[i], r[2] - 4), ...anNode(mc[i], r[2], node, `month = ${m}`, i === 2 && t >= 2 ? "ja" : "")];
    PR_DAYS.forEach((d, k) => {
      const x = mc[i] + (k - 1) * fd, c = file(i, k);
      const f = [Ln(mc[i], r[2] + 32, x, r[3]), fileRect(x - fw / 2, r[3], fw, 30, c === "skip" ? "" : c),
        Tx(x, r[3] + 46, random && i === 2 ? "1–31" : d, { ...LB_, align: "c", w: 60 })];
      g.push(...(c === "skip" ? gone(f) : f));
    });
    els.push(...(isGone(i) ? gone(g) : g));
  });
  if (groups) PR_GROUPS.forEach((d, j) => {
    const x = rc + (j - 1.5) * rd, hot = random || j === 1;
    const g = [Ln(mc[2], r[3] + 52, x, r[4]), fileRect(x - rw / 2, r[4], rw, 22, hot ? "ja c" : ""),
      Tx(x, r[4] + 38, random ? "1–31" : d, { ...LB_, align: "c", w: 60 })];
    els.push(...(hot ? g : gone(g)));
  });
  els.push(CAP(pruningSay(t)));
  return els;
}

// The Concurrency tab's second scenario (duoSvg, docs/index.html L1855-1905), wide layout: two writers, one
// commit refused and retried.
const DUO_BATCHES = 3;
const duoDone = (t) => [Math.max(0, Math.min(DUO_BATCHES, t)), Math.max(0, Math.min(DUO_BATCHES, t - 1))];
const duoSay = (t) => [
  "Two jobs start at the same time, each in a new stateless runtime. Both start from snapshot x.",
  "Job A writes its first file. Readers do not see it.",
  "Job B writes too. The two jobs do not block each other.",
  "Both keep writing files. Nothing is visible yet.",
  "Job A is done first and commits: snapshot x+1.",
  "Job B is done and commits on top of snapshot x. The table is now at x+1, so the catalog refuses the commit.",
  "Job A only added files, so nothing clashes. Job B commits again on top of x+1: snapshot x+2. Its files are not written again.",
  "Both jobs stop. Snapshot x+2 has the files of both jobs. If both jobs had changed the same files, the retry would fail.",
][t];
function duoEls(t) {
  const done = duoDone(t), last = 7;
  const bk = { x: 0, y: 10, w: 200, h: 190 }, tb = { x: 560, y: 10, w: 300, h: 190 }, rt = { x: 265, y: 10, w: 180, h: 190 };
  const jobs = [{ x: 300, y: 54, w: 110, h: 56 }, { x: 300, y: 126, w: 110, h: 56 }], bkRows = [{ x: 14, y: 74 }, { x: 14, y: 146 }];
  const act = [
    t >= 1 && t <= 3 ? "write" : t === 4 ? "ok" : "",
    t >= 2 && t <= 4 ? "write" : t === 5 ? "no" : t === 6 ? "ok" : "",
  ];
  const status = [
    t === 0 ? "starting" : t <= 3 ? `batch ${done[0]} of ${DUO_BATCHES}` : t === 4 ? "commit" : "done",
    t <= 1 ? "starting" : t <= 4 ? `batch ${done[1]} of ${DUO_BATCHES}` : t === 5 ? "commit refused" : t === 6 ? "commit again" : "done",
  ];
  const els = arBox(bk, "", "Bucket", "CSV files");
  bkRows.forEach((r, j) => els.push(...arFiles(bk.x + r.x, r.y, Array.from({ length: DUO_BATCHES }, (_, i) =>
    act[j] === "write" && i === done[j] - 1 ? "hot" : i < done[j] ? "read" : ""))));
  const top = { x: tb.x + 14, y: tb.y + 40, w: tb.w - 28, h: 48 }, low = { ...top, y: top.y + 56 };
  const fx = top.x + 10, aFiles = (cls) => Array(done[0]).fill(`ja ${cls}`), bFiles = (cls) => Array(done[1]).fill(`jb ${cls}`);
  els.push(...arBox(tb, "cat", "Catalog · table"), arKeeps(bk, "keeps the files"), arKeeps(tb, "keeps the table"));
  const runtime = [R(rt.x, rt.y, rt.w, rt.h, { r: 14, fill: null, line: D.ink3, lw: 2, dash: "dash" }),
    Tx(rt.x + 14, rt.y + 26, "Stateless runtimes", T_), arKeeps(rt, "keeps nothing")];
  els.push(...(t === last ? gone(runtime) : runtime));
  if (t < 4) {
    els.push(Tx(fx, top.y + 16, done[0] ? "new files" : "", LB_), ...arFiles(fx, top.y + 24, aFiles("p")), ...arFiles(fx, low.y + 24, bFiles("p")));
  } else if (t < 6) {
    els.push(...arSnap(top, "snapshot x+1", t === 4), ...arFiles(fx, top.y + 24, aFiles("c")),
      Tx(fx, low.y + 16, "new files", LB_), ...arFiles(fx, low.y + 24, bFiles("p")));
  } else {
    els.push(...arSnap(top, "snapshot x+2", t === 6), ...arFiles(fx, top.y + 24, [...aFiles("c"), ...bFiles("c")]),
      ...arSnap(low, "snapshot x+1"), ...arFiles(fx, low.y + 24, aFiles("c")));
  }
  const off = t === last ? "off" : "";
  jobs.forEach((job, i) => {
    const a = act[i], y = job.y + job.h / 2;
    const label = a === "ok" ? [OK_, "commit ✓"] : a === "no" ? [X_, "✕ refused"] : i === 0 ? [LB_, "write"] : null;
    els.push(arLine(bk.x + bk.w + 4, y, job.x - 4, y, a === "write" ? "live" : off),
      arLine(job.x + job.w + 4, y, tb.x - 4, y, a === "write" ? "live" : a || off));
    if (i === 0) els.push(Tx((bk.x + bk.w + job.x) / 2, y - 8, "read", { ...LB_, align: "c", w: 80 }));
    if (label) els.push(Tx((job.x + job.w + tb.x) / 2, y - 8, label[1], { ...label[0], align: "c", w: 140 }));
  });
  jobs.forEach((job, i) => {
    const g = [R(job.x, job.y, job.w, job.h, { r: 10, fill: D.raised, line: i ? D.noop : D.accent, lw: act[i] === "write" ? 3.5 : 2, z: 0.5 }),
      Tx(job.x + job.w / 2, job.y + 24, `Job ${i ? "B" : "A"}`, { ...T_, align: "c", w: job.w }),
      Tx(job.x + job.w / 2, job.y + 43, status[i], { ...S_, align: "c", w: job.w + 40 })];
    els.push(...(t === last ? gone(g) : g));
  });
  els.push(CAP(duoSay(t)));
  return els;
}

// The benchmark bars (docs/index.html L512-753), from the dashboard's own data files and its one aggregation: each
// engine's mean over its last 3 complete runs.
const RECENT_RUNS = 3;
const SUITES = {
  etl: { id: "etl", csv: "etl_results.csv", caption: (n) => `Read ${n.toLocaleString("en")} CSVs and write one Iceberg table.` },
  tpch: { id: "tpch", csv: "tpch_results.csv", queries: 22, sfs: [10, 30, 100, 300],
    caption: (n) => `Total cold seconds for all 22 queries at scale factor ${n}.` },
  tpcds: { id: "tpcds", csv: "tpcds_results.csv", queries: 99, sfs: [10, 30, 100],
    caption: (n) => `Total cold seconds for all 99 queries at scale factor ${n}.` },
};
function parseCSV(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') quoted = false; else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}
function summarize(suite, sf) {
  const runs = new Map();
  for (const r of parseCSV(fs.readFileSync("c:/git/bench/docs/data/" + suite.csv, "utf8"))) {
    if (r.test !== suite.id || +r.sf !== sf) continue;
    const key = `${r.engine}|${r.run_id}`;
    let run = runs.get(key);
    if (!run) runs.set(key, run = { engine: r.engine, started: "", dur: 0, ok: 0, load: null, error: false });
    if (r.run_started_at > run.started) run.started = r.run_started_at;
    if (suite.queries) {
      if (r.run_type === "cold" && r.phase === "query") { run.dur += +r.dur || 0; run.ok += r.status === "ok"; }
    } else if (r.phase === "load") {
      if (r.status === "ok" && r.dur) run.load = +r.dur; else if (r.status === "error") run.error = true;
    }
  }
  const by = {};
  for (const run of runs.values()) (by[run.engine] ??= []).push(run);
  return Object.entries(by).map(([engine, list]) => {
    list.sort((a, b) => b.started.localeCompare(a.started));
    const window = suite.queries ? list.filter((r) => r.ok === suite.queries).slice(0, RECENT_RUNS) : list.slice(0, RECENT_RUNS);
    const values = window.map((r) => (suite.queries ? r.dur : r.load)).filter((v) => v != null);
    if (!values.length) return suite.queries || window.some((r) => r.error) ? { engine, failed: true } : null;
    return { engine, mean: values.reduce((a, b) => a + b, 0) / values.length };
  }).filter(Boolean).sort((a, b) => (a.mean ?? Infinity) - (b.mean ?? Infinity));
}
const fmt = (s) => (s >= 100 ? `${Math.round(s).toLocaleString("en")}s` : `${s.toFixed(1)}s`);
const ratio = (r) => (r < 10 ? `${r.toFixed(1)}×` : `${Math.round(r)}×`);
// Step 0: the caption; step 1 (one click): the rows land 45 ms apart and each bar grows from the left.
function barsEls(suiteId, sf, shown) {
  const suite = SUITES[suiteId], items = summarize(suite, sf), W = CW * 100;
  const els = [Tx(0, 24, suite.caption(sf), { pt: 16, color: D.ink2 })];
  if (!shown) return els;
  const ok = items.filter((i) => !i.failed), top = Math.max(...ok.map((i) => i.mean), 1), fastest = ok[0]?.mean;
  const name = 200, lane = W - name - 20, rowH = Math.min(46, 385 / items.length);
  items.forEach((it, i) => {
    const y = 50 + i * rowH, bh = rowH * 0.66, cy = y + rowH / 2, d = i * 45;
    els.push(Tx(name - 16, cy + 7, LABEL[it.engine] ?? it.engine, { pt: 16, bold: true, color: D.ink, align: "r", w: 300, delay: d }));
    if (it.failed) {
      els.push(R(name, cy - bh / 2, 40, bh, { fill: D.grid, line: null, fx: "wipe", delay: d }),
        Tx(name + 56, cy + 6, "failed", { pt: 14, italic: true, color: D.ink3, delay: d }));
      return;
    }
    const w = (lane - 170) * (it.mean / top);
    els.push(R(name, cy - bh / 2, w, bh, { fill: ENGINE_COLOR[it.engine] || D.ink3, line: null, fx: "wipe", delay: d }));
    els.push(Tx(name + w + 14, cy + 6, "", {
      pt: 14, color: D.ink, delay: d + 400,
      runs: [[fmt(it.mean), false], ...(i ? [[`  ·  ${ratio(it.mean / fastest)}`, false]] : [])],
    }));
  });
  return els;
}
function barsSlide(sectionTitle, title, suiteId, sf, caption, notes) {
  stepped(sectionTitle, title, notes, [false, true], (shown) => [
    ...barsEls(suiteId, sf, shown), ...(caption ? [CAP(caption)] : []),
  ], { x: MX, y: 1.45, s: 0.01, f: 1 });
}

// The Query plans tab (docs/index.html L1307-1684), one plan per slide: the engine's executed plan, read from the
// same data/plans/*.json. One click runs it as the tab's race does: each step lights up when its engine reached it,
// on the engine's own clock scaled to `screen` ms, and the plan that died ends on its error.
const nfmt = (x) => x == null ? "?" : x < 1e3 ? `${Math.round(x)}` : x < 1e6 ? `${(x / 1e3).toFixed(x < 1e4 ? 1 : 0)}K`
  : x < 1e9 ? `${(x / 1e6).toFixed(x < 1e7 ? 1 : 0)}M` : x < 1e12 ? `${(x / 1e9).toFixed(x < 1e10 ? 1 : 0)}B`
  : x < 1e15 ? `${(x / 1e12).toFixed(x < 1e13 ? 1 : 0)} trillion` : `${(x / 1e15).toFixed(x < 1e16 ? 1 : 0)} quadrillion`;
const gib = (b) => `${(b / 2 ** 30).toFixed(b < 10 * 2 ** 30 ? 1 : 0)} GiB`;
const secs = (x) => x == null ? "?" : x >= 100 ? `${Math.round(x)} s` : `${x.toFixed(1)} s`;
const walkPlan = (n, f) => { f(n); n.children.forEach((c) => walkPlan(c, f)); };
const allNodes = (root) => { const out = []; if (root) walkPlan(root, (n) => out.push(n)); return out; };
const flow = (n) => n.rows ?? n.est ?? 0;
// Each step starts when its inputs are done and takes its share of the engine's real time (schedule, L1559).
function schedule(plan) {
  const nodes = allNodes(plan.root), timed = nodes.some((n) => (n.seconds ?? 0) > 0);
  const weight = (n) => timed ? Math.max(n.seconds ?? 0, 0.001) : Math.log10(flow(n) + 10);
  (function f(n) { n._s = Math.max(0, ...n.children.map(f)); n._e = n._s + weight(n); return n._e; })(plan.root);
  const k = (plan.seconds || 1) / plan.root._e;
  for (const n of nodes) { n._s *= k; n._e *= k; n._show = n._s; }
  walkPlan(plan.root, (n) => n.children.forEach((c) => { if (c.kind === "scan") c._show = n._s; }));
}
// The spine layout, sideways (drawTree, L1411): the root on the right, a node's biggest input straight left of it.
function planEls(plan, aspect, at, inch) {
  const Y = 48, PAD = 30, color = ENGINE_COLOR[plan.engine];
  const size = (n) => n._n ??= 1 + n.children.reduce((a, c) => a + size(c), 0);
  const height = (n) => n._h ??= 1 + Math.max(0, ...n.children.map(height));
  const right = [];
  let depth = 0;
  (function place(n, x, d) {
    n._x = x; n._d = d; depth = Math.max(depth, d);
    right[d] = Math.max(right[d] ?? 0, x + 1);
    [...n.children].sort((a, b) => size(b) - size(a)).forEach((c, i) => {
      let col = x;
      if (i) { col = x + 1; for (let k = d + 1; k <= d + height(c); k++) col = Math.max(col, right[k] ?? 0); }
      place(c, col, d + 1);
    });
  })(plan.root, 0, 0);
  const H = Math.max(Math.max(...right), 2) * Y + PAD + 12;
  const X = Math.round(Math.min(150, Math.max(40, (H * aspect - PAD - 40) / (depth + 1)))), W = (depth + 1) * X + PAD + 40;
  const px = (n) => PAD + 20 + (depth - n._d) * X, py = (n) => PAD + 12 + n._x * Y;
  const radius = (n) => n.kind === "scan" ? 7 : Math.min(24, X / 2 - 4, Math.max(8, 4 + 2.4 * Math.log10(flow(n) + 1)));
  const width = (n) => Math.min(16, 1 + 1.5 * Math.log10(flow(n) + 1));
  const glyph = { join: "⋈", agg: "Σ", sort: "↓" };
  const els = [], at_ = new Map(allNodes(plan.root).map((n) => [`${n._x},${n._d}`, n]));
  for (const n of allNodes(plan.root)) {
    const x = px(n), y = py(n), r = radius(n), show = at(n._show), guess = n.rows == null && n.est != null;
    for (const c of n.children) {  // the line into a step draws itself as that step starts
      const cx = px(c), cy = py(c), mx = (cx + x) / 2;
      const o = { color: mix(color, D.bg, 0.45), lw: width(c), dash: c.rows == null && c.est != null ? "sysDash" : undefined, fx: "wipe", delay: at(n._s), z: 0 };
      els.push(cy === y ? Ln(cx, cy, x, y, o) : { type: "curve", x1: cx, y1: cy, cx1: mx, cy1: cy, cx2: mx, cy2: y, x2: x, y2: y, ...o });
    }
    els.push(Ov(x - r, y - r, 2 * r, 2 * r, {
      fill: D.raised, line: n.cross ? D.no : D.ink3, lw: n.cross ? 3 : 1.5, dash: n.cross ? "dash" : guess ? "sysDot" : undefined, z: 1, delay: show,
    }));
    const g = n.cross ? "×" : r >= 11 ? glyph[n.kind] : "";
    if (g) els.push(Tx(x, y + 5, g, { px: 13, bold: true, color: n.cross ? D.no : D.ink2, align: "c", w: 40, delay: show }));
    const count = n.rows == null ? (n.est != null ? `~${nfmt(n.est)}` : "") : nfmt(n.rows);
    if (count) els.push(Tx(x, y - r - 4, count, { px: 12, bold: true, color: n.cross ? D.no : D.ink, align: "c", w: 160, delay: show }));
    // Table names: when the columns are tight, every other one a line lower (drawTree's drop).
    const drop = X * inch < 1.1 && n._d % 2 ? 13 : 0;
    // A table name under a scan that would run into the count of the node right below it is left out.
    const below = at_.get(`${n._x + 1},${n._d}`);
    const room = below ? (Y - (r + 13 + drop) - (radius(below) + 4)) * inch : 1;  // name baseline to the count's baseline below
    if (n.kind === "scan" && room > 0.17) els.push(Tx(x, y + r + 13 + drop, n.label.length > 10 ? n.label.slice(0, 9) + "…" : n.label, { px: 11, color: D.ink2, align: "c", w: 160, delay: show }));
  }
  return { W, H, els };
}
const PLANS = {};
const loadPlan = (file) => PLANS[file] ??= JSON.parse(fs.readFileSync(`c:/git/bench/docs/data/plans/${file}.json`, "utf8"));
// The largest intermediate result: the most rows any step after a scan makes (its guess if the query died first).
const peakOf = (plan) => allNodes(plan.root).filter((n) => n.kind !== "scan").sort((a, b) => flow(b) - flow(a))[0];
const peakText = (plan) => { const n = peakOf(plan); return `${n.rows == null ? "~" : ""}${nfmt(flow(n))}`; };
function planSlide(sectionTitle, title, file, screen, caption, notes, { peak = true, name: label } = {}) {
  const plan = loadPlan(file);
  const s = content(sectionTitle, title, notes), still = STILLS || FRAMES;
  schedule(plan);
  const died = plan.status === "error", name = label ?? LABEL[plan.engine], end = screen + 200;
  const at = (t) => (t / plan.seconds) * screen;  // engine seconds -> ms of screen time after the click
  const draw = (el, M) => {
    if (still && el.out != null) return;  // a clock tick: the still shows only the end
    TAG = still || (el.delay == null && el.out == null) ? null
      : { enter: el.delay == null ? 0 : 1, exit: el.out != null ? 1 : 0, fx: el.fx || "fade", delay: el.delay ?? 0, outDelay: el.out };
    paint(s, el, M);
  };
  // Header, as the tab's card: engine, scale, peak memory, largest intermediate result; the clock on the right.
  const M0 = { x: MX, y: 1.4, s: 0.01, f: 1 };
  [R(0, 6, 22, 22, { r: 5, fill: ENGINE_COLOR[plan.engine], line: null }),
    Tx(34, 30, name, { pt: 24, bold: true, color: D.ink }),
    Tx(0, 62, "", { pt: 14, color: D.ink2, w: 900, runs: [[`TPC-DS-like SF ${plan.sf}`, true],
      ...(plan.peak_memory_bytes ? [[" · peak memory ", false], [gib(plan.peak_memory_bytes), true]] : []),
      ...(peak ? [[" · largest intermediate result ", false], [peakText(plan), true], [" rows", false]] : [])] }),
  ].forEach((el) => draw(el, M0));
  const ticks = 12, clock = { pt: 36, bold: true, color: D.ink, align: "r", w: 300 };
  for (let k = 0; k < ticks; k++) {
    draw(Tx(CW * 100, 40, secs((k / ticks) * plan.seconds), { ...clock, delay: k ? at((k / ticks) * plan.seconds) : undefined, out: at(((k + 1) / ticks) * plan.seconds) }), M0);
  }
  draw(Tx(CW * 100, 40, `${died ? "✗" : "✓"} ${secs(plan.seconds)}`, { ...clock, color: died ? D.no : D.yes, delay: end }), M0);
  const badges = died
    ? [[`spilled ${gib(plan.spill_bytes)}`, D.no], [/memory/i.test(plan.error || "") ? "out of memory" : "failed", D.no]]
    : [["done", D.yes]];
  let bx = CW * 100;
  badges.reverse().forEach(([text, c]) => {
    const w = text.length * 9 + 30;
    bx -= w;
    draw(R(bx, 48, w, 26, { r: 13, fill: mix(c, D.raised, 0.16), line: null, delay: end }), M0);
    draw(Tx(bx + w / 2, 67, text, { pt: 12, bold: true, color: c, align: "c", w, delay: end }), M0);
    bx -= 8;
  });
  // The tree, in the body.
  const box = { x: MX, y: 2.15, w: CW, h: 3.95 };
  const probe = planEls(plan, box.w / box.h, at, 0);
  const { W, H, els } = planEls(plan, box.w / box.h, at, fit(probe.W, probe.H, 1, box).s);
  const M = fit(W, H, 1, box);
  M.f = Math.max(1, 9 / (11 * M.s * 72));  // no tree text under 9 pt
  M.lf = Math.min(1, 8 / (16 * 72 * M.s));  // the thickest line (16 units) at most 8 pt
  els.sort((a, b) => a.z - b.z).forEach((el) => draw(el, M));
  if (died) draw(Tx(CW * 55, 40, /memory/i.test(plan.error || "") ? "Out of memory" : "Query failed",
    { pt: 36, bold: true, color: D.no, align: "c", w: 600, delay: end + 300 }), M0);
  TAG = null;
  if (caption) paint(s, CAP(caption), M0);
}

// ---------- 0. Opening ----------
pres.addSection({ title: "Opening" });
{
  const s = pres.addSlide({ masterName: "TITLE", sectionTitle: "Opening" });
  s.addText("Python Data Engines: State of the Union 2026", { placeholder: "title" });
  s.addText("Every Python data engine looks impressive when you throw a 64-core machine at it. That is not this talk.", { placeholder: "body" });
}

{
  // Just the section titles.
  const s = content("Opening", "Agenda");
  const items = ["What changed since 2025", "Iceberg", "The engines", "What does “fast” mean?", "Real-life use case", "What I learned"];
  T(s, items.flatMap((t, k) => [
    { text: String(k + 1).padStart(2, "0") + "   ", options: { bold: true, color: C.accent1 } },
    { text: t, options: { color: C.text1, breakLine: k < items.length - 1 } },
  ]), { x: MX, y: 1.5, w: CW, h: 5.2, fontSize: 26, valign: "top", paraSpaceAfter: 8 });
}

// ---------- 1. What changed since 2025 ----------
// One slide, three themes, one per click; the detail is spoken, from the notes.
pres.addSection({ title: "01 What changed since 2025" });
{
  // LEARNING.md, Polars: the main build and the optimizer PRs; the times are the dashboard's TPC-DS-like SF100 bars.
  const ds = summarize(SUITES.tpcds, 100).filter((i) => !i.failed);
  const pl = ds.find((i) => i.engine === "polars_iceberg"), next = ds.find((i) => i.engine !== "polars_iceberg");
  const s = content("01 What changed since 2025", "What changed since 2025",
    `I gave this talk last year: Life Beyond Pandas, 2 cores, Delta. This is what changed. ` +
    `SQL. Polars: The surprise of the year. I knew Polars as a DataFrame library, with SQL on the side. Now it runs all 99 TPC-DS-like queries in SQL at scale factor 100 in ${fmt(pl.mean)}, the fastest of every engine here; next is ${LABEL[next.engine]} at ${fmt(next.mean)}, on the same 4-core box. On 2.0.0-rc.2 its streaming engine killed the runner at TPC-H-like SF30. What changed is optimizer work on 2.0 and main between August and October 2026: join reordering that uses scan statistics (#28985, #29038), dynamic predicates for hash joins (#29312), bloom filters pushed into the probe side (#29423). Before that, joins ran in the order the SQL wrote them, and TPC-DS star joins suffered most. It also fixed most of the SQL gaps I reported. This is a main build, not a release. Given enough time, every DataFrame library becomes a database. ` +
    `Iceberg. Very important. The expectation has changed: supporting Iceberg is now a no-brainer, and a missing feature is treated as a bug. Polars accepts SQL parity gaps as bugs. That's interesting. The biggest change since the 2025 talk (Life Beyond Pandas, 2 cores, Delta). Last year every engine wrote through delta-rs: the scorecard's native table SQL syntax row was red for DuckDB, Polars, Daft, chDB and DataFusion, and in the streaming CSV write LakeSail and DataFusion failed while Polars loaded everything in memory. This year every engine writes Iceberg itself, and with SQL. Python engines that run SQL and write Iceberg are the new normal. ` +
    `AI. It's very good at reproducing bugs: it drafts the repro, I check it, one bug per issue. ` +
    `Python engines aren't niche anymore. They're mainstream, and a bit boring.`);
  const themes = [
    ["SQL", ["Polars SQL went from a side feature to all 99 TPC-DS-like queries.",
      "Given enough time, every DataFrame library becomes a database."]],
    ["Iceberg", ["Iceberg is the new baseline.",
      "Last year most of these engines couldn’t write a table; now they all write Iceberg."]],
    ["AI", ["It’s very good at reproducing bugs."]],
  ];
  // Every line on its own click; a theme's name comes with its first line.
  let y = 1.55, click = 0;
  for (const [theme, lines] of themes) {
    lines.forEach((t, i) => {
      at(++click);
      if (i === 0) T(s, theme, { x: MX, y: y - 0.05, w: 2.2, h: 0.5, fontSize: 26, bold: true, color: C.accent1 });
      T(s, t, { x: MX + 2.5, y, w: CW - 2.5, h: 0.4, fontSize: 20, color: C.text1, valign: "middle" });
      y += 0.45;
    });
    y += 0.3;
  }
  at(++click);
  T(s, "Python engines aren’t niche anymore. They’re mainstream, and a bit boring.", { x: MX, y: y + 0.2, w: CW, h: 0.6, fontSize: 24, bold: true, color: C.accent2 });
}

{
  const s = pres.addSlide({ masterName: "PUNCHLINE", sectionTitle: "01 What changed since 2025" });
  s.addText("The DataFrame API used to be a pain point. For a couple of months now, I don’t care.", { placeholder: "title" });
  s.addNotes("The DataFrame API used to be my biggest pain point: a different syntax for every engine, and no standard. For a couple of months now, I don't care.");
}

// ---------- 2. Iceberg ----------
section("02 Iceberg", "02", "Iceberg", "All engines are equal, as long as they speak the same spec.",
  "Not long ago your data lived inside an engine. Changing engine meant migrating.");
stepped("02 Iceberg", "How we got here",
  "From the dashboard's Lakehouse tab, Timeline. 1990s the warehouse: storage and compute in one product, changing engine is a migration. 2006 Hadoop: open files, but storage and compute on the same boxes, because in 2006 the network was the bottleneck. 2010s the cloud warehouse: elastic compute, but the tables live inside one vendor. 2017 open table formats: Iceberg started at Netflix; writing a table still needed a Java cluster. Now: a REST catalog, and a library in a Python process writes the same tables as a cluster.",
  [-1, 0, 1, 2, 3, 4], timelineEls, { x: MX, y: 1.45, s: 0.01, f: 1 });
shotSlide("02 Iceberg", "The open lakehouse", "overview", null,
  "From the dashboard's Overview. Files in an object store, the state in a catalog, compute in any engine, and none of them owns the data. The job moves from engine to engine; every one commits to the same catalog. Small projects now get treated the same as big commercial and veteran open-source ones.");
stepped("02 Iceberg", "The catalog is the referee",
  "From the Concurrency tab. Two jobs write at the same time, each in a stateless runtime, both from snapshot x. Job A commits first. Job B commits on top of x; the table is at x+1, so the catalog refuses it. Job A only added files, so nothing clashes: job B commits again on top of x+1, and its files are not written again. We'll see in the Iceberg grid that concurrent appends work on almost every engine.",
  [...Array(8).keys()], duoEls, fit(860, 230, 1.15));

// ---------- 3. Engines and AI ----------
// Every engine tried, from the dashboard: the Engines tab's rows (in the bench) plus its "Tried, not added" list.
const TRIED = (() => {
  const html = fs.readFileSync("c:/git/bench/docs/index.html", "utf8");
  const rows = html.slice(html.indexOf("const ENGINE_ROWS = ["), html.indexOf("const ENGINE_NOTES")).match(/\{ engine: "/g).length;
  const t = html.indexOf("<h3>Tried, not added</h3>"), list = html.slice(t, html.indexOf("</ul>", t));
  const names = [...list.matchAll(/<li><b>([^<]+)<\/b>/g)].map((m) => m[1]);
  return { inBench: rows, notAdded: names, total: rows + names.length };
})();
section("03 Engines", "03", "The engines", `${TRIED.total} engines tried, one catalog, one small box.`,
  `Every engine I tried counts, including the ones that didn't make it. ${TRIED.inBench} are in the bench: nine run the SQL suites, and Daft and pandas run the ETL. ${TRIED.notAdded.length} were tried and not added: ${TRIED.notAdded.join(", ")}. Each one is on the Engines tab with the reason.`);
{
  const s = content("03 Engines", "Disclosure: what this runs on",
    "Free GitHub runners, 4 cores / 16 GB. OneLake Catalog, because I get it free through my job.");
  at(1);
  card(s, "runner-card", MX, 1.7, 5.9, 3.4);
  T(s, "Compute", { x: MX + 0.4, y: 1.95, w: 5.1, h: 0.4, fontSize: 18, bold: true, color: C.accent1 });
  T(s, "Free GitHub runners", { x: MX + 0.4, y: 2.45, w: 5.1, h: 0.7, fontSize: 30, bold: true, color: C.text1 });
  T(s, "4 cores · 16 GB", { x: MX + 0.4, y: 3.3, w: 5.1, h: 0.9, fontSize: 44, bold: true, color: C.accent1 });
  at(2);
  card(s, "catalog-card", MX + 6.3, 1.7, 5.8, 3.4);
  T(s, "Catalog", { x: MX + 6.7, y: 1.95, w: 5.0, h: 0.4, fontSize: 18, bold: true, color: C.accent1 });
  T(s, "OneLake Catalog", { x: MX + 6.7, y: 2.45, w: 5.0, h: 0.7, fontSize: 30, bold: true, color: C.text1 });
  T(s, "Free through my job :)", { x: MX + 6.7, y: 3.3, w: 5.0, h: 0.9, fontSize: 28, color: C.text2 });
}
shotSlide("03 Engines", "Who they are", "engines", null,
  "From the dashboard's Engines tab: who started each engine, what it's written in and how it runs (the tab also has who governs it, the licence and how you install it). The subject is the Python engines: DuckDB, Polars, chDB, LakeSail. The cluster engines are there as a reference: Spark, Spark with Gluten/Velox, Trino, StarRocks, Databend. All of them talk to the same catalog; none of them needed anything special.");
// Why DataFusion is not in the bench: the dashboard's "Tried, not added" list (datafusion-python#1097, apache/datafusion-iceberg).
{
  const s = content("03 Engines", "Why DataFusion isn’t here",
    "DataFusion is everywhere: LakeSail and DataFusion Comet are built on it. But as an engine you use directly from Python, not really. The Python package has no Iceberg support: no catalog, no scan, no write (datafusion-python#1097). The Iceberg table provider is a separate repo, apache/datafusion-iceberg: it reads and writes, but it is Rust only and has no release yet. So it is not in the bench.");
  const lines = [
    "It’s everywhere: LakeSail and DataFusion Comet are built on it.",
    "The Python package has no Iceberg: no catalog, no scan, no write.",
    "Iceberg support is a separate repo, apache/datafusion-iceberg: Rust only, no release yet.",
  ];
  lines.forEach((t, i) => {
    at(i + 1);
    T(s, t, { x: MX, y: 1.8 + i * 1.0, w: CW, h: 0.6, fontSize: 24, color: C.text1, valign: "middle" });
  });
  T(s, "datafusion-python#1097", { x: MX, y: 6.3, w: CW, h: 0.4, fontSize: 14, color: C.text2 });
}
shotSlide("03 Engines", "The Iceberg support grid", "iceberg", null,
  "Speed doesn't matter if the engine can't do your operation. The good news first: create, append, file pruning, time travel and concurrent appends work almost everywhere. Then the differences: who does MERGE, DELETE, partition evolution, branches. Pick on this, not on speed. Side note: Spark has the best fault tolerance and the widest coverage.");

// ---------- 4. Fast ----------
section("04 Fast", "04", "What does “fast” mean?", "The best query is no query.");
// The File pruning tab, one still each: its last step sorted, then the same table in random order.
stepped("04 Fast", "File skipping",
  "File skipping is what makes things fast. From the File pruning tab: one day, 14 March, from a quarter, 9 files of 4 row groups. The manifest list holds each manifest's partition range, so January and February are skipped unopened. The March manifest has min and max per file: only days 11-20 can hold the 14th. The Parquet footer has min and max per row group: read 1 of 4. 1 row group of 36, before a single row was read. Some engines answer MAX from the metadata without reading a data file at all.",
  [5], pruningEls, fit(780, 430, 1.35));
stepped("04 Fast", "The importance of sorting data",
  "But file skipping only works if the data is reasonably well sorted. The same table written in random order: every March file spans days 1 to 31, so min and max rule nothing out under the partition, and you read 12 row groups instead of 1. The statistics only help if the data is laid out for them: sort on what you filter.",
  [6], pruningEls, fit(780, 430, 1.35));
{
  // General explainer, not a bench result: same data, few big files or many small ones. Static, no clicks.
  const s = content("04 Fast", "The small-file problem",
    "A general one, not from the bench. Take the same 1 GB of data and write it two ways: 8 files of 128 MB, or 8,000 files of 128 KB. The engine pays per file before it reads a single row: a request to object storage, a Parquet footer to read, an entry in the manifest to plan with. With 8 files that overhead is noise. With 8,000 it is most of the run: the engine spends its time opening files, not reading them. Small files also mean tiny row groups, so worse compression and less work per vector, and bigger manifests, so slower planning. They come from frequent small appends, streaming, small MERGEs, and too many partitions. The fix is compaction: rewrite small files into big ones, which Iceberg calls rewrite_data_files, and batch your writes. Iceberg's default target file size is 512 MB. Who can compact is on the Iceberg grid.");
  T(s, "The same 1 GB of data, written two ways.", { x: MX, y: 1.5, w: CW, h: 0.5, fontSize: 22, color: C.text2 });
  card(s, "files-few", MX, 2.2, 5.6, 2.7);
  T(s, "8 files of 128 MB", { x: MX + 0.45, y: 2.45, w: 4.7, h: 0.45, fontSize: 18, bold: true, color: C.accent5 });
  T(s, "8 opens, 8 footers,\n8 manifest entries.", { x: MX + 0.45, y: 3.0, w: 4.7, h: 1.7, fontSize: 28, bold: true, color: C.text2 });
  card(s, "files-many", MX + 6.0, 2.2, CW - 6.0, 2.7, C.text1);
  T(s, "8,000 files of 128 KB", { x: MX + 6.45, y: 2.45, w: CW - 6.9, h: 0.45, fontSize: 18, bold: true, color: C.accent6 });
  T(s, "8,000 opens, 8,000 footers,\n8,000 manifest entries.", { x: MX + 6.45, y: 3.0, w: CW - 6.9, h: 1.7, fontSize: 28, bold: true, color: C.background1 });
  T(s, "Every file costs a request to storage before a single row is read.", { x: MX, y: 5.15, w: CW, h: 0.6, fontSize: 22, color: C.accent1 });
  T(s, "Compact into a few big files. Iceberg’s default target is 512 MB.", { x: MX, y: 5.85, w: CW, h: 0.6, fontSize: 24, bold: true, color: C.accent2 });
}
{
  // One pair: the same query on DuckDB before and after duckdb#27493. Every number here is read from the plan files.
  const q64 = ["tpcds_q64_duckdb_2_0_iceberg_sf100", "tpcds_q64_duckdb_iceberg_sf100"].map(loadPlan);
  planSlide("04 Fast", "Q64 on DuckDB 2.0: a bad guess", "tpcds_q64_duckdb_2_0_iceberg_sf100", 12000,
    "DuckDB 2.0 guesses a ≠ join makes 249M rows and runs it early, on its own. It makes about 3 trillion.",
    `From the Query plans tab, one plan per slide. TPC-DS-like Q64 at scale factor 100: derived from the standard 99-query decision-support benchmark, not audited. The same statistics that skip files pick the join order. DuckDB 2.0 guesses a not-equal join makes 249M rows, so it runs it early, on its own; it makes about 3 trillion. It runs out of memory after ${secs(q64[0].seconds)} with ${gib(q64[0].spill_bytes)} spilled.`,
    { peak: false, name: "DuckDB 2.0" });
  planSlide("04 Fast", "Q64 on the DuckDB nightly: fixed upstream", "tpcds_q64_duckdb_iceberg_sf100", 5000,
    `duckdb#27493 prices ≠ as nearly a cross product, so it is checked inside a hash join. Done in ${secs(q64[1].seconds)}, no step above ${peakText(q64[1])} rows.`,
    `Same query, same data, same machine. duckdb#27493 estimates a not-equal join as nearly a cross product instead of as a selective range join, so the optimizer stops running it on its own and checks it inside a hash join. The nightly answers in ${secs(q64[1].seconds)} with nothing spilled, and no step makes more than ${peakText(q64[1])} rows. With it, DuckDB passes all 99 queries at scale factor 100 for the first time.`,
    { name: "DuckDB nightly" });
}

// ---------- 5. Real-life use case ----------
section("05 Real-life use case", "05", "Real-life use case", "The only one that matters.");
// The landed size on the source node, as the dashboard has it (docs/index.html LANDED, measured once).
const LANDED = (() => {
  const m = fs.readFileSync("c:/git/bench/docs/index.html", "utf8").match(/const LANDED = \{ gb: ([\d.]+), date: "([^"]+)"/);
  return { gb: +m[1], date: m[2] };
})();
{
  // No title: the screenshot is the slide.
  const s = tagBuilds(pres.addSlide({ masterName: "SHOT", sectionTitle: "05 Real-life use case" }));
  shot(s, "shot-workload", "workload", MX, 0.4, CW, 6.4);
  s.addNotes(`From the dashboard's Real workload tab: one dbt project, incremental with MERGE, never reset. The source is ${Math.round(LANDED.gb)} GB of AEMO CSV files (measured ${LANDED.date}). Same dbt project, five engines, same catalog; Iceberg made that a config change. This is the real-life benchmark: dbt orchestrates the SQL, every model is written to Iceberg. One run tests reading files, GROUP BY, complex MERGE on composite keys, writing Iceberg, incremental builds on tables that keep growing, and how well each dbt adapter is implemented. Spark and Trino, which is obvious; DuckDB, Polars and LakeSail did it too. I hope next year more engines join. Real life is boring: DuckDB went from a dead runner at 100 files to 360 by staging through a view. Find your one thing by running your own workload.`);
}
// The Real workload tab's last run (docs/data/workload.json), per engine.
const LEGS = JSON.parse(fs.readFileSync("c:/git/bench/docs/data/workload.json", "utf8")).legs;
{
  // The ragged CSV: workload/macros/*_read_csv.sql and LEARNING.md "dbt on Sail"; the adapters' staging: LEARNING.md
  // "dbt stages the batch before the MERGE"; the spill is the last run's peak, from workload.json.
  // No engine names on this slide.
  const spillGB = Math.round(Math.max(...Object.values(LEGS).map((l) => l.peak_spill_mb)) / 1024);
  const s = content("05 Real-life use case", "Why real life is hard",
    `A TPC run reads clean Parquet and answers queries. The real workload has to do all of this, every run. A minor feature can be a blocker: an AEMO daily file holds several record types, so a 53-field row sits next to rows of about 120 fields. One engine's CSV reader refused the file outright until it got an option to accept short rows; every engine needed its own options. Append only works in a demo: runs overlap, and two appends of the same files both commit, so the rows land twice. A MERGE on the key keeps one copy, which is why every model is an incremental MERGE on a composite key into tables that only grow. Spill to disk is the real bottleneck: the merge doesn't fit in 16 GB of RAM, so it goes to disk, up to ${spillGB} GB in the last run. An engine that can't spill doesn't slow down, it takes the runner with it. The dbt adapter is as important as the engine: it decides how the batch is staged, a temp table or a view. Same SQL, same engine, very different memory.`);
  const cw = (CW - 0.4) / 2, ch = 2.0, cards = [
    ["A minor feature can be a blocker", "A ragged CSV: 53 fields on one row, about 120 on the next. If the reader can’t take it, nothing runs."],
    ["Append only works in a demo", "Runs overlap. Two appends of the same files both commit, and the rows land twice. A MERGE on the key keeps one copy."],
    ["Spill to disk is the real bottleneck", `The merge doesn’t fit in 16 GB of RAM, so it goes to disk: up to ${spillGB} GB in one run. No spill, and the runner dies.`],
    ["The adapter matters as much as the engine", "dbt decides how the batch is staged: a temp table or a view. Same SQL, very different memory."],
  ];
  cards.forEach(([head, body], k) => {
    const x = MX + (k % 2) * (cw + 0.4), y = 1.5 + Math.floor(k / 2) * (ch + 0.25);
    at(k + 1);
    card(s, "hard-" + k, x, y, cw, ch);
    T(s, head, { x: x + 0.4, y: y + 0.25, w: cw - 0.8, h: 0.45, fontSize: 20, bold: true, color: C.accent1 });
    T(s, body, { x: x + 0.4, y: y + 0.8, w: cw - 0.8, h: 1.05, fontSize: 18, color: C.text1, valign: "top" });
  });
  at(cards.length + 1);
  T(s, "Every one of these can stop an engine, whatever its benchmark says.", { x: MX, y: 6.05, w: CW, h: 0.6, fontSize: 24, bold: true, color: C.accent2 });
}
{
  const rep = JSON.parse(fs.readFileSync("c:/git/bench/docs/data/reports.json", "utf8"));
  const reports = rep.items.filter((i) => i.author === rep.reporter && i.kind === "issue");
  const fixed = reports.filter((i) => i.state === "fixed");
  const days = fixed.map((i) => Math.round((Date.parse(i.closed) - Date.parse(i.opened)) / 864e5)).sort((x, y) => x - y);
  const m = days.length >> 1, median = days.length % 2 ? days[m] : (days[m - 1] + days[m]) / 2;
  const polars = reports.filter((i) => i.engine === "Polars"), polarsFixed = polars.filter((i) => i.state === "fixed");
  shotSlide("05 Real-life use case", "Every report, one dot each", "reports", null,
    `From the dashboard's Bug reports tab: one dot per report, oldest first. ${reports.length} reports filed, ${fixed.length} fixed, ${median} days median from report to fix. The best help for an engine is a bug report it can reproduce. AI makes the repro cheap: it drafts, I check, one bug per issue. Polars fixed ${polarsFixed.length} of ${polars.length}, and went from crashing at SF30 to finishing everything at SF100.`);
}
// ---------- 6. What I learned ----------
section("06 What I learned", "06", "What I learned");
{
  // LEARNING.md: "The bottleneck is getting bytes off OneLake, not compute" (DuckDB, one line changed, c2871af) and
  // the dbt workload's "A prune predicate only prunes on a column whose manifest bounds are exact".
  const s = content("06 What I learned", "Read less",
    "The cache: on a small box the bottleneck is getting bytes off storage, not CPU, and later queries re-read the same files. DuckDB with its file cache off, same wheel, same run, one line changed: TPC-DS-like SF10 cold goes from 92.1 s to 370.3 s, TPC-H-like SF10 from 44.3 s to 80.2 s, 1.8 to 4x from the cache alone. It's the only cache DuckDB turns on by itself; Velox's and Trino's are off by default, and turning Velox's on took Gluten's TPC-H-like SF10 cold run from 249.6 s to 123-160 s. Cache reads, not writes: a write isn't done until its files are in storage and the catalog commit points to them. The filter: each merge filtered on the source file name, and it skipped nothing. Iceberg writers cut string bounds to 16 characters by default, truncate(16), and every AEMO file name starts PUBLIC_DAILY_20, so every data file may match every batch. Sail's spill grew with the table, 12.7, 14.2, 20.9, 57.3, then 64.1 GB, and the run failed (39712751864). Filtering on the batch's DATEs too, which are never cut, took Sail's fct_scada from a failure at 65.5 GB of spill (39723305966) to 168 s (39735439145). Same result, no reset. A prefix shared by every value, names, URLs, paths, makes a useless filter column.");
  T(s, "On a small box, bytes off storage cost more than CPU.", { x: MX, y: 1.5, w: CW, h: 0.5, fontSize: 22, color: C.text2 });
  at(1);
  card(s, "read-cache", MX, 2.2, 5.6, 2.9);
  T(s, "Cache your reads", { x: MX + 0.45, y: 2.45, w: 4.7, h: 0.45, fontSize: 18, bold: true, color: C.accent5 });
  T(s, "370 s → 92 s", { x: MX + 0.45, y: 2.95, w: 4.7, h: 1.1, fontSize: 48, bold: true, color: C.text2 });
  T(s, "DuckDB, TPC-DS-like SF10 cold: file cache off, then on.", { x: MX + 0.45, y: 4.15, w: 4.7, h: 0.8, fontSize: 16, color: C.text2 });
  at(2);
  card(s, "read-filter", MX + 6.0, 2.2, CW - 6.0, 2.9, C.text1);
  T(s, "Filter on a date, not a file name", { x: MX + 6.45, y: 2.45, w: CW - 6.9, h: 0.45, fontSize: 18, bold: true, color: C.accent6 });
  T(s, "failed → 168 s", { x: MX + 6.45, y: 2.95, w: CW - 6.9, h: 1.1, fontSize: 48, bold: true, color: C.background1 });
  T(s, "Sail’s merge. Iceberg cuts string bounds to 16 characters; dates are never cut.", { x: MX + 6.45, y: 4.15, w: CW - 6.9, h: 0.8, fontSize: 16, color: C.accent4 });
}
{
  // Two independent confirmations on the 4-core, 16 GB runner: bench/starrocks.py (allin1 image, 15 GB cap) and
  // LEARNING.md's Gluten/Velox and "Past memory: which engines hold up". Times as the dashboard's bars.
  const sr = summarize(SUITES.tpch, 300).find((i) => i.engine === "starrocks_iceberg" && !i.failed);
  const vs = (suite, sf) => {
    const items = summarize(suite, sf).filter((i) => !i.failed), get = (e) => items.find((i) => i.engine === e);
    const spark = get("pyspark_iceberg"), gluten = get("pyspark_gluten_iceberg");
    return spark && gluten ? { spark: spark.mean, gluten: gluten.mean, r: spark.mean / gluten.mean } : null;
  };
  const h30 = vs(SUITES.tpch, 30), ds = SUITES.tpcds.sfs.map((sf) => vs(SUITES.tpcds, sf)).filter(Boolean);
  const gluten = summarize(SUITES.tpcds, 100).find((i) => i.engine === "pyspark_gluten_iceberg" && !i.failed);
  const lo = Math.min(...ds.map((d) => d.r)), hi = Math.max(...ds.map((d) => d.r));
  const s = content("06 What I learned", "Distributed engines run fine on one small box",
    `StarRocks is not a library you pip install, it's a proper distributed system: a front end in Java, which parses, plans and holds the catalog, and a back end in C++, which executes. Normally they run on separate machines. Here both share one 4-core, 16 GB runner in the single-node allin1 image, capped at 15 GB, and Python talks to it over the MySQL protocol. It finishes TPC-H-like SF300 in ${fmt(sr.mean)}. Spark with Velox underneath, through Gluten, same SQL: TPC-H-like SF30 in ${fmt(h30.gluten)} against ${fmt(h30.spark)} on Spark's own engine, ${ratio(h30.r)}, and ${ratio(lo)} to ${ratio(hi)} across TPC-DS-like. It finishes TPC-DS-like SF100 in ${fmt(gluten.mean)}. It runs on a fixed budget, 9 GB off-heap plus 3 GB heap, and not one of its failures at any scale came from memory: they were expired credentials, and at TPC-H-like SF300 the disk. It's the Spark leg of the real workload, and the result the other engines are checked against. AI did its setup: Apache's nightly bundle with pyspark pinned to 4.1.1, and five fixes to read the catalog's storage, each found by a smoke run (apache/gluten#10488 among them). Both have a memory budget. Without one, Polars 2.0.0-rc.2 and Sail took the whole runner down. Spark is adapting, all in open source: Gluten, Comet.`);
  T(s, "Each on one 4-core, 16 GB runner.", { x: MX, y: 1.5, w: CW, h: 0.5, fontSize: 22, color: C.text2 });
  at(1);
  card(s, "cluster-starrocks", MX, 2.2, 5.6, 2.9, C.text1);
  T(s, "StarRocks · TPC-H-like SF300", { x: MX + 0.45, y: 2.45, w: 4.7, h: 0.45, fontSize: 18, bold: true, color: C.accent6 });
  T(s, fmt(sr.mean), { x: MX + 0.45, y: 2.95, w: 4.7, h: 1.1, fontSize: 48, bold: true, color: C.background1 });
  T(s, "A Java front end and a C++ back end, sharing one VM.", { x: MX + 0.45, y: 4.15, w: 4.7, h: 0.8, fontSize: 16, color: C.accent4 });
  at(2);
  card(s, "cluster-spark", MX + 6.0, 2.2, CW - 6.0, 2.9, C.text1);
  T(s, "Spark, Velox underneath · TPC-DS-like SF100", { x: MX + 6.45, y: 2.45, w: CW - 6.9, h: 0.45, fontSize: 18, bold: true, color: C.accent6 });
  T(s, fmt(gluten.mean), { x: MX + 6.45, y: 2.95, w: CW - 6.9, h: 1.1, fontSize: 48, bold: true, color: C.background1 });
  T(s, `${ratio(h30.r)} faster than Spark’s own engine, same SQL. Never ran out of memory here.`, { x: MX + 6.45, y: 4.15, w: CW - 6.9, h: 0.8, fontSize: 16, color: C.accent4 });
}
{
  // LEARNING.md, "Why the decimals differ in the last place" (decimals job of run 39339429096; fixed by
  // DECIMAL(18,5), run 39952876729); the issues' states come from the Bug reports tab.
  const issues = JSON.parse(fs.readFileSync("c:/git/bench/docs/data/reports.json", "utf8")).items
    .filter((i) => ["duckdb/duckdb#27503", "pola-rs/polars#30074"].includes(i.id)).map((i) => `${i.id} (${i.state})`).join(" and ");
  const s = content("06 What I learned", "Engine execution nuances",
    `The real workload's fct_summary cast a DOUBLE to DECIMAL(18,4). AEMO publishes five decimals, so about 2.7% of the rows are a tie at the fourth decimal, like 96.07385. The SQL was the same on every engine; the behaviour was not. Spark rounds the published number half up: 96.0739. DuckDB multiplies by 10,000 first, lands on 960738.4999999999 and rounds down: 96.0738. Polars rounds ties to even, so about half go down. Out of 3.08M rows, DuckDB differed from Spark on 6,716 and Polars on 85,090, every one by exactly 0.0001. Moving SQL between engines is not only vocabulary: the same statement can behave differently. The fix was simple: DECIMAL(18,5). AEMO's five decimals fit, nothing rounds, and every engine stores the same value. Filed: ${issues}.`);
  T(s, "One value, 96.07385, cast from DOUBLE to DECIMAL(18,4)", { x: MX, y: 1.5, w: CW, h: 0.5, fontSize: 22, color: C.text2 });
  at(1);
  card(s, "digit-spark", MX, 2.2, 5.6, 2.6);
  T(s, "Spark", { x: MX + 0.45, y: 2.45, w: 4.7, h: 0.45, fontSize: 18, bold: true, color: C.accent5 });
  T(s, "96.0739", { x: MX + 0.45, y: 3.0, w: 4.7, h: 1.4, fontSize: 60, bold: true, color: C.text1 });
  at(2);
  card(s, "digit-duckdb", MX + 6.0, 2.2, CW - 6.0, 2.6, C.text1);
  T(s, "DuckDB", { x: MX + 6.45, y: 2.45, w: CW - 6.9, h: 0.45, fontSize: 18, bold: true, color: C.accent6 });
  T(s, "96.0738", { x: MX + 6.45, y: 3.0, w: CW - 6.9, h: 1.4, fontSize: 60, bold: true, color: C.background1 });
  at(3);
  T(s, "Out of 3.08M rows: DuckDB differs from Spark on 6,716, Polars on 85,090. Each by 0.0001.", { x: MX, y: 5.05, w: CW, h: 0.6, fontSize: 22, color: C.accent1 });
  at(4);
  T(s, "Same SQL, not the same behaviour. The fix: DECIMAL(18,5), nothing rounds.", { x: MX, y: 5.8, w: CW, h: 0.6, fontSize: 24, bold: true, color: C.accent2 });
}
pres.addSection({ title: "Close" });
// Every engine that finishes the real-life dbt workload: the dashboard's Real workload tab
// (docs/data/workload.json), every model built and no file left behind.
const LEGS_DONE = (() => {
  const legs = JSON.parse(fs.readFileSync("c:/git/bench/docs/data/workload.json", "utf8")).legs;
  return Object.keys(legs).filter((e) => legs[e].status === "success" && legs[e].files_behind === 0 && legs[e].models_ok === legs[e].models)
    .sort((a, b) => LABEL[a].localeCompare(LABEL[b], "en", { sensitivity: "base" }));
})();
{
  const s = pres.addSlide({ masterName: "PUNCHLINE", sectionTitle: "Close" });
  s.addText(`My use case used to work with only 1 engine. Now we have ${LEGS_DONE.length}. That’s progress.`, { placeholder: "title" });
  s.addNotes(`My use case used to work with only one engine. Now ${LEGS_DONE.length} finish it. That's progress. These engines work, and that's the story. To make it work you need a whole ecosystem: Iceberg support, the catalog, a dbt adapter, spill to disk.`);
  // Emoji stand-ins for the logos, no names, centred under the line.
  const MASCOT = { duckdb_iceberg: "🦆", pyspark_gluten_iceberg: "⭐", lakesail_iceberg: "⛵", polars_iceberg: "🐻‍❄️", trino_iceberg: "🐰" };
  const x0 = (W - (LEGS_DONE.length * 1.4 - 0.2)) / 2;
  LEGS_DONE.forEach((e, k) => {
    s.addText(MASCOT[e] ?? LABEL[e], { isTextBox: true, margin: 0, x: x0 + k * 1.4, y: 5.55, w: 1.2, h: 0.85, fontSize: MASCOT[e] ? 44 : 16, bold: !MASCOT[e], color: C.background1, align: "center", valign: "top" });
  });
}
{
  const s = pres.addSlide({ masterName: "TITLE", sectionTitle: "Close" });
  s.addText("Thank you", { placeholder: "title" });
  s.addText("Questions?  ·  djouallah.github.io/lakehouse_benchmark", { placeholder: "body" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: "qr-frame", x: 9.55, y: 1.75, w: 3.2, h: 3.2, rectRadius: 0.15, fill: { color: C.background1 }, line: { type: "none" } });
  s.addImage({ objectName: "qr-github", path: SHOTS + "qr_github.png", x: 9.7, y: 1.9, w: 2.9, h: 2.9, altText: "QR code: github.com/djouallah/lakehouse_benchmark" });
  s.addText("Scan for the code: github.com/djouallah/lakehouse_benchmark", { isTextBox: true, margin: 0, x: 8.9, y: 5.1, w: 4.5, h: 0.7, fontSize: 14, color: C.accent3, align: "center" });
  s.addNotes("Questions?");
}

async function addBuilds(file) {
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  let id = 0;
  const tgt = (spid) => `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>`;
  const vis = (spid, val, delay) => `<p:set><p:cBhvr><p:cTn id="${++id}" dur="1" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst></p:cTn>${tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="${val}"/></p:to></p:set>`;
  const anim = (spid, tr, filter, dur) => `<p:animEffect transition="${tr}" filter="${filter}"><p:cBhvr><p:cTn id="${++id}" dur="${dur}"/>${tgt(spid)}</p:cBhvr></p:animEffect>`;
  // Fade in, wipe in from the left, or fade out (then hidden).
  const effect = (e, first) => {
    const own = ++id;
    const [preset, sub, cls, grp, body] = e.out ? [10, 0, "exit", 1, anim(e.spid, "out", "fade", 400) + vis(e.spid, "hidden", 399)]
      : e.fx === "wipe" ? [22, 8, "entr", 0, vis(e.spid, "visible", 0) + anim(e.spid, "in", "wipe(left)", 600)]
      : [10, 0, "entr", 0, vis(e.spid, "visible", 0) + anim(e.spid, "in", "fade", 400)];
    return `<p:par><p:cTn id="${own}" presetID="${preset}" presetClass="${cls}" presetSubtype="${sub}" fill="hold" grpId="${grp}" nodeType="${first ? "clickEffect" : "withEffect"}"><p:stCondLst><p:cond delay="${e.delay}"/></p:stCondLst><p:childTnLst>${body}</p:childTnLst></p:cTn></p:par>`;
  };
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    for (const sp of xml.matchAll(/<p:sp>[\s\S]*?<\/p:sp>/g))
      if (sp[0].includes("<p:ph") && !/<a:t>[^<]/.test(sp[0]) && !sp[0].includes("<a:fld")) throw new Error(name + ": empty placeholder");
    const steps = new Map(), builds = [];
    const push = (click, e) => { if (!steps.has(click)) steps.set(click, []); steps.get(click).push(e); };
    for (const m of xml.matchAll(/<p:(sp|pic|cxnSp)>\s*<p:nv(?:Sp|Pic|CxnSp)Pr>\s*<p:cNvPr id="(\d+)" name="a(\d+)-(\d+)-(\w+)-(\d+)-(\d+)-\d+"/g)) {
      const [, kind, spid, enter, exit, fx, delay, outDelay] = m;
      if (+enter) push(+enter, { spid, fx, delay: +delay, out: false });
      if (+exit) push(+exit, { spid, fx, delay: +outDelay, out: true });
      if (kind !== "pic") {
        if (+enter) builds.push([spid, 0]);
        if (+exit) builds.push([spid, 1]);
      }
    }
    if (!steps.size) continue;
    id = 2;
    const clicks = [...steps.keys()].sort((a, b) => a - b).map((k) =>
      `<p:par><p:cTn id="${++id}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>` +
      `<p:par><p:cTn id="${++id}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>` +
      steps.get(k).sort((a, b) => a.delay - b.delay).map((e, i) => effect(e, i === 0)).join("") +
      `</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`).join("");
    const timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
      `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${clicks}</p:childTnLst></p:cTn>` +
      `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
      `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>` +
      `</p:childTnLst></p:cTn></p:par></p:tnLst>` +
      `<p:bldLst>${builds.map(([spid, grp]) => `<p:bldP spid="${spid}" grpId="${grp}" animBg="1"/>`).join("")}</p:bldLst></p:timing>`;
    if (!xml.includes("</p:clrMapOvr>")) throw new Error(name + ": no clrMapOvr to anchor the timing");
    xml = xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + timing);
    zip.file(name, xml);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await addBuilds(OUT);
  console.log("wrote " + OUT);
  // The default build also writes the PDF backup: the stills deck (a PDF can't animate), exported by PowerPoint.
  if (!STILLS && !FRAMES && !process.env.OUT) {
    const { execFileSync } = require("child_process");
    const stills = require("path").join(require("os").tmpdir(), "state-of-the-union-stills.pptx");
    const pdf = require("path").win32.normalize("c:/git/presentations/python-engine/state-of-the-union-python-engines-2026.pdf");  // PowerPoint wants backslashes
    execFileSync(process.execPath, [__filename], { env: { ...process.env, STILLS: "1", OUT: stills }, stdio: "inherit" });
    execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-Command",
      `$ErrorActionPreference = 'Stop'; $pp = New-Object -ComObject PowerPoint.Application; $d = $pp.Presentations.Open('${stills}', $true, $false, $false); ` +
      `$d.SaveAs('${pdf}', 32); $d.Close(); $pp.Quit()`], { stdio: "inherit" });
    console.log("wrote " + pdf);
  }
})();
