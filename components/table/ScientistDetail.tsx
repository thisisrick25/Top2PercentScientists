"use client";

import {
  BenchmarksCard,
  CitationMetricsCard,
  InternationalProfileCard,
  MetricsTableCard,
  PublicationRecordCard,
  ScientistHeader,
  SubfieldRankCard,
  TrendCard,
} from "@/components/scientist";
import { Scientist } from "@/types";

export function ScientistDetail({ scientist, dataset = "singleyr" }: { scientist: Scientist; dataset?: "singleyr" | "career" }) {
  const s = scientist;

  return (
    <div className="p-6 animate-fade-in">
      {/* Identity */}
      <ScientistHeader scientist={s} />

      {/* Detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <PublicationRecordCard scientist={s} />
        <CitationMetricsCard scientist={s} />
        <InternationalProfileCard scientist={s} />
      </div>

      {/* Metrics table + stacked subfield rank widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <MetricsTableCard scientist={s} dataset={dataset} />

        {/* Rank in Subfield 1 & 2 — placeholder widgets (multi-year data to be added later) */}
        <div className="flex flex-col gap-4">
          <SubfieldRankCard
            title="Rank in Subfield 1"
            subfield={s.subfield}
            tagVariant="success"
            rankAll={s.rankInSubfield}
            rankNs={s.rankInSubfieldNs}
          />
          <SubfieldRankCard
            title="Rank in Subfield 2"
            subfield={s["sm-subfield-2"]}
            tagVariant="warning"
            rankAll={s.rankInSubfield2}
            rankNs={s.rankInSubfield2Ns}
            emptyLabel="No secondary subfield"
          />
        </div>
      </div>

      {/* Publications & Citations yearly trend — placeholder widgets (multi-year data to be added later) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TrendCard title="Publications" legend={[{ label: "Total Publications", className: "bg-[var(--status-info)]" }]}>
          <div className="text-center">
            <div className="font-mono text-xl font-semibold tabular-nums">{s.papers.toLocaleString("en-US")}</div>
            <div className="mt-1 text-xs text-muted-foreground">papers · cumulative</div>
          </div>
        </TrendCard>
        <TrendCard
          title="Citations"
          legend={[
            { label: "All Citations", className: "bg-[var(--status-info)]" },
            { label: "Self-Citations Excluded", className: "bg-teal-500" },
          ]}
        >
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-xl font-semibold tabular-nums">{s.citations.toLocaleString("en-US")}</div>
              <div className="mt-1 text-xs text-muted-foreground">All Citations</div>
            </div>
            <div className="h-8 w-px bg-border" aria-hidden="true" />
            <div className="text-center">
              <div className="font-mono text-xl font-semibold tabular-nums">{(s.citationsNs ?? 0).toLocaleString("en-US")}</div>
              <div className="mt-1 text-xs text-muted-foreground">Excl. Self-Citations</div>
            </div>
          </div>
        </TrendCard>
      </div>

      {/* Benchmarks — You vs Field / Subfield 1 / Subfield 2 top-percentile cutoffs */}
      <BenchmarksCard scientist={s} />
    </div>
  );
}
