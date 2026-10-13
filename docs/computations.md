# Computations on the data

The app ships every scientific metric exactly as the dataset provides it. The composite score `c`, h-index, hm-index, citation counts, and all ranks are used as-is — nothing is recalculated. What follows is the complete list of values the app derives on top of the raw extract, where they are computed, and why.

Pipeline: Excel workbooks → Python (pandas/openpyxl) → CSV in `public/data/` → `node scripts/process-csv.js` → JSON. See `docs/ranks.md` for the rank columns and `docs/impact.md` for the composite score formula.

## 1. Dense `id` (URL key)

`id = array position + 1`, assigned after the pipeline writes rows in file order (which is official rank order).

Why: the dataset's `rank` column is not unique — 113 tied rank values cover 276 rows (e.g. 64,553 = Tsai, Shupei and Shiffrin, Seana Valentine), and it has gaps (max rank 1,472,484 for 249,310 rows, because ranks refer to a ~11.6M-author universe while the extract holds the top ~2%). Ties would break URLs and React keys; gaps make rank unusable as an id. The official `rank` and `rank (ns)` are still displayed everywhere — `id` is only for addressing.

## 2. Rank in Subfield 2 (derived, not official)

The dataset ships official ranks only for the primary subfield: `rank sm-subfield-1` and `rank sm-subfield-1 (ns)` (captured as `rankInSubfield` / `rankInSubfieldNs` — pass-through, no computation). There is no rank column for `sm-subfield-2`, so the pipeline derives one:

- Group all scientists by their `sm-subfield-2` value (across all fields — a secondary subfield can belong to any primary field).
- Sort each group by `rank` → `rankInSubfield2`; sort by `rank (ns)` → `rankInSubfield2Ns`.
- Competition ranking: equal rank values share the better position, matching how the official subfield-1 ranks handle ties.

Coverage: 248,518 of 249,310 singleyr scientists (99.7%) have a Subfield 2 and a derived rank; 792 have none and show "—". The same derivation runs on the career dataset. Treat these as computed by the app, not by Ioannidis/Elsevier.

## 3. Self-citation-excluded (`ns`) variants

Every metric in the extract comes in a paired column set — `nc2525` / `nc2525 (ns)`, `h25` / `h25 (ns)`, `c` / `c (ns)`, etc. The pipeline captures both sides as separate fields (`citationsNs`, `hIndexNs`, `hmIndexNs`, `npsNs`, `ncsNs`, `cpsfNs`, `ncsfNs`, `npsflNs`, `ncsflNs`, `compositeScoreNs`, `npcitingNs`, `cpratNs`, plus `rankNs`). This is column renaming, not computation — the `(ns)` numbers are the dataset's own.

## 4. Homepage aggregates (index JSON only)

The small index files (`singleyr.json`, `career.json`) carry precomputed aggregates so the dashboard never fetches the ~186MB full files:

- **Top counts** — simple value counts over non-empty strings, sorted descending: `institutionCounts` (top 20), `countryCounts` (top 25), `fieldCounts` (top 25).
- **Decade buckets** — `floor(firstYear / 10) × 10 + "s"` for every scientist with `firstYear ≥ 1900` (earlier starts are dropped; only a handful exist).
- **Percentiles** — for `citations`, `hIndex`, `compositeScore`: p25/p50/p75/p90/p99/max, computed on **values > 0 only**, nearest-rank method (`ceil(p/100·n) − 1` into the sorted array).
- **Rising cohort** — top 10 by citations among scientists with `firstYear ≥ 2020`.
- **stats** — max citations / h-index / composite score, and `topScientists` = first 1000 rows (file order, no re-sort).

## 5. Field and subfield thresholds

Table 2 of the dataset (per-field and per-subfield percentile cutoffs over the *full* author population, not just the top-2% list) is converted to `field-thresholds.json` (20 fields) and `subfield-thresholds.json` (174 subfields): `totalAuthors`, `topListCount`, `topListPercentage`, and `citesPercentiles` / `cPercentiles` blocks (p25–p99). Pass-through of Table 2's `Cites@xx` and `c@xx` columns — the source has no @98 column. The profile page's "Subfield Benchmarks" and "Field Percentiles" tables read these.

## 6. Server-side query engine (runtime, not stored)

`lib/data-server.ts` holds each dataset's full array in memory and computes per request:

- Profile lookup via a `byId` Map (dense id → row).
- Search: lowercase substring match over name + institution.
- Filters: exact match on field, country, subfield (`sm-subfield-1`), subfield 2 (`sm-subfield-2`); `firstYear ≥ N`.
- Sort and server-side pagination; a fast path skips sorting when the request is unfiltered rank-ascending.
- CSV export recomposes rows with the visible columns (self-citation % and `rankNs` are written as raw values).

## 7. Display-layer transformations

- **Self-citation percentage is stored as a fraction** (`0.11` = 11%); every display multiplies by 100. The table shows two decimals (11.00%), the metrics card one.
- **Career span** = `lastYear − firstYear`, computed in the component.
- **Country names** — the extract stores ISO3 codes; `lib/countries.ts` maps them to display names.
- **Bar scaling** — Top Fields / Top Countries bars use share scaling (`count / total`, matching the % label); Top Institutions uses rank scaling (`count / max`, no % label — shares are all <1%).
- **Number formatting** — tables show exact values with `toLocaleString("en-US")`; dashboard cards abbreviate (K/M/B).

## Known data caveats surfaced by these computations

- `"College of Engineering"` (824–1,171 scientists) is a junk institution value in the source; it surfaces honestly in the top-institutions list.
- `metadata.year` in the JSON files is `2025` — the citation window. The August 2026 update (V9) is what the UI labels as "2026".
- All singleyr metrics describe the 2025 citation window only; career metrics span 1788–2025. The two datasets share column names except the citations column (`nc2525` vs `nc9625`, handled by fallback).
