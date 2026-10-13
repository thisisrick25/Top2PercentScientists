"use client";

import { BookOpen, Award, Globe, Users } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { formatNumber } from "@/lib/utils";
import { ScientistIndex } from "@/types";

const statCards = [
  { label: "Total Scientists", icon: Users },
  { label: "Countries Represented", icon: Globe },
  { label: "Research Fields", icon: BookOpen },
  { label: "Top Citations", icon: Award },
];

export function KpiCards({ index, total }: { index: ScientistIndex | null; total: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Key metrics">
      {statCards.map(({ label, icon: Icon }, i) => {
        const topCitations = index?.stats.maxCitations ?? 0;
        const topHIndex = index?.stats.maxHIndex ?? 0;

        return (
          <StatCard
            key={i}
            label={label}
            value={
              i === 0 ? total.toLocaleString("en-US") :
              i === 1 ? (index?.countries.length ?? 0).toLocaleString("en-US") :
              i === 2 ? (index?.fields.length ?? 0).toLocaleString("en-US") :
              formatNumber(topCitations)
            }
            delta={
              i === 3 ? `Max H-Index: ${topHIndex}` :
              i === 0 ? `${(index?.subfields.length ?? 0).toLocaleString("en-US")} subfields` :
              i === 1 ? `out of ${total.toLocaleString("en-US")} scientists` :
              `out of ${total.toLocaleString("en-US")} scientists`
            }
          >
            <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          </StatCard>
        );
      })}
    </div>
  );
}
