"use client";

import Link from "next/link";
import { cn, formatNumber, formatScore } from "@/lib/utils";
import { Scientist } from "@/types";
import { Badge, FieldTag } from "@/components/ui";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Rows3 } from "lucide-react";
import { Button } from "@/components/ui";

interface DataTableProps {
  data: Scientist[];
  totalCount: number;
  page: number;
  pageSize: number;
  sortId: string;
  sortDesc: boolean;
  loading?: boolean;
  dataset?: "singleyr" | "career";
  density?: "comfortable" | "compact";
  className?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (columnId: string, desc: boolean) => void;
  onDensityChange?: (density: "comfortable" | "compact") => void;
}

const COLUMNS = [
  { key: "rank", header: "Rank", width: 70 },
  { key: "name", header: "Name", width: 200 },
  { key: "institution", header: "Institution", width: 220 },
  { key: "country", header: "Country", width: 80 },
  { key: "field", header: "Field", width: 200 },
  { key: "subfield", header: "Subfield 1", width: 220 },
  { key: "sm-subfield-2", header: "Subfield 2", width: 200 },
  { key: "citations", header: "Citations", width: 100 },
  { key: "hIndex", header: "H-Index", width: 80 },
  { key: "hmIndex", header: "HM-Index", width: 90 },
  { key: "compositeScore", header: "C-Score", width: 90 },
  { key: "papers", header: "Papers", width: 80 },
  { key: "firstYear", header: "First Year", width: 90 },
  { key: "lastYear", header: "Last Year", width: 90 },
];

export function DataTable({
  data,
  totalCount,
  page,
  pageSize,
  sortId,
  sortDesc,
  loading = false,
  dataset = "singleyr",
  density = "comfortable",
  className,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onDensityChange,
}: DataTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const getSortIcon = (columnId: string) => {
    if (sortId !== columnId) return <ChevronUp className="h-3.5 w-3.5 opacity-0" />;
    return sortDesc ? <ChevronDown className="h-3.5 w-3.5 text-foreground" /> : <ChevronUp className="h-3.5 w-3.5 text-foreground" />;
  };

  const renderCell = (scientist: Scientist, column: typeof COLUMNS[0]) => {
    const value = scientist[column.key as keyof Scientist];
    switch (column.key) {
      case "rank":
        return <Badge rank={value as number} variant="rank" className="min-w-[3rem] justify-center">{value}</Badge>;
      case "name":
        return (
          <Link
            href={`/scientists/${scientist.id}?dataset=${dataset}`}
            className="font-medium transition-colors hover:text-foreground hover:underline"
          >
            {value}
          </Link>
        );
      case "institution":
        return <span className="text-secondary truncate max-w-[200px]">{value}</span>;
      case "country":
        return <span className="text-muted-foreground">{value}</span>;
      case "field":
        return <FieldTag variant="info">{value || "—"}</FieldTag>;
      case "subfield":
        return <FieldTag variant="success">{value || "—"}</FieldTag>;
      case "sm-subfield-2":
        return <FieldTag variant="warning">{(value as string) || "—"}</FieldTag>;
      case "citations":
      case "papers":
        return <span className="text-tabular tabular-nums">{formatNumber(value as number)}</span>;
      case "hIndex":
        return <span className="text-tabular tabular-nums">{value}</span>;
      case "hmIndex":
      case "compositeScore":
        return <span className="text-tabular tabular-nums">{formatScore(value as number)}</span>;
      case "firstYear":
      case "lastYear":
        return <span className="text-tabular tabular-nums">{value || "—"}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div className={cn("flex flex-col", className)} style={{ height: "calc(100vh - 300px)", minHeight: 400 }}>
      <div className="min-h-0 flex-1 overflow-auto scrollbar-thin">
        <table className={cn("data-table", density === "compact" && "data-table--compact", density === "comfortable" && "data-table--comfortable")} role="grid">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sortId === column.key ? (sortDesc ? "descending" : "ascending") : "none"}
                style={{ width: column.width }}
                className="sortable cursor-pointer select-none"
                onClick={() => onSortChange(column.key, sortId === column.key ? !sortDesc : false)}
              >
                <div className="flex items-center gap-1.5">
                  {column.header}
                  {getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn(loading && "opacity-50 pointer-events-none")}>
          {data.map((scientist) => (
            <tr key={scientist.id ?? scientist.rank}>
              {COLUMNS.map((column) => (
                <td key={column.key} style={{ width: column.width }}>
                  {renderCell(scientist, column)}
                </td>
              ))}
            </tr>
          ))}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="data-table__empty">
                No scientists found matching your criteria.
              </td>
            </tr>
          )}
          {loading && data.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="data-table__empty">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading scientists…
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Pagination — outside the scroll area so it never moves with the table */}
      <div className="z-10 flex items-center justify-between border-t border-border bg-card px-4 py-3">
        <div className="text-body-sm text-secondary">
          {totalCount > 0 ? (
            <>
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of{" "}
              {totalCount.toLocaleString("en-US")} scientists
            </>
          ) : (
            "No results"
          )}
        </div>
        <div className="flex items-center gap-2">
          {onDensityChange && (
            <Button
              variant={density === "compact" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onDensityChange(density === "compact" ? "comfortable" : "compact")}
              aria-pressed={density === "compact"}
              aria-label="Toggle compact density"
              title="Toggle compact density"
              className="px-2"
            >
              <Rows3 className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="input select py-1 px-2 text-sm w-auto"
            aria-label="Rows per page"
          >
            {[25, 50, 100, 200].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={page === 0}
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-body-sm text-secondary px-2">
              Page {page + 1} of {totalPages.toLocaleString("en-US")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages - 1)}
              disabled={page >= totalPages - 1}
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
