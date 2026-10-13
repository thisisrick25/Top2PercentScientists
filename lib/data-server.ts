import fs from "fs";
import path from "path";
import { Scientist } from "@/types";

export type Dataset = "singleyr" | "career";

interface DatasetData {
  rows: Scientist[];
  byId: Map<number, Scientist>;
}

const caches = new Map<Dataset, Promise<DatasetData>>();

function loadDataset(dataset: Dataset): Promise<DatasetData> {
  let entry = caches.get(dataset);
  if (!entry) {
    entry = (async () => {
      const file = path.join(process.cwd(), "public", "data", `${dataset}.full.json`);
      const raw = await fs.promises.readFile(file, "utf8");
      const data = JSON.parse(raw) as { scientists: Scientist[] };
      const rows = data.scientists;
      // Dense unique id (1-based array index). The official `rank` column has ties
      // and gaps, so it cannot be used as a URL key. File order = official rank order.
      rows.forEach((r, i) => {
        r.id = i + 1;
      });
      const byId = new Map(rows.map((r) => [r.id as number, r]));
      return { rows, byId };
    })();
    caches.set(dataset, entry);
  }
  return entry;
}

export interface QueryParams {
  dataset: Dataset;
  search?: string;
  field?: string;
  country?: string;
  subfield?: string;
  subfield2?: string;
  firstYear?: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export async function queryScientists(params: QueryParams) {
  const { rows } = await loadDataset(params.dataset);

  let filtered = rows;
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.institution || "").toLowerCase().includes(q),
    );
  }
  if (params.field) filtered = filtered.filter((s) => s.field === params.field);
  if (params.country) filtered = filtered.filter((s) => s.country === params.country);
  if (params.subfield) filtered = filtered.filter((s) => s.subfield === params.subfield);
  if (params.subfield2) filtered = filtered.filter((s) => s["sm-subfield-2"] === params.subfield2);
  if (params.firstYear) filtered = filtered.filter((s) => (s.firstYear || 0) >= params.firstYear!);

  const total = filtered.length;
  const sortField = (params.sortBy || "rank") as keyof Scientist;
  const asc = (params.sortOrder || "asc") === "asc";

  let pageRows: Scientist[];
  const sorted =
    sortField === "rank" &&
    asc &&
    !params.search &&
    !params.field &&
    !params.country &&
    !params.subfield &&
    !params.subfield2 &&
    !params.firstYear;
  if (sorted) {
    const start = params.page * params.pageSize;
    pageRows = filtered.slice(start, start + params.pageSize);
  } else {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return asc ? 1 : -1;
      if (bVal == null) return asc ? -1 : 1;
      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });
    const start = params.page * params.pageSize;
    pageRows = copy.slice(start, start + params.pageSize);
  }

  return { rows: pageRows, total, page: params.page, pageSize: params.pageSize };
}

export async function getScientist(id: number, dataset: Dataset) {
  const { byId } = await loadDataset(dataset);
  return byId.get(id) ?? null;
}

export async function filterAll(params: Omit<QueryParams, "page" | "pageSize">) {
  const { rows } = await loadDataset(params.dataset);
  let filtered = rows;
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.institution || "").toLowerCase().includes(q),
    );
  }
  if (params.field) filtered = filtered.filter((s) => s.field === params.field);
  if (params.country) filtered = filtered.filter((s) => s.country === params.country);
  if (params.subfield) filtered = filtered.filter((s) => s.subfield === params.subfield);
  if (params.subfield2) filtered = filtered.filter((s) => s["sm-subfield-2"] === params.subfield2);
  if (params.firstYear) filtered = filtered.filter((s) => (s.firstYear || 0) >= params.firstYear!);

  const sortField = (params.sortBy || "rank") as keyof Scientist;
  const asc = (params.sortOrder || "asc") === "asc";
  if (!(sortField === "rank" && asc)) {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return asc ? 1 : -1;
      if (bVal == null) return asc ? -1 : 1;
      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });
    filtered = copy;
  }
  return filtered;
}

export function resolveDataset(value: string | null): Dataset {
  return value === "career" ? "career" : "singleyr";
}

/** Fire-and-forget cache warming (used by instrumentation.ts on server start). */
export function loadDatasetWarm(dataset: Dataset) {
  void loadDataset(dataset).catch(() => {});
}

