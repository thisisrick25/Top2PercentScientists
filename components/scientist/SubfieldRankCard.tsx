"use client";

import { FieldTag } from "@/components/ui";

export function SubfieldRankCard({
  title,
  subfield,
  tagVariant,
  rankAll,
  rankNs,
  emptyLabel,
}: {
  title: string;
  subfield?: string;
  tagVariant: "success" | "warning";
  rankAll?: number;
  rankNs?: number;
  emptyLabel?: string;
}) {
  const fmt = (v?: number) => (v ? `#${v.toLocaleString("en-US")}` : "—");
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium">{title}</h4>
        {subfield ? (
          <FieldTag variant={tagVariant}>{subfield}</FieldTag>
        ) : (
          <span className="text-xs text-muted-foreground">{emptyLabel}</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--status-info)]" aria-hidden="true" />
          Rank (All Citations)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" aria-hidden="true" />
          Rank (Self-Citations Excluded)
        </span>
      </div>
      {/* Placeholder chart area — multi-year trend data to be wired in later */}
      <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="font-mono text-xl font-semibold tabular-nums">{fmt(rankAll)}</div>
            <div className="mt-1 text-xs text-muted-foreground">All Citations</div>
          </div>
          <div className="h-8 w-px bg-border" aria-hidden="true" />
          <div className="text-center">
            <div className="font-mono text-xl font-semibold tabular-nums">{fmt(rankNs)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Excl. Self-Citations</div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground/70">2026 snapshot · multi-year trend coming soon</span>
      </div>
    </div>
  );
}
