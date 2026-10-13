# Rank Columns Explained — `rank` vs `rank (ns)`

How the ranking columns in the Stanford/Elsevier Top 2% Scientists dataset (August 2026 update, V9) work, verified empirically against `public/data/singleyr.csv` (249,310 scientists) and the `Key` sheet of the source xlsx. The career file (243,949 scientists) ships the same paired columns and follows the same scheme (not separately re-verified).

## 1. What each column is

The source CSV ships **paired columns** — every citation metric has a `(ns)` twin computed with self-citations excluded:

| Column | Ranked by | Self-citations |
| --- | --- | --- |
| `rank` | composite score `c` | **included** (all citations) |
| `rank (ns)` | composite score `c (ns)` | **excluded** |
| `rank sm-subfield-1` | `c` within the author's top Science-Metrix subfield | included |
| `rank sm-subfield-1 (ns)` | `c (ns)` within that subfield | excluded |

From the xlsx `Key` sheet:

- `rank` → "all citations | rank based on composite score c"
- `rank (ns)` → "self-citations excluded | rank based on composite score c"

Other paired columns: `nc2525 (ns)`, `h25 (ns)`, `hm25 (ns)`, `nps (ns)`, `ncs (ns)`, `cpsf (ns)`, `ncsf (ns)`, `npsfl (ns)`, `ncsfl (ns)`, `npciting (ns)`, `cprat (ns)`.

## 2. Neither rank is computed among the 249,310 rows

Both ranks are positions in **much larger universes**. The published file is only the top ~2% extract.

| | `rank` | `rank (ns)` |
| --- | --- | --- |
| Ranked by | `c` (all citations) | `c (ns)` (no self-citations) |
| Universe size (from max rank in file) | ≥ **1,472,484** authors | ≥ **10,364,220** authors |
| Median rank of the 249,310 published scientists | 129,029 → top 8.8% of that pool | 129,784 → top 1.3% of that pool |

Evidence:

- Max rank far exceeds the row count (5.9x for `rank`, 41.6x for `rank (ns)`).
- Rank values are sparse: ~1.22M missing rank slots between consecutive rows for `rank`, ~10.1M for `rank (ns)`. Those missing slots are the authors ranked between/after the published rows who were **not** included in the extract.
- `rank (ns)`'s ~10.4M universe is essentially the whole Scopus author population (1996–2025); the ~1.47M universe for `rank` is the pool of authors meeting the composite-indicator inclusion criteria.

## 3. Ranking mechanism: competition ranking by composite score

- Sorting the file by `c` descending makes `rank` perfectly monotonic — **0 violations** out of 249,310.
- All 276 rows sharing an identical `c` share an identical `rank` (113 tied rank values; e.g. rank 64,553 = Tsai, Shupei + Shiffrin, Seana Valentine). Ties ⟺ identical composite scores.
- Same holds exactly for `c (ns)` → `rank (ns)` (0 violations; the file itself is **sorted by `rank (ns)`** ascending).

## 4. Why only 249,310 people are in the list

The file is an **extract** (filename: `..._wopp_extracted_202608.xlsx`). The full universe is ranked internally, but only the top ~2% slice is published — this is the "Top 2%" of the list's name.

Per-field check (extract row count vs Table 2 `field-thresholds.json` full-universe `totalAuthors`):

| Field | Full universe | In extract | Share |
| --- | ---: | ---: | ---: |
| Clinical Medicine | 3,599,268 | 76,155 | 2.12% |
| Enabling & Strategic Technologies | 1,074,096 | 23,813 | 2.22% |
| Physics & Astronomy | 912,046 | 20,385 | 2.24% |
| ICT | 910,811 | 18,085 | 1.99% |
| Engineering | 910,141 | 19,557 | 2.15% |
| Biomedical Research | 897,823 | 17,948 | 2.00% |
| Chemistry | 804,950 | 16,855 | 2.09% |
| Biology | 445,736 | 9,494 | 2.13% |
| Agriculture, Fisheries & Forestry | 434,489 | 8,762 | 2.02% |
| Earth & Environmental Sciences | 399,932 | 8,545 | 2.14% |
| **Total (all 20 fields)** | **11,619,253** | **249,310** | **2.15%** |

Every field lands at ~2%. The near-uniform share across all 20 fields indicates the cut is applied **per field** (top 2% of each field's universe, by each scientist's primary `sm-field`) rather than globally — a global cut would make field shares drift apart. Equivalent whole-universe view: 249,310 / 10,364,220 ≈ **2.41%** of the Scopus universe ranked by `c (ns)` — consistent with the file being sorted by `rank (ns)` and cut at the 2% threshold.

## 5. How the two ranks relate — the self-citation effect

`diff = rank (ns) − rank` (positive = worse without self-citations) rises steadily with the author's self-citation share (`self%`, a 0–1 fraction): Pearson 0.54, Spearman 0.73, with bucket medians increasing monotonically. Crossover at ~10% self-citations:

| Self-citation share | Scientists | Median rank change (ns vs all) |
| --- | ---: | ---: |
| 0–5% | 72,619 | **−12,108** (improves) |
| 5–10% | 80,202 | −4,364 (improves) |
| 10–20% | 73,579 | +4,410 (worsens) |
| 20–40% | 20,104 | +40,830 (worsens) |
| 40–100% | 2,806 | **+179,226** (worsens a lot) |

Overall: 61.9% improve, 38.1% worsen, 46 unchanged.

Why the median improves despite the bigger ns universe: excluding self-citations removes self-citation inflation from everyone's score; scientists who barely self-cite gain places relative to heavy self-citers.

Extreme examples:

- 100% self-citers → `c (ns)` = 0 → `rank (ns)` ≈ 10,364,220 (bottom of the universe, tied with every other zero-score author). E.g. Gildenkov, Yamazaki.
- Boonpok, Chawalit (98.1% self): rank 1,875 → rank (ns) 2,069,010.

Note: even authors with `self%` = 0 (6,055 rows) have `rank ≠ rank (ns)` — the two rankings use different universes, so the numbers never coincide.

## 6. Cross-check with TOPSCINET

TOPSCINET's headline "2026 Rank" for an author is the **`rank (ns)`** value (self-citations excluded, whole-universe ranking). The dataset's **`rank`** column (all citations) matches TOPSCINET's "All" column. The year in their profile URL is the author's `firstyr` (career start). The two numbers can differ by orders of magnitude for heavy self-citers (see section 5).

## 7. Why the app URLs use a dense `id`, not `rank`

The dataset's official `rank` column cannot serve as a stable per-scientist key:

1. **Ties** — 113 rank values are shared by 2+ scientists, so `/scientists/{rank}` would be ambiguous (one page, two people).
2. **Gaps** — ranks skip numbers (max 1,472,484 for 249,310 rows), because the extract only contains a sparse slice of the full universe.
3. **Duplicate keys** — tied ranks collide as row keys in the data table.

Fix introduced in the processing pipeline: each scientist gets `id = 1 + array index` in the processed JSON (file order = `rank (ns)` order = official top-2% order). URLs use `/scientists/{id}`; the profile page still displays the official rank badge (e.g. `#64,553` for both members of a tied pair, at `/scientists/64553` and `/scientists/64554`).
