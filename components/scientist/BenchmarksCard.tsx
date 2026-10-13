"use client";

import { FieldTag } from "@/components/ui";
import { useFieldThresholds, useSubfieldThresholds } from "@/hooks/useScientists";
import { formatNumber, formatScore } from "@/lib/utils";
import { Scientist } from "@/types";

export function BenchmarksCard({ scientist }: { scientist: Scientist }) {
  const fieldThresholds = useFieldThresholds();
  const subfieldThresholds = useSubfieldThresholds();
  const s = scientist;
  const fieldT = fieldThresholds.find((t) => t.field === s.field);
  const subfieldT = subfieldThresholds.find((t) => t.subfield === s.subfield);
  const hasSub2 = Boolean(s["sm-subfield-2"]);
  const groupColW = hasSub2 ? "8.3333%" : "12.5%";

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col style={{ width: "13%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: groupColW }} />
            <col style={{ width: groupColW }} />
            <col style={{ width: groupColW }} />
            <col style={{ width: groupColW }} />
            <col style={{ width: groupColW }} />
            <col style={{ width: groupColW }} />
            {hasSub2 && (
              <>
                <col style={{ width: groupColW }} />
                <col style={{ width: groupColW }} />
                <col style={{ width: groupColW }} />
              </>
            )}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2} className="pb-2 pr-8 align-middle text-left">
                <h4 className="text-sm font-medium">Benchmarks</h4>
              </th>
              <th colSpan={3} className="border-l border-border px-3 pb-2 text-center align-middle font-normal">
                <FieldTag variant="info">{s.field || "Field"}</FieldTag>
              </th>
              <th colSpan={3} className="border-l border-border px-3 pb-2 text-center align-middle font-normal">
                <FieldTag variant="success">{s.subfield || "Subfield 1"}</FieldTag>
              </th>
              {s["sm-subfield-2"] && (
                <th colSpan={3} className="border-l border-border px-3 pb-2 text-center align-middle font-normal">
                  <FieldTag variant="warning">{s["sm-subfield-2"]}</FieldTag>
                </th>
              )}
            </tr>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-1.5 pr-8 font-medium">Metric</th>
              <th className="truncate py-1.5 pr-3 text-right font-medium">{s.name}</th>
              <th className="border-l border-border px-3 py-1.5 text-right font-medium">Top 1%</th>
              <th className="px-3 py-1.5 text-right font-medium">Top 5%</th>
              <th className="px-3 py-1.5 text-right font-medium">Top 10%</th>
              <th className="border-l border-border px-3 py-1.5 text-right font-medium">Top 1%</th>
              <th className="px-3 py-1.5 text-right font-medium">Top 5%</th>
              <th className="px-3 py-1.5 text-right font-medium">Top 10%</th>
              {s["sm-subfield-2"] && (
                <>
                  <th className="border-l border-border px-3 py-1.5 text-right font-medium">Top 1%</th>
                  <th className="px-3 py-1.5 text-right font-medium">Top 5%</th>
                  <th className="px-3 py-1.5 text-right font-medium">Top 10%</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            <tr className="border-b border-border/50">
              <td className="py-1.5 pr-8 font-sans">Composite Score (C)</td>
              <td className="py-1.5 pr-3 text-right font-semibold">{formatScore(s.compositeScore)}</td>
              <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatScore(fieldT.cPercentiles.p99) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatScore(fieldT.cPercentiles.p95) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatScore(fieldT.cPercentiles.p90) : "—"}</td>
              <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatScore(subfieldT.cPercentiles.p99) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatScore(subfieldT.cPercentiles.p95) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatScore(subfieldT.cPercentiles.p90) : "—"}</td>
              {s["sm-subfield-2"] && (() => {
                const t2 = subfieldThresholds.find((t) => t.subfield === s["sm-subfield-2"]);
                return (
                  <>
                    <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatScore(t2.cPercentiles.p99) : "—"}</td>
                    <td className="px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatScore(t2.cPercentiles.p95) : "—"}</td>
                    <td className="px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatScore(t2.cPercentiles.p90) : "—"}</td>
                  </>
                );
              })()}
            </tr>
            <tr>
              <td className="py-1.5 pr-8 font-sans">Citations</td>
              <td className="py-1.5 pr-3 text-right font-semibold">{formatNumber(s.citations)}</td>
              <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatNumber(Math.round(fieldT.citesPercentiles.p99)) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatNumber(Math.round(fieldT.citesPercentiles.p95)) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{fieldT ? formatNumber(Math.round(fieldT.citesPercentiles.p90)) : "—"}</td>
              <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatNumber(Math.round(subfieldT.citesPercentiles.p99)) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatNumber(Math.round(subfieldT.citesPercentiles.p95)) : "—"}</td>
              <td className="px-3 py-1.5 text-right text-muted-foreground">{subfieldT ? formatNumber(Math.round(subfieldT.citesPercentiles.p90)) : "—"}</td>
              {s["sm-subfield-2"] && (() => {
                const t2 = subfieldThresholds.find((t) => t.subfield === s["sm-subfield-2"]);
                return (
                  <>
                    <td className="border-l border-border px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatNumber(Math.round(t2.citesPercentiles.p99)) : "—"}</td>
                    <td className="px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatNumber(Math.round(t2.citesPercentiles.p95)) : "—"}</td>
                    <td className="px-3 py-1.5 text-right text-muted-foreground">{t2 ? formatNumber(Math.round(t2.citesPercentiles.p90)) : "—"}</td>
                  </>
                );
              })()}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
