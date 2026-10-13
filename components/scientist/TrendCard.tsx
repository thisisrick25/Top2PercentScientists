"use client";

import { ReactNode } from "react";

export function TrendCard({
  title,
  legend,
  children,
}: {
  title: string;
  legend: { label: string; className: string }[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {legend.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${l.className}`} aria-hidden="true" />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      {/* Placeholder chart area — multi-year trend data to be wired in later */}
      <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30">
        {children}
        <span className="text-xs text-muted-foreground/70">2026 snapshot · multi-year trend coming soon</span>
      </div>
    </div>
  );
}
