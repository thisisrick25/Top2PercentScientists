"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { FieldThreshold } from "@/types";

export function FieldPercentileLadderCard({ thresholds }: { thresholds: FieldThreshold[] }) {
  const ladder = useMemo(
    () => [...thresholds].sort((a, b) => b.totalAuthors - a.totalAuthors),
    [thresholds]
  );

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Field Percentile Ladder
          <span className="text-caption text-tertiary">Citation thresholds across all field authors</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {ladder.length ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col" className="text-right">Field authors</th>
                  <th scope="col" className="text-right">In top list</th>
                  <th scope="col" className="text-right">Cites @90</th>
                  <th scope="col" className="text-right">Cites @99</th>
                  <th scope="col" className="text-right">c @99</th>
                </tr>
              </thead>
              <tbody>
                {ladder.map((f) => (
                  <tr key={f.field}>
                    <td className="max-w-[240px] truncate font-medium">{f.field}</td>
                    <td className="text-right font-mono text-xs tabular-nums text-muted-foreground">{formatNumber(f.totalAuthors)}</td>
                    <td className="text-right font-mono text-xs tabular-nums">{f.topListPercentage.toFixed(2)}%</td>
                    <td className="text-right font-mono text-xs tabular-nums">{formatNumber(Math.round(f.citesPercentiles.p90))}</td>
                    <td className="text-right font-mono text-xs tabular-nums">{formatNumber(Math.round(f.citesPercentiles.p99))}</td>
                    <td className="text-right font-mono text-xs tabular-nums">{f.cPercentiles.p99.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-6 text-sm text-muted-foreground">Loading field thresholds…</p>
        )}
      </CardContent>
    </Card>
  );
}
