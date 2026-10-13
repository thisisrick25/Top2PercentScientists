import { NextRequest, NextResponse } from "next/server";
import { getScientist, resolveDataset } from "@/lib/data-server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const dataset = resolveDataset(_request.nextUrl.searchParams.get("dataset"));
  const scientist = await getScientist(idNum, dataset);
  if (!scientist) {
    return NextResponse.json({ error: "Scientist not found" }, { status: 404 });
  }
  return NextResponse.json(scientist);
}
