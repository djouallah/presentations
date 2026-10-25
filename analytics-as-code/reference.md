# Reference: the visual query in Power BI

Background notes for the diagram (`img/query-flow.svg`). Not part of the post.

## The chain

```
visual (fields + filters)  →  DAX query  →  formula engine  →  storage engine queries (xmSQL)  →  data
```

## 1. The visual query is not DAX

- A visual stores **which fields it binds to**, not a query. In PBIR (the report format this repo
  uses), that is `visual.query.queryState` in each `visual.json`: one entry per role (`Values`,
  `Category`, `Y`, ...), each a list of `projections`, each a `Column` or `Measure` with a
  `SourceRef` (`Entity` = table) and a `Property` (column or measure name). Filters are separate,
  as the visual's, page's and report's filter definitions.
- From this repo,
  `dashboard/powerbi_report/nem.Report/definition/pages/overview/visuals/card_generation/visual.json`
  ([schema](https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.8.0/schema.json)):

  ```json
  "query": {
    "queryState": {
      "Values": {
        "projections": [{
          "field": { "Measure": {
            "Expression": { "SourceRef": { "Entity": "fct_summary" } },
            "Property": "Generation MWh" } },
          "queryRef": "fct_summary.Generation MWh",
          "nativeQueryRef": "Generation MWh"
        }]
      }
    }
  }
  ```

- At run time the report sends a **semantic query** built from those bindings and the current
  filters (Select / From / Where / OrderBy / Top in JSON, known internally as a data-shape
  query, `SemanticQueryDataShapeCommand`), and the service turns it into DAX. The JSON format and
  the translation are internal and undocumented (unconfirmed beyond community reverse
  engineering; no Microsoft Learn page found).
- The DAX it produces is usually `EVALUATE` over `SUMMARIZECOLUMNS`, with variables for the
  filters (`TREATAS`, `KEEPFILTERS`), and `TOPN` / `SAMPLE` for row limits
  ([SQLBI, formula engine and storage engine](https://www.sqlbi.com/articles/formula-engine-and-storage-engine-in-dax/)).
  Visual calculations add a `VISUAL SHAPE` clause to that DAX
  ([SQLBI whitepaper](https://www.sqlbi.com/whitepapers/understanding-visual-calculations-in-dax/),
  [dax.guide](https://dax.guide/?p=1106)).

## 2. How to see each step

| Step | Where to see it |
|---|---|
| Visual bindings | `visual.json`, `query.queryState` (PBIR / PBIP) |
| DAX of a visual | Desktop: Performance Analyzer → *Copy query*; DAX query view |
| DAX + which visual sent it | Log Analytics / Fabric Workspace Monitoring: `QueryEnd` events, `ApplicationContext` holds the visual's id ([Chris Webb, 2021](https://blog.crossjoin.co.uk/2021/09/05/matching-dax-queries-to-individual-visuals-in-a-published-power-bi-report/), [2025](https://blog.crossjoin.co.uk/2025/05/11/finding-events-linked-to-a-specific-power-bi-visual-in-fabric-workspace-monitoring/)) |
| Storage engine queries (xmSQL), FE/SE timings | DAX Studio: Server Timings, Query Plan ([Towards Data Science](https://towardsdatascience.com/how-to-get-performance-data-from-power-bi-with-dax-studio/)) |

## 3. Formula engine and storage engine

From [SQLBI](https://www.sqlbi.com/articles/formula-engine-and-storage-engine-in-dax/):

- **Formula engine (FE):** runs the DAX: filter context, measures, everything the storage
  engine cannot do. Single-threaded, no cache.
- **Storage engine (SE), VertiPaq:** scans the compressed columns. The FE sends it queries in
  **xmSQL**, a reduced SQL: simple arithmetic, `SUM`, `MIN`, `MAX`, `COUNT`, `DCOUNT`, joins
  along relationships. Multi-threaded, with a cache.
- One DAX query becomes **several xmSQL queries**; their results (datacaches) are materialized
  for the FE, which combines them. When the SE needs logic it can't run, it calls back into the
  FE (`CallbackDataID`), which is slower and not cached.
- In DirectQuery the SE requests become SQL against the source instead of xmSQL against
  VertiPaq. In Direct Lake, VertiPaq loads the needed columns from the Delta/parquet files in
  OneLake on first use, then scans them in memory.

## 4. The same chain in this repo's dashboard

| Power BI | This repo |
|---|---|
| visual bindings (`queryState`) | a query object in `dashboard/github/dax/frontend/queries.js` (`select`, `where`, `totals`, `orderBy`, `top`) |
| semantic query → DAX | `toDax()` in `dashboard/github/common/semantic/query.js` |
| formula engine + VertiPaq | dax-sql (DAX → SQL) + DuckDB-WASM |
| `model.bim` | `semantic_model/ossie.yaml`, turned into TMSL by `dax-sql/formats/ossie.js` |
