"use client";

import { Globe } from "lucide-react";
import { countryName } from "@/lib/countries";
import { formatNumber } from "@/lib/utils";
import { Scientist } from "@/types";

export function InternationalProfileCard({ scientist }: { scientist: Scientist }) {
  const s = scientist;
  return (
    <div className="rounded-lg border border-border p-4">
      <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
        <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        International Profile
      </h4>
      <dl className="space-y-2">
        {([
          ["Primary Country", countryName(s.top_cntry_career || s.country)],
          ["Country Share", `${((s.top_cntry_share ?? 0) * 100).toFixed(1)}%`],
          ["Countries (10%+)", s.cntry_10pct || "—"],
          ["Coverage", `${((s.cntry_cov ?? 0) * 100).toFixed(1)}%`],
          ["Subfield Count", s["sm-subfield-1 count"] ? formatNumber(s["sm-subfield-1 count"]) : "—"],
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
