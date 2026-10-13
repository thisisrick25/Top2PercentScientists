"use client";

import { Badge } from "@/components/ui/Badge";
import { CountEntry } from "@/types";

export function BarList({
  items,
  total,
  emptyLabel,
  scale = "share",
}: {
  items: CountEntry[];
  total: number;
  emptyLabel?: string;
  scale?: "share" | "relative" | "none";
}) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{emptyLabel ?? "No data"}</p>;
  const max = items[0].count || 1;
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const pct = total ? (item.count / total) * 100 : 0;
        const width = scale === "share" ? pct : (item.count / max) * 100;
        const pctText = pct >= 1 ? pct.toFixed(1) : pct.toFixed(2);
        const plain = scale === "none";
        return (
          <div key={item.name} className="flex items-center gap-3">
            <Badge rank={i + 1} variant="rank" className="w-9 shrink-0 justify-center">{i + 1}</Badge>
            <div className="min-w-0 flex-1">
              {plain ? (
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium">{item.name}</span>
                  <span className="ml-2 shrink-0 font-mono text-xs text-muted-foreground">
                    {item.count.toLocaleString("en-US")}
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{item.name}</span>
                    <span className="ml-2 shrink-0 font-mono text-xs text-muted-foreground">
                      {item.count.toLocaleString("en-US")}
                      {` (${pctText}%)`}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="presentation">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{ width: `${width}%` }}
                      role={scale === "share" ? "progressbar" : undefined}
                      aria-valuenow={Math.round(width * 10) / 10}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.name}: ${item.count.toLocaleString("en-US")} scientists (${pctText}% of total)${scale === "relative" ? ", bar length relative to top-ranked" : ""}`}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
