# TODO

## Other scientist-ranking lists to explore (future)

The Stanford/Elsevier top 2% list (Ioannidis) is one of several; consider supporting or cross-referencing others:

- [ ] **Clarivate "Highly Cited Researchers"** — annual since 2014, Web of Science based, ~7,000 names across 21 ESI fields (top 1% cited papers per field+year). More selective, reputation-corrected.
- [ ] **TOPSCINET** — same Ioannidis/Elsevier data as this app, commercial front-end (headline rank = `rank (ns)`).
- [ ] **AD Scientific Index** — Turkey-based, 2M+ scientists, Google Scholar h-index/h10/citations (5y + career), by institution/country.
- [ ] **Research.com** — field-by-field rankings (CS, medicine, ...) from mixed sources.
- [ ] **ScholarGPS** — "Highly Ranked Scholars", 34 metrics, own curated database.
- [ ] **Webometrics / Google Scholar leaderboards** — unofficial h-index tables from Google Scholar profiles.
- [ ] **Academic Influence** — influence via Wikipedia citations / web traces, not publication metrics.

Notes:
- Citation universes differ: Clarivate = Web of Science, AD/Research.com = Google Scholar (inflated; merges preprint/journal versions), Ioannidis = Scopus. Same person ranks very differently across lists — cross-list comparison would need normalization.
- See `docs/ranks.md` for how the current dataset's rank columns work.
