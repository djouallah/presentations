"""Dashboard screenshots for the deck: shots/crop_<name>.png, from the live site.

Each shot is driven to a fixed state through the tab's own controls (never mid-animation) and cropped to
the content under the tab bar, without the Play / Back / Next row. Rerun it before a talk:
    python -I capture.py
"""

from pathlib import Path

from playwright.sync_api import sync_playwright

SITE = "https://djouallah.github.io/lakehouse_benchmark/"
OUT = Path(__file__).parent / "shots"

# The union of these elements' visible children, minus the control rows.
CROP_JS = """([ids, skip, below]) => {
  const rects = [];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el || el.hidden) continue;
    for (const c of el.children) {
      if (c.matches(skip)) continue;
      const r = c.getBoundingClientRect();
      if (r.width && r.height) rects.push(r);
    }
  }
  const x0 = Math.min(...rects.map(r => r.left)), y0 = Math.min(...rects.map(r => r.top));
  const x1 = Math.max(...rects.map(r => r.right)), y1 = Math.max(...rects.map(r => r.bottom));
  return { x: x0 - 8 + scrollX, y: y0 - 8 + scrollY, width: x1 - x0 + 16, height: y1 - y0 + 8 + below };
}"""
SKIP = ".ctl, .hint, [hidden]"


def open_tab(page, hash_):
    page.goto(SITE + "#" + hash_, wait_until="networkidle")
    page.wait_for_timeout(800)


def shoot(page, name, ids, skip=SKIP, below=8):
    page.mouse.move(1599, 999)  # off every card: no hover tooltip in the shot
    page.wait_for_timeout(300)
    clip = page.evaluate(CROP_JS, [ids, skip, below])
    page.screenshot(path=str(OUT / f"crop_{name}.png"), clip=clip, full_page=True)
    print(f"crop_{name}.png  {round(clip['width'])}x{round(clip['height'])}")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1600, "height": 1000}, device_scale_factor=2)

        # Only the tabs the deck still shows as pictures; the step-throughs, plans and bars are drawn natively
        # by build-deck.js from docs/index.html and docs/data.
        open_tab(page, "overview")
        page.wait_for_timeout(1500)  # the first commit lands
        shoot(page, "overview", ["overview"])

        # Four of the ten columns (engine, started, written in, runs as): the full table can't be read projected.
        open_tab(page, "engines")
        page.add_style_tag(content="#engines .wrap { display: inline-block } "
                           + " ".join(f"#engines th:nth-child({n}), #engines td:nth-child({n}) {{ display: none }}" for n in (3, 4, 6, 7, 9, 10)))
        shoot(page, "engines", ["engines"])

        # Without the caption: it names the catalog, and the deck names it only on the disclosure slide.
        open_tab(page, "iceberg")
        page.add_style_tag(content="#iceberg p.caption { display: none }")
        shoot(page, "iceberg", ["iceberg"])

        open_tab(page, "workload")
        page.wait_for_timeout(1500)
        shoot(page, "workload", ["workload"])

        open_tab(page, "reports")
        page.wait_for_timeout(1000)
        shoot(page, "reports", ["reports"])

        browser.close()


if __name__ == "__main__":
    main()
