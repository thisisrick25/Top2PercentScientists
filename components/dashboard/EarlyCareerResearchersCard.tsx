"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { Scientist } from "@/types";

export function EarlyCareerResearchersCard({ risingStars, dataset }: { risingStars: Scientist[]; dataset: string }) {
  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Early-Career Researchers
          <span className="text-caption text-tertiary">Started ≥ 2020</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {risingStars.length ? (
          <ul className="space-y-2.5">
            {risingStars.slice(0, 8).map((s) => (
              <li key={s.rank} className="flex items-center justify-between gap-2 text-sm">
                <Link
                  href={`/scientists/${s.id}?dataset=${dataset}`}
                  className="min-w-0 truncate transition-colors hover:text-foreground hover:underline"
                >
                  {s.name}
                </Link>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {s.firstYear} · {formatNumber(s.citations)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No early-career data</p>
        )}
      </CardContent>
    </Card>
  );
}
