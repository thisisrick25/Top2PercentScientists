# Impact ladder

What actually moves the needle in the dataset's composite score `c`, in increasing order of impact:

1. **Paper count** — the weakest signal. Publishing a lot adds nothing on its own; uncited papers contribute zero to the score.
2. **Total citations** — raw impact volume. Better than paper count, but a single viral paper can dominate, and co-authored citations get diluted across big teams.
3. **Consistently-cited many papers (h-index)** — sustained, broad impact. Many papers that each earn citations over time.
4. **Leading small-team work (hm-index)** — the biggest single weight in the formula. Citations from papers where the team was small and you were in it — credit that clearly reflects *you*.
5. **Solo / first-author writing** — feeds the most formula terms per citation. Single-author cites (`ncs`), first-author cites (`ncsf`), and first-author-last-author cites (`ncsfl`) each get their own term, so the same citation is worth more when you wrote (or anchored) the paper.

Why this order — the exact fitted formula (zero error on all 249,310 singleyr rows):

```
c = 0.0877·ln(1+cites) + 0.2123·ln(1+h) + 0.2615·ln(1+hm)
  + 0.1007·ln(1+ncs) + 0.0917·ln(1+ncsf) + 0.0906·ln(1+ncsfl)
```

- Paper count gets weight 0 — it only matters through the citations it attracts.
- Three of the six terms (`ncs`, `ncsf`, `ncsfl`) reward first-person authorship, which is why point 5 outranks raw totals.
- All terms are logarithmic: the first citations matter far more than the ten-thousandth.

A solo paper with zero citations is still worth zero — `ln(1+0) = 0` in all six terms. Solo writing is potential energy until the paper gets cited.

See `docs/ranks.md` for how ranking works once the score is computed.
