# The story — Python Data Engines: State of the Union 2026

Opener: **Every Python data engine looks impressive when you throw a 64-core machine at it. That is not this talk.**

~30 min + Q&A.

Agenda slide after the title: the seven section titles, nothing else.

About me, between the title and the agenda: Microsoft, Fabric CAT team, Brisbane; ex construction planner; personal project, my own opinions; QR to my LinkedIn.

Scope, after the agenda: a Python engine does many jobs (read and serve, explore, complex calculations, streaming, embedded). This talk is about one: data engineering. Read raw files, transform, MERGE, write tables, every day, unattended.

## 1. What changed since 2025 (5 min)
One slide, three themes, one per click. I gave this talk last year (Life Beyond Pandas, 2 cores, Delta) and this is what changed.
- **SQL.** Polars SQL went from a side feature to all 99 TPC-DS-like queries: the fastest engine here at SF100 (time from the dashboard bars). On 2.0.0-rc.2 it killed the runner at TPC-H-like SF30; optimizer work Aug–Oct 2026 (join reordering #28985/#29038, dynamic predicates #29312, bloom filters #29423) changed that. Main build.
- **Iceberg.** The new baseline: a missing feature is treated as a bug. Last year most of these engines couldn't write a table (Delta through delta-rs); now they all write Iceberg.
- **AI.** I don't care about the lack of a standard DataFrame API; I became a dbt believer only because of AI (I was scared of Jinja); I don't write any code, I just review the tests.
- Last click: Python engines aren't niche anymore. They're mainstream, and a bit boring.

## 2. Iceberg (4 min)
- All engines are equal, as long as they speak the same spec.
- Not long ago your data lived inside an engine. Changing engine meant migrating.
- **Break of gauge** (the analogy, after the Timeline; the last line is spoken, not on the slide): before 1886 the US North ran on 4 ft 8½ in, most of the South on 5 ft; freight was unloaded and reloaded, or cars put on new wheels. On 31 May – 1 June 1886 the South moved one rail on more than 11,000 miles of track in 36 hours. The trains were fine; the track wasn't shared. Iceberg is the gauge: any engine runs on any table.
- Iceberg + a REST catalog changed that: tables live in the open, and any engine can read and write them.
- which is awesome as many small projects will be treated the same as very big commerical or vetetran open source porjetcs
- Show: Timeline as three parallel lines, all still here (warehouse; closed lakehouse: open table format, no direct access to the storage; open lakehouse), Overview, then Concurrency: one commit refused and retried, the catalog is the referee (dashboard, Lakehouse tab).

## 3. The engines (4 min)
- **Disclosure** (30 s), before Who they are, so the Iceberg grid reads against this catalog: Free GitHub runners, 4 cores / 16 GB. OneLake Catalog, because I get it free through my job :)
- 16 engines tried, counting the ones that didn't make it (the slide counts them from the dashboard's Engines tab).
- The guests: Python engines (DuckDB, Polars, chDB, LakeSail), with cluster engines as a reference (Spark, Gluten, Trino, StarRocks, Databend).
- Daft and pandas run the ETL only. Tried, not added: Apache Doris, Firebolt Core, DataFusion Comet, DataFusion, pg_lake, each with its reason on the Engines tab.
- All of them talk to the same catalog. None of them needed anything special.
- Speed doesn't matter if the engine can't do your operation.
- **Iceberg support, ranked** (the dashboard's Iceberg support Overview, before the grid): engines ranked by operations supported out of 41, a segment per group. It moved a lot: Polars 2.1.0 did 6 on 25 Oct, Polars main 28 on 3 Nov; StarRocks joined the grid at 36.
- The Iceberg grid. The good news first: create, append, file pruning, time travel and concurrent appends work almost everywhere. The catalog is the referee (section 1), and it works.
- Then the differences: who does MERGE, DELETE, partition evolution, branches. Pick on this, not on speed.
- Side note: Spark has the best fault tolerance and the widest coverage.

## 4. What does "fast" mean? (5 min)
- The best query is no query.
- **File skipping** is what makes things fast: Iceberg's min/max stats skip files and row groups before a row is read (36 row groups down to 1); some engines answer MAX without reading a data file.
- **The importance of sorting data:** file skipping only works if the data is reasonably well sorted. Random order: every file spans the whole month, 12 row groups instead of 1. Sort on what you filter.
  Show: the last step of the File pruning tab, then random order. One still each, no clicks.
- **The small-file problem** (general, not a bench result): the same 1 GB as 8 files of 128 MB or 8,000 of 128 KB. Every file costs a request, a footer and a manifest entry before a row is read, so the engine opens instead of reading. Compact into few big files; Iceberg's default target is 512 MB.
- The same statistics pick the join order. Engines make reasonable plans... till they don't, and then they get fixed. One pair, one plan per slide:
  - Q64, SF100, DuckDB before and after one fix: DuckDB 2.0 guesses a ≠ join makes 249M rows and runs it early; it makes about 3 trillion, out of memory after 247 s, 90 GiB spilled. duckdb/duckdb#27493 prices ≠ as nearly a cross product: the nightly checks it inside a hash join, 101 s, no spill, no step above 1.9M rows. DuckDB passes all 99 at SF100 for the first time.

## 5. Benchmarks (3 min)

- Nobody switches engines for 2×. What the benchmarks prove: these engines read Iceberg, run full SQL suites, spill to disk, and plan well, on one small box.
- Race charts: TPC-H-like SF30, where all nine engines finish, and the 52 GB ETL. (they test the cache more than anything else)
- Not audited, so per the TPC fair-use rules they're TPC-H-like and TPC-DS-like: derived from the specs, not comparable to published TPC results.

## 6. Real-life use case (5 min)
- The standard benchmarks look fine, but they don't run my actual workload.
- **The real workload:** same dbt project, five engines, same catalog. Iceberg made that a config change.
  - The data: 185 GB of AEMO CSV files (measured 2026-10-22), the source node on the dashboard.
  - **Same code, two engines**, after the screenshot: LakeSail (Rust, DataFusion, Spark Connect) and Spark + Gluten/Velox (JVM + C++) share no code, but their profiles.yml targets are the same lines and they run the exact same `models/aemo/spark/` files into the same Iceberg tables. Takeaway: **dbt + Iceberg is a new way to do data engineering. The code and the tables stay; the engine is a target in profiles.yml.**
  - This is the real-life benchmark: dbt orchestrates the SQL, every model is written to Iceberg.
  - One run tests a lot at once: reading files, GROUP BY, complex MERGE on composite keys, writing Iceberg, incremental builds on tables that keep growing, and how well each dbt adapter is implemented.
  - Today five engines do it. Spark and Trino, which is obvious. DuckDB, Polars and LakeSail did it too. I hope next year more engines join.
  - And real life is boring: it hinged on one setting. DuckDB went from a dead runner at 100 files to 360 by staging through a view.
  - Find your one thing by running your own workload.
- **Why real life is hard** (four cards, one per click, no engine names): a minor feature can be a blocker (the ragged CSV, 53 fields next to ~120); append only works in a demo (runs overlap, a MERGE on the key keeps one copy); spill to disk is the real bottleneck (the last run's biggest spill, from docs/data/workload.json); the adapter matters as much as the engine (temp table or view, very different memory). Punchline: every one of these can stop an engine, whatever its benchmark says.
- **Bug reports.** They made the workload possible. The numbers are the dashboard's Bug reports tab (the deck reads docs/data/reports.json at build time). Polars went from crashing at SF30 to finishing everything at SF100.

## 7. What I learned (4 min)
- **Read less.** Cache your reads: DuckDB, TPC-DS-like SF10 cold, file cache off 370 s, on 92 s. Filter on a date, not a file name: Iceberg cuts string bounds to 16 characters, so a filter on PUBLIC_DAILY_20… names prunes nothing; Sail's merge went from a failure at 65.5 GB of spill to 168 s (LEARNING.md, c2871af and the dbt workload).
- **Distributed engines run fine on one small box.** StarRocks (Java front end + C++ back end on one VM) finishes TPC-H-like SF300; Spark with Velox underneath, same SQL, 3.7× Spark's own engine, finishes TPC-DS-like SF100, never ran out of memory here.
  - On stage only (not on the slide, not in the notes): I used to hate Spark, installing it was a nightmare; the best thing AI did for me is make Spark friendly.
- **Engine execution nuances.** fct_summary cast DOUBLE to DECIMAL(18,4); ~2.7% of AEMO rows are a tie at the 4th decimal. 96.07385: Spark 96.0739, DuckDB 96.0738, Polars ties to even. Out of 3.08M rows DuckDB differed from Spark on 6,716, Polars on 85,090, each by 0.0001. The difference between engines is not only SQL vocabulary, it is engine behaviour. The fix was simply DECIMAL(18,5): five decimals fit, nothing rounds, every engine stores the same value. Filed: duckdb#27503, polars#30074 (LEARNING.md, runs 39339429096 and 39952876729).
- **Report bugs.** Instead of flooding projects with AI pull requests, report bugs. Bugs, not feature requests. Check it isn't a duplicate. The smallest possible repro.

## Close
Before Thank you, after the 1 → 5 engines punchline: the bell-curve meme, SQL at both ends, the DataFrame API in the middle. A picture alone, no notes.

Thank you. Questions. Across the top: the engines that finish the real-life dbt workload, by name, as emoji with no names (🦆 DuckDB, ⭐ Gluten/Velox on Spark, ⛵ LakeSail, 🐻‍❄️ Polars, 🐰 Trino; from docs/data/workload.json). Spoken: these engines work, and that's the story; to make it work you need a whole ecosystem: Iceberg support, the catalog, a dbt adapter, spill to disk.
