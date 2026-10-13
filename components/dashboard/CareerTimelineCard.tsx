"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TimelineRow {
  label: string;
  count: number;
  pct: number;
}

export function CareerTimelineCard({ decadeCounts }: { decadeCounts?: Record<string, number> }) {
  const decadeData = useMemo<TimelineRow[]>(() => {
    const entries = Object.entries(decadeCounts ?? {})
      .filter(([, count]) => count > 0)
      .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));
    if (!entries.length) return [];
    const shown = entries.slice(-7);
    const older = entries.slice(0, -7);
    const olderCount = older.reduce((sum, [, count]) => sum + count, 0);
    const rows = olderCount
      ? [{ label: `Pre-${shown[0][0].slice(0, 4)}`, count: olderCount }, ...shown.map(([label, count]) => ({ label, count }))]
      : shown.map(([label, count]) => ({ label, count }));
    const max = Math.max(...rows.map((r) => r.count)) || 1;
    return rows.map((r) => ({ ...r, pct: (r.count / max) * 100 }));
  }, [decadeCounts]);

  const recentCount = decadeCounts?.["2020s"] ?? 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Career Start Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-28 gap-2" role="img" aria-label="Number of scientists by decade their career started">
          {decadeData.map((d) => (
            <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm bg-foreground/85"
                  style={{ height: `${d.pct}%` }}
                  title={`${d.label}: ${d.count.toLocaleString("en-US")} scientists`}
                />
              </div>
              <span className="w-full truncate text-center text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
        {recentCount > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-foreground">{recentCount.toLocaleString("en-US")}</strong>{" "}
              careers started in the 2020s made this list
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
