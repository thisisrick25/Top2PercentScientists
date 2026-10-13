"use client";

import { TrendingUp } from "lucide-react";
import { formatNumber, formatScore } from "@/lib/utils";
import { Scientist } from "@/types";

export function CitationMetricsCard({ scientist }: { scientist: Scientist }) {
  const s = scientist;
  return (
    <div className="rounded-lg border border-border p-4">
      <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
        <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        Citation Metrics
      </h4>
      <dl className="space-y-2">
        {([
          ["Distinct Citing Papers", formatNumber(s.distinctCitingPapers)],
          ["Single-Author Citations", formatNumber(s.ncs)],
          ["First/Last Author Citations", formatNumber(s.ncsfl)],
          ["Citation Ratio", formatScore(s.citationRatio)],
          ["Self-Citations", `${(s.selfCitationPct * 100).toFixed(1)}%`],
          ["Subfield Rank", s.rankInSubfield ? `#${s.rankInSubfield.toLocaleString("en-US")}` : "—"],
        ] as const).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-mono tabular-nums font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
