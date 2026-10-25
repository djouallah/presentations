# Presentations

Two talks for [Øredev 2026](https://oredev.org/info), the Øredev Developer Conference, 4–6 November 2026, Malmö, Sweden. Each talk is self-contained in its own folder: deck, speaker notes, images and video.

## [python-engine/](python-engine/): Python Data Engines, State of the Union 2026

An honest scorecard of DuckDB, Polars, Daft, DataFusion, chDB and LakeSail on a single 16 GB notebook, running the same workload as 2025. Live dashboard: https://djouallah.github.io/lakehouse_benchmark/, code: https://github.com/djouallah/lakehouse_benchmark.

- `state-of-the-union-python-engines-2026.pptx` / `.pdf`: the deck
- `abstract.txt`, `story.md`: abstract and talk narrative
- `build-deck.js`: generates the deck (reads benchmark data from `C:\git\bench\docs`)
- `capture.py`, `shots/`: dashboard screenshots used in the slides
- `2025/`: last year's deck

## [analytics-as-code/](analytics-as-code/): Analytics as Code

A real analytics platform (ingestion, transformation, storage, testing and an interactive dashboard) shipped from a single Git repo: dbt-duckdb in CI, an Iceberg REST catalog as the only persistent layer, and a DuckDB-WASM dashboard in the browser. No orchestrator, no warehouse compute, no backend API. Live demo: https://nemtracker.github.io/, code: https://github.com/djouallah/analytics-as-code.

- `talk.pptx`: the deck
- `abstract.txt`, `talk.md`, `story.md`: abstract, outline and talk narrative
- `first-look-at-apache-ossie.md`, `reference.md`: companion notes
- `anatomy-of-a-click-1080p.mp4`: demo video
- `img/`: diagrams and history screenshots
