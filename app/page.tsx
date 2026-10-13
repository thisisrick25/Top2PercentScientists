"use client";

import { useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import {
  KpiCards,
  TopFieldsCard,
  TopCountriesCard,
  TopResearchersCard,
  CareerTimelineCard,
  EarlyCareerResearchersCard,
  TopInstitutionsCard,
  MetricDistributionsCard,
  FieldPercentileLadderCard,
} from "@/components/dashboard";
import { useScientistsIndex, useFieldThresholds } from "@/hooks/useScientists";
import { cn } from "@/lib/utils";

const datasets = [
  { value: "singleyr" as const, label: "Single-Year (2026)" },
  { value: "career" as const, label: "Career Impact" },
];

export default function DashboardPage() {
  const { index: singleyrIndex, loading: singleyrLoading } = useScientistsIndex("singleyr");
  const { index: careerIndex, loading: careerIndexLoading } = useScientistsIndex("career");
  const fieldThresholds = useFieldThresholds();
  const [activeDataset, setActiveDataset] = useState<"singleyr" | "career">("singleyr");

  const index = activeDataset === "singleyr" ? singleyrIndex : careerIndex;
  const loading = activeDataset === "singleyr" ? singleyrLoading : careerIndexLoading;

  const total = index?.metadata.totalScientists ?? 0;
  const aggregates = index?.aggregates;

  if (loading && !index) {
    return (
      <div className="container-dashboard py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <StatCard key={i} label="Loading..." value="—" loading />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-dashboard py-10">
      <section className="mb-8" aria-labelledby="dashboard-title">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 id="dashboard-title" className="text-display text-primary mb-1">
              Overview
            </h1>
            <p className="text-body-sm text-secondary max-w-2xl">
              Explore the world's most influential researchers from the Stanford/Elsevier 2026 ranking —{" "}
              {total.toLocaleString("en-US")} scientists across {index?.fields.length} fields and{" "}
              {index?.countries.length} countries.
            </p>
          </div>
          <div className="segmented" role="radiogroup" aria-label="Dataset">
            {datasets.map((d) => (
              <button
                key={d.value}
                type="button"
                role="radio"
                aria-checked={activeDataset === d.value}
                className={cn("segmented__item", activeDataset === d.value && "segmented__item--active")}
                onClick={() => setActiveDataset(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <KpiCards index={index} total={total} />

      <div className="grid-bento mt-6">
        <TopFieldsCard items={aggregates?.fieldCounts ?? []} total={total} />
        <TopCountriesCard items={aggregates?.countryCounts ?? []} total={total} />
        <TopResearchersCard scientists={index?.topScientists ?? []} dataset={activeDataset} />
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          <CareerTimelineCard decadeCounts={aggregates?.decadeCounts} />
          <EarlyCareerResearchersCard risingStars={aggregates?.risingStars ?? []} dataset={activeDataset} />
        </div>
        <TopInstitutionsCard items={aggregates?.institutionCounts ?? []} total={total} />
        <MetricDistributionsCard aggregates={aggregates} />
        <FieldPercentileLadderCard thresholds={fieldThresholds} />
      </div>
    </div>
  );
}
