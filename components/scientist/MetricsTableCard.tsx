"use client";

import { Table2 } from "lucide-react";
import { Scientist } from "@/types";

export function MetricsTableCard({ scientist, dataset = "singleyr" }: { scientist: Scientist; dataset?: "singleyr" | "career" }) {
  const s = scientist;
  return (
    <div className="rounded-lg border border-border p-4">
      <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
        <Table2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {dataset === "singleyr" ? "Data for the Year: 2026" : "Career-Long Data (through 2026)"}
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="py-1 font-medium">Metrics</th>
            <th className="py-1 text-right font-medium">Self-Citations Excluded</th>
            <th className="py-1 text-right font-medium">All</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {([
            { label: "Rank Based on Composite Score", ns: s.rankNs, all: s.rank, fmt: "rank" },
            { label: "Total Cites", ns: s.citationsNs, all: s.citations, fmt: "int" },
            { label: "H-index", ns: s.hIndexNs, all: s.hIndex, fmt: "int" },
            { label: "Hm-index", ns: s.hmIndexNs, all: s.hmIndex, fmt: "dec" },
            { label: "Number of Single Authored Papers", ns: s.npsNs, all: s.nps, fmt: "int" },
            { label: "Total Cites to Single Authored Papers", ns: s.ncsNs, all: s.ncs, fmt: "int" },
            { label: "Number of Single+First Authored Papers", ns: s.cpsfNs, all: s.cpsf, fmt: "int" },
            { label: "Total Cites to Single+First Authored Papers", ns: s.ncsfNs, all: s.ncsf, fmt: "int" },
            { label: "Number of Single+First+Last Authored Papers", ns: s.npsflNs, all: s.npsfl, fmt: "int" },
            { label: "Total Cites to Single+First+Last Authored Papers", ns: s.ncsflNs, all: s.ncsfl, fmt: "int" },
            { label: "Composite Score", ns: s.compositeScoreNs, all: s.compositeScore, fmt: "dec" },
            { label: "Number of Distinct Citing Papers", ns: s.npcitingNs, all: s.distinctCitingPapers, fmt: "int" },
            { label: "Ratio of Total Citations to Distinct Citing Papers", ns: s.cpratNs, all: s.citationRatio, fmt: "dec" },
          ] as const).map((row) => (
            <tr key={row.label} className="border-b border-border/50 last:border-b-0">
              <td className="py-1 font-sans">{row.label}</td>
              <td className="py-1 text-right font-medium">
                {row.fmt === "rank"
                  ? row.ns
                    ? `#${row.ns.toLocaleString("en-US")}`
                    : "—"
                  : row.fmt === "dec"
                    ? (row.ns ?? 0).toFixed(2)
                    : (row.ns ?? 0).toLocaleString("en-US")}
              </td>
              <td className="py-1 text-right font-semibold">
                {row.fmt === "rank"
                  ? row.all
                    ? `#${row.all.toLocaleString("en-US")}`
                    : "—"
                  : row.fmt === "dec"
                    ? (row.all ?? 0).toFixed(2)
                    : (row.all ?? 0).toLocaleString("en-US")}
              </td>
            </tr>
          ))}
          <tr className="border-b border-border/50 last:border-b-0">
            <td className="py-1 font-sans">Self-Citation Percentage</td>
            <td colSpan={2} className="py-1">
              <div className="flex items-center justify-end gap-3">
                <div className="h-2.5 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[var(--status-info)]"
                    style={{ width: `${Math.min(100, s.selfCitationPct * 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono tabular-nums">{(s.selfCitationPct * 100).toFixed(2)}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
