"use client";

import { BookOpen } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Scientist } from "@/types";

export function PublicationRecordCard({ scientist }: { scientist: Scientist }) {
  const s = scientist;
  return (
    <div className="rounded-lg border border-border p-4">
      <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
        <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        Publication Record
      </h4>
      <dl className="space-y-2">
        {([
          ["Total Papers", formatNumber(s.papers)],
          ["Single-Author Papers", formatNumber(s.nps)],
          ["First/Last Author Papers", formatNumber(s.npsfl)],
          ["First Publication", s.firstYear || "—"],
          ["Last Publication", s.lastYear || "—"],
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
