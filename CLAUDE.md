# Context for agents

Private repo holding two talks for Øredev 2026 (4–6 Nov 2026, Malmö, Sweden). Each folder is one self-contained talk. Commit straight to `main` and push; keep the repo private.

Both decks are generated, never edited by hand: change the folder's `build-deck.js` and rebuild. pptxgenjs 3.12.0 is not installed in the repo; install it somewhere outside (e.g. a scratchpad) and run with `NODE_PATH` pointing at its `node_modules`. Both generators load `apply_theme.js` from the synced pptx skill by absolute path.

## python-engine/: Python Data Engines, State of the Union 2026

- Source repo: https://github.com/djouallah/lakehouse_benchmark (local clone `C:\git\bench`), live dashboard https://djouallah.github.io/lakehouse_benchmark/.
- `node build-deck.js` builds the pptx and, through PowerPoint, the PDF. It reads benchmark data from the source clone (`c:/git/bench/docs/data/`, `c:/git/bench/docs/index.html`) and writes into this folder; those absolute paths are intentional.
- `capture.py` screenshots the live dashboard into `shots/`.
- `2025/` is last year's deck, kept for the "what changed since 2025" comparison.

## analytics-as-code/: Analytics as Code

- Source repo: https://github.com/djouallah/analytics-as-code (local clone `C:\git\analytics-as-code`), live demo https://nemtracker.github.io/.
- Build: `node build-deck.js`, then `./animate.ps1 -Deck <full path to analytics-as-code.pptx>` (PowerPoint COM adds the click animations from shape names). Images the deck uses live in `img/deck/` and `img/history/`.
- Deck is `analytics-as-code.pptx`; `talk.md` is the outline, `story.md` the narrative, `abstract.txt` the submitted abstract.
- Only the 1080p export of the demo video is kept; the 360 MB master was deliberately deleted. Keep files under GitHub's 100 MB limit.

Both folders used to live at `<source repo>/presentation/` (gitignored there) and were moved here.
