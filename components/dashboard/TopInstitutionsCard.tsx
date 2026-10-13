"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CountEntry } from "@/types";

export function TopInstitutionsCard({ items, total }: { items: CountEntry[]; total: number }) {
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Top Institutions
          <span className="text-caption text-tertiary">Top 10 by scientist count</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col" className="w-16">#</th>
                <th scope="col">Institution</th>
                <th scope="col" className="w-28 text-right">Scientists</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 10).map((item, i) => (
                <tr key={item.name}>
                  <td className="font-mono text-xs text-muted-foreground">{i + 1}</td>
                  <td className="max-w-[280px] truncate font-medium">{item.name}</td>
                  <td className="text-right font-mono text-xs tabular-nums">{item.count.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
