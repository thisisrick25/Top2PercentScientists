"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input, Select, Button } from "@/components/ui";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { TableFilters } from "@/types";

interface FilterBarProps {
  filters: TableFilters;
  onFiltersChange: (filters: Partial<TableFilters>) => void;
  fields: string[];
  countries: string[];
  subfields: string[];
  className?: string;
}

export function FilterBar({
  filters,
  onFiltersChange,
  fields,
  countries,
  subfields,
  className,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // Debounce search
    const timeout = setTimeout(() => {
      onFiltersChange({ search: value, page: 0 });
    }, 300);
    return () => clearTimeout(timeout);
  }, [onFiltersChange]);

  const handleSelectChange = useCallback((key: keyof TableFilters, value: string) => {
    onFiltersChange({ [key]: value, page: 0 });
  }, [onFiltersChange]);

  const handleDatasetChange = useCallback((dataset: "singleyr" | "career") => {
    onFiltersChange({ dataset, page: 0 });
  }, [onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange({
      search: "",
      field: "",
      country: "",
      subfield: "",
      subfield2: "",
      firstYear: "",
      page: 0,
    });
    setSearchValue("");
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.search || filters.field || filters.country || filters.subfield || filters.subfield2 || filters.firstYear;

  const FIRST_YEAR_OPTIONS = [
    { value: "2020", label: "≥ 2020" },
    { value: "2010", label: "≥ 2010" },
    { value: "2000", label: "≥ 2000" },
    { value: "1990", label: "≥ 1990" },
    { value: "1980", label: "≥ 1980" },
    { value: "1970", label: "≥ 1970" },
    { value: "1960", label: "≥ 1960" },
  ];

  return (
    <div className={cn("filter-bar", className)}>
      <div className="filter-bar__group w-[320px] shrink-0">
        <label htmlFor="search" className="sr-only">Search scientists</label>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" aria-hidden="true" />
          <input
            id="search"
            type="search"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, institution..."
            className="input pl-10 filter-bar__input"
            aria-label="Search scientists by name or institution"
          />
        </div>
      </div>

      <div className="filter-bar__group">
        <Select
          aria-label="Field"
          value={filters.field}
          onChange={(e) => handleSelectChange("field", e.target.value)}
          options={[{ value: "", label: "All Fields" }, ...fields.map((f) => ({ value: f, label: f }))]}
          className="filter-bar__select"
        />
      </div>

      <div className="filter-bar__group">
        <Select
          aria-label="Country"
          value={filters.country}
          onChange={(e) => handleSelectChange("country", e.target.value)}
          options={[{ value: "", label: "All Countries" }, ...countries.map((c) => ({ value: c, label: c }))]}
          className="filter-bar__select"
        />
      </div>

      {showAdvanced && (
        <div className="filter-bar__group">
          <Select
            aria-label="Subfield 1"
            value={filters.subfield}
            onChange={(e) => handleSelectChange("subfield", e.target.value)}
            options={[{ value: "", label: "All Subfields 1" }, ...subfields.map((s) => ({ value: s, label: s }))]}
            className="filter-bar__select"
          />
        </div>
      )}

      {showAdvanced && (
        <div className="filter-bar__group">
          <Select
            aria-label="Subfield 2"
            value={filters.subfield2}
            onChange={(e) => handleSelectChange("subfield2", e.target.value)}
            options={[{ value: "", label: "All Subfields 2" }, ...subfields.map((s) => ({ value: s, label: s }))]}
            className="filter-bar__select"
          />
        </div>
      )}

      {showAdvanced && (
        <div className="filter-bar__group">
          <Select
            aria-label="First Year"
            value={filters.firstYear}
            onChange={(e) => handleSelectChange("firstYear", e.target.value)}
            options={[{ value: "", label: "All Years" }, ...FIRST_YEAR_OPTIONS]}
            className="filter-bar__select"
          />
        </div>
      )}

      <div className="filter-bar__group">
        <div className="segmented self-center" role="radiogroup" aria-label="Dataset">
          <button
            type="button"
            role="radio"
            aria-checked={filters.dataset === "singleyr"}
            className={cn("segmented__item", filters.dataset === "singleyr" && "segmented__item--active")}
            onClick={() => handleDatasetChange("singleyr")}
          >
            Single-Year
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={filters.dataset === "career"}
            className={cn("segmented__item", filters.dataset === "career" && "segmented__item--active")}
            onClick={() => handleDatasetChange("career")}
          >
            Career
          </button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        aria-expanded={showAdvanced}
        className="filter-bar__toggle"
      >
        <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
        <span>{showAdvanced ? "Less" : "More"} Filters</span>
      </Button>

      {hasActiveFilters && (
        <div className="filter-bar__active-filters" role="status" aria-live="polite">
          {filters.search && (
            <span className="filter-pill">
              Search: "{filters.search}"
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ search: "", page: 0 })}
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          {filters.field && (
            <span className="filter-pill">
              Field: {filters.field}
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ field: "", page: 0 })}
                aria-label="Remove field filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          {filters.country && (
            <span className="filter-pill">
              Country: {filters.country}
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ country: "", page: 0 })}
                aria-label="Remove country filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          {filters.subfield && (
            <span className="filter-pill">
              Subfield 1: {filters.subfield}
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ subfield: "", page: 0 })}
                aria-label="Remove subfield filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          {filters.subfield2 && (
            <span className="filter-pill">
              Subfield 2: {filters.subfield2}
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ subfield2: "", page: 0 })}
                aria-label="Remove subfield 2 filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          {filters.firstYear && (
            <span className="filter-pill">
              First Year ≥ {filters.firstYear}
              <button
                type="button"
                className="filter-pill__remove"
                onClick={() => onFiltersChange({ firstYear: "", page: 0 })}
                aria-label="Remove first year filter"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-tertiary hover:text-error">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}