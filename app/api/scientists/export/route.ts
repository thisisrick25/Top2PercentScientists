import { NextRequest } from "next/server";
import { Dataset, filterAll, resolveDataset } from "@/lib/data-server";

export const dynamic = "force-dynamic";

const CSV_COLUMNS: [string, (s: Record<string, unknown>) => string | number][] = [
  ["rank", (s) => Number(s.rank)],
  ["name", (s) => String(s.name ?? "")],
  ["institution", (s) => String(s.institution ?? "")],
  ["country", (s) => String(s.country ?? "")],
  ["field", (s) => String(s.field ?? "")],
  ["subfield", (s) => String(s.subfield ?? "")],
  ["subfield2", (s) => String(s["sm-subfield-2"] ?? "")],
  ["citations", (s) => Number(s.citations ?? 0)],
  ["hIndex", (s) => Number(s.hIndex ?? 0)],
  ["hmIndex", (s) => Number(s.hmIndex ?? 0)],
  ["compositeScore", (s) => Number(s.compositeScore ?? 0)],
  ["papers", (s) => Number(s.papers ?? 0)],
  ["firstYear", (s) => Number(s.firstYear ?? 0)],
  ["lastYear", (s) => Number(s.lastYear ?? 0)],
  ["selfCitationPct", (s) => Number(s.selfCitationPct ?? 0)],
  ["citationRatio", (s) => Number(s.citationRatio ?? 0)],
  ["rankNs", (s) => Number(s.rankNs ?? 0)],
];

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const dataset: Dataset = resolveDataset(sp.get("dataset"));
  const rows = await filterAll({
    dataset,
    search: sp.get("search") || undefined,
    field: sp.get("field") || undefined,
    country: sp.get("country") || undefined,
    subfield: sp.get("subfield") || undefined,
    subfield2: sp.get("subfield2") || undefined,
    firstYear: parseInt(sp.get("firstYear") || "", 10) || undefined,
    sortBy: sp.get("sortBy") || undefined,
    sortOrder: sp.get("sortOrder") === "desc" ? "desc" : "asc",
  });

  const header = CSV_COLUMNS.map(([name]) => name).join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map(([, get]) => escapeCsv(get(row as unknown as Record<string, unknown>))).join(","),
  );
  const csv = [header, ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="top2percent-${dataset}.csv"`,
    },
  });
}
