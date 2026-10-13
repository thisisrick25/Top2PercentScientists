"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { Scientist } from "@/types";

export function TopResearchersCard({ scientists, dataset }: { scientists: Scientist[]; dataset: string }) {
  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Researchers</CardTitle>
          <Link href="/scientists" className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
            View all
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col" className="w-16">#</th>
                <th scope="col">Name</th>
                <th scope="col" className="hidden md:table-cell">Institution</th>
                <th scope="col" className="hidden lg:table-cell">Subfield</th>
                <th scope="col" className="w-24 text-right">Citations</th>
                <th scope="col" className="w-20 text-right">H-Index</th>
              </tr>
            </thead>
            <tbody>
              {scientists.slice(0, 10).map((scientist) => (
                <tr key={scientist.rank}>
                  <td className="font-mono text-xs text-muted-foreground">{scientist.rank}</td>
                  <td className="max-w-[180px] truncate font-medium">
                    <Link
                      href={`/scientists/${scientist.id}?dataset=${dataset}`}
                      className="transition-colors hover:text-foreground hover:underline"
                    >
                      {scientist.name}
                    </Link>
                  </td>
                  <td className="hidden max-w-[220px] truncate text-sm text-muted-foreground md:table-cell">{scientist.institution}</td>
                  <td className="hidden max-w-[180px] truncate text-sm text-muted-foreground lg:table-cell">{scientist.subfield}</td>
                  <td className="text-right font-mono text-xs tabular-nums">{formatNumber(scientist.citations)}</td>
                  <td className="text-right font-mono text-xs tabular-nums">{scientist.hIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
