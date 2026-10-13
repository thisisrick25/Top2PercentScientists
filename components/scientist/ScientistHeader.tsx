"use client";

import { Badge, FieldTag } from "@/components/ui";
import { countryName } from "@/lib/countries";
import { formatNumber, formatScore } from "@/lib/utils";
import { Scientist } from "@/types";

export function ScientistHeader({ scientist }: { scientist: Scientist }) {
  const s = scientist;
  const careerSpan = s.lastYear && s.firstYear ? s.lastYear - s.firstYear : null;

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between mb-6">
      <div className="flex items-start gap-4">
        <Badge rank={s.rank} variant="rank" className="h-12 min-w-[4.5rem] justify-center px-3 font-mono text-lg">
          #{s.rank.toLocaleString("en-US")}
        </Badge>
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">{s.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{s.institution || "—"}</span>
            {" · "}
            {countryName(s.country)}
            {careerSpan ? (
              <>
                {" · "}
                <span>
                  Active {s.firstYear}–{s.lastYear}
                  <span className="text-muted-foreground/70"> · {careerSpan} yrs</span>
                </span>
              </>
            ) : ""}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FieldTag variant="info">{s.field || "Unknown Field"}</FieldTag>
            <FieldTag variant="success">{s.subfield || "Unknown Subfield"}</FieldTag>
            {s["sm-subfield-2"] && <FieldTag variant="warning">{s["sm-subfield-2"]}</FieldTag>}
            {s.cosmoScore >= 1 && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs">
                <span className="text-muted-foreground">Cosmo</span>
                <span className="font-mono font-medium">Yes</span>
              </span>
            )}
            {s.rankNs != null && s.rankNs > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs">
                <span className="text-muted-foreground">Rank excl. self-citations</span>
                <span className="font-mono font-medium tabular-nums">#{s.rankNs.toLocaleString("en-US")}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      <dl className="grid shrink-0 grid-cols-2 gap-y-2 sm:grid-cols-4">
        {([
          ["C-Score", formatScore(s.compositeScore)],
          ["Citations", formatNumber(s.citations)],
          ["H-Index", String(s.hIndex)],
          ["HM-Index", formatScore(s.hmIndex)],
        ] as const).map(([label, value], i) => (
          <div key={label} className={i > 0 ? "text-center sm:border-l sm:border-border sm:px-4" : "text-center sm:pr-4"}>
            <dt className="text-caption text-tertiary">{label}</dt>
            <dd className="text-lg font-semibold font-mono tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
