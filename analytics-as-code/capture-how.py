"""Screenshots of https://nemtracker.github.io/how/ for the deck: img/how/step<N>.png, one per card, and
the cards that open (model, ai, other, plan). 16:9, so a shot fills a slide.

Driven through the page's own controls: ?region= picks the slicer, Next shows the next card, a click on a
card opens it. The AI card is scripted on the page (no AI is called); its verdict depends on whether a
battery is charging at the newest interval, so the region is the one where the AI's SQL is furthest off: run it
in the Australian daytime, when batteries charge, for a big miss.
Rerun it before a talk:
    python -I capture-how.py
"""

import re
from pathlib import Path

from playwright.sync_api import sync_playwright

SITE = "https://nemtracker.github.io/how/"
OUT = Path(__file__).parent / "img" / "how"
REGIONS = ["NSW1", "QLD1", "SA1", "VIC1", "TAS1"]
W, H = 1600, 900


def ready(page, region):
    page.goto(f"{SITE}?region={region}", wait_until="networkidle")
    page.wait_for_selector("#next:not([disabled])", timeout=120_000)
    page.wait_for_timeout(800)


def shot(page, name):
    page.mouse.move(W - 1, H - 1)  # off every card: no hover in the shot
    page.wait_for_timeout(300)
    page.screenshot(path=str(OUT / f"{name}.png"))
    print("wrote", name)


def open_card(page, step, wait):
    page.click(f'.card[data-step="{step}"]')
    wait()
    page.wait_for_timeout(600)


def close(page):
    page.click("#dlgClose")
    page.wait_for_timeout(400)


def ai_off(page):
    """Open the AI card; how many MW its SQL is off by (0 when lucky)."""
    open_card(page, 4, lambda: page.wait_for_selector("#aiResult:not([hidden])", timeout=60_000))
    m = re.search(r"Off by ([\d,]+) MW", page.inner_text("#aiVerdict"))
    return int(m.group(1).replace(",", "")) if m else 0


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.emulate_media(color_scheme="dark")

        # The region where the AI's SQL is furthest off (batteries charging).
        offs = {}
        for r in REGIONS:
            ready(page, r)
            for _ in range(6):
                page.click("#next"); page.wait_for_timeout(300)
            offs[r] = ai_off(page)
        region = max(REGIONS, key=lambda r: offs[r])
        print("AI off by, MW:", offs, "->", region)

        ready(page, region)
        shot(page, "step1")
        for n in range(2, 8):
            page.click("#next")
            page.wait_for_timeout(1800 if n == 7 else 700)
            shot(page, f"step{n}")

        open_card(page, 2, lambda: page.wait_for_selector("#modelSvg *", timeout=30_000))
        page.wait_for_timeout(1200)
        shot(page, "model"); close(page)
        open_card(page, 1, lambda: page.wait_for_selector("#feSql:not(:empty)", timeout=30_000))
        shot(page, "other"); close(page)
        ai_off(page)
        shot(page, "ai"); close(page)
        open_card(page, 6, lambda: page.wait_for_timeout(4000))
        shot(page, "plan"); close(page)
        browser.close()


if __name__ == "__main__":
    main()
