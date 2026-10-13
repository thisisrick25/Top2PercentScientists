import { NextRequest, NextResponse } from "next/server";
import { queryScientists, resolveDataset } from "@/lib/data-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const result = await queryScientists({
    dataset: resolveDataset(sp.get("dataset")),
    search: sp.get("search") || undefined,
    field: sp.get("field") || undefined,
    country: sp.get("country") || undefined,
    subfield: sp.get("subfield") || undefined,
    subfield2: sp.get("subfield2") || undefined,
    firstYear: parseInt(sp.get("firstYear") || "", 10) || undefined,
    sortBy: sp.get("sortBy") || undefined,
    sortOrder: sp.get("sortOrder") === "desc" ? "desc" : "asc",
    page: Math.max(0, parseInt(sp.get("page") || "0", 10) || 0),
    pageSize: Math.min(500, Math.max(1, parseInt(sp.get("pageSize") || "50", 10) || 50)),
  });
  return NextResponse.json(result);
}
