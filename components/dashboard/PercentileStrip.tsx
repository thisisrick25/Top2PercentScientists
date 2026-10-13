"use client";

import { PercentileBlock } from "@/types";

export function PercentileStrip({ label, p, fmt }: { label: string; p: PercentileBlock; fmt: (v: number) => string }) {
  const steps = [
    { k: "p50", v: p.p50 },
    { k: "p75", v: p.p75 },
    { k: "p90", v: p.p90 },
    { k: "p99", v: p.p99 },
    { k: "Max", v: p.max },
  ];
  return (
    <div className="flex items-center gap-4 border-b border-border py-3 last:border-0 last:pb-0">
      <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-1 items-center justify-between gap-2 sm:justify-end sm:gap-8">
        {steps.map((s) => (
          <div key={s.k} className="flex min-w-[3.5rem] flex-col items-center">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">{s.k}</span>
            <span className="font-mono text-xs font-medium tabular-nums">{fmt(s.v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
