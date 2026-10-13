"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PercentileStrip } from "./PercentileStrip";
import { formatNumber } from "@/lib/utils";
import { Aggregates } from "@/types";

export function MetricDistributionsCard({ aggregates }: { aggregates?: Aggregates }) {
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <CardTitle>Metric Distributions</CardTitle>
      </CardHeader>
      <CardContent>
        {aggregates ? (
          <div>
            <PercentileStrip label="Citations" p={aggregates.percentiles.citations} fmt={(v) => formatNumber(Math.round(v))} />
            <PercentileStrip label="H-Index" p={aggregates.percentiles.hIndex} fmt={(v) => Math.round(v).toString()} />
            <PercentileStrip label="C-Score" p={aggregates.percentiles.compositeScore} fmt={(v) => v.toFixed(2)} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No distribution data</p>
        )}
      </CardContent>
    </Card>
  );
}
