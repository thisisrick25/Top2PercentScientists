"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Download, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable } from "@/components/table/DataTable";
import { FilterBar } from "@/components/filters/FilterBar";
import { Button } from "@/components/ui/Button";
import { useScientists, useScientistsIndex } from "@/hooks/useScientists";
import { TableFilters } from "@/types";
import { cn, formatNumber, buildQueryString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

const DEFAULT_FILTERS: TableFilters = {
  search: "",
  field: "",
  country: "",
  subfield: "",
  subfield2: "",
  firstYear: "",
  dataset: "singleyr",
  density: "comfortable",
  sortBy: "rank",
  sortOrder: "asc",
  page: 0,
  pageSize: 50,
};

function ScientistsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL
  const [filters, setFilters] = useState<TableFilters>(() => ({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") || "",
    field: searchParams.get("field") || "",
    country: searchParams.get("country") || "",
    subfield: searchParams.get("subfield") || "",
    subfield2: searchParams.get("subfield2") || "",
    firstYear: searchParams.get("firstYear") || "",
    dataset: (searchParams.get("dataset") as "singleyr" | "career") || "singleyr",
    density: (searchParams.get("density") as "comfortable" | "compact") || DEFAULT_FILTERS.density,
    sortBy: searchParams.get("sortBy") || "rank",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    page: parseInt(searchParams.get("page") || "0", 10),
    pageSize: parseInt(searchParams.get("pageSize") || "50", 10),
  }));

  // Load index data for filter options
  const { index: singleyrIndex } = useScientistsIndex("singleyr");
  const { index: careerIndex } = useScientistsIndex("career");
  const activeIndex = filters.dataset === "singleyr" ? singleyrIndex : careerIndex;

  // Load scientists data
  const { scientists, totalCount, loading, error } = useScientists(filters);

  // Update URL when filters change (never call router inside the state updater —
  // updaters run during render, which would setState on Router mid-render)
  const updateFilters = useCallback(
    (newFilters: Partial<TableFilters>) => {
      const updated = { ...filters, ...newFilters };
      setFilters(updated);
      router.push(`${pathname}?${buildQueryString(updated)}`, { scroll: false });
    },
    [filters, pathname, router]
  );

  // Export to CSV (server-side, applies current filters)
  const handleExport = useCallback(() => {
    const params = new URLSearchParams({
      dataset: filters.dataset,
      sortBy: filters.sortBy || "rank",
      sortOrder: filters.sortOrder || "asc",
    });
    if (filters.search) params.set("search", filters.search);
    if (filters.field) params.set("field", filters.field);
    if (filters.country) params.set("country", filters.country);
    if (filters.subfield) params.set("subfield", filters.subfield);
    if (filters.subfield2) params.set("subfield2", filters.subfield2);
    if (filters.firstYear) params.set("firstYear", filters.firstYear);
    window.open(`/api/scientists/export?${params.toString()}`, "_blank");
  }, [filters]);

  const fields = activeIndex?.fields || [];
  const countries = activeIndex?.countries || [];
  const subfields = activeIndex?.subfields || [];

  const hasActiveFilters =
    filters.search || filters.field || filters.country || filters.subfield || filters.subfield2 || filters.firstYear;

  return (
    <div className="container-table py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-h1 text-primary mb-2">Scientists Explorer</h1>
          <p className="text-body text-secondary">
            Browse and filter {totalCount.toLocaleString("en-US")} scientists from the {filters.dataset === "singleyr" ? "Single-Year (2026)" : "Career"} ranking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport} disabled={loading}>
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Export Data
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={() => updateFilters({ search: "", field: "", country: "", subfield: "", subfield2: "", firstYear: "", page: 0 })}>
              <X className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        fields={fields}
        countries={countries}
        subfields={subfields}
      />

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {error && (
            <div className="p-6 text-center text-error" role="alert">
              Failed to load data: {error}
              <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          )}
          {!error && (
            <DataTable
              data={scientists}
              totalCount={totalCount}
              page={filters.page}
              pageSize={filters.pageSize}
              sortId={filters.sortBy || "rank"}
              sortDesc={filters.sortOrder === "desc"}
              loading={loading}
              dataset={filters.dataset}
              density={filters.density}
              className="h-[calc(100vh-400px)] min-h-[500px]"
              onPageChange={(p) => updateFilters({ page: p })}
              onPageSizeChange={(size) => updateFilters({ pageSize: size, page: 0 })}
              onSortChange={(id, desc) => updateFilters({ sortBy: id, sortOrder: desc ? "desc" : "asc", page: 0 })}
              onDensityChange={(d) => updateFilters({ density: d })}
            />
          )}
        </CardContent>
      </Card>

      
    </div>
  );
}

export default function ScientistsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[calc(100vh-400px)] min-h-[500px]" />}>
      <ScientistsContent />
    </Suspense>
  );
}