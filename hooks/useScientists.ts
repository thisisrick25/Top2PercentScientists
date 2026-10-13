"use client";

import { useState, useEffect, useCallback } from "react";
import { Scientist, ScientistIndex, TableFilters, FieldThreshold, SubfieldThreshold } from "@/types";

const DATA_URLS = {
  singleyr: "/data/singleyr.json",
  career: "/data/career.json",
};

export function useScientistsIndex(dataset: "singleyr" | "career") {
  const [index, setIndex] = useState<ScientistIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchIndex() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(DATA_URLS[dataset]);
        if (!response.ok) throw new Error(`Failed to load ${dataset} index`);
        const data = await response.json();
        if (!cancelled) setIndex(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchIndex();
    return () => { cancelled = true; };
  }, [dataset]);

  return { index, loading, error };
}

export function useFieldThresholds() {
  const [thresholds, setThresholds] = useState<FieldThreshold[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/data/field-thresholds.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load field thresholds");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setThresholds(data);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  return thresholds;
}

export function useSubfieldThresholds() {
  const [thresholds, setThresholds] = useState<SubfieldThreshold[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/data/subfield-thresholds.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load subfield thresholds");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setThresholds(data);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  return thresholds;
}

export function useScientists(filters: TableFilters) {
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        dataset: filters.dataset,
        page: String(filters.page),
        pageSize: String(filters.pageSize),
        sortBy: filters.sortBy || "rank",
        sortOrder: filters.sortOrder || "asc",
      });
      if (filters.search) params.set("search", filters.search);
      if (filters.field) params.set("field", filters.field);
      if (filters.country) params.set("country", filters.country);
      if (filters.subfield) params.set("subfield", filters.subfield);
      if (filters.subfield2) params.set("subfield2", filters.subfield2);
      if (filters.firstYear) params.set("firstYear", filters.firstYear);

      const response = await fetch(`/api/scientists?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to load ${filters.dataset} data`);
      const data = await response.json();
      setScientists(data.rows);
      setTotalCount(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { scientists, totalCount, loading, error, refetch: fetchData };
}

export function useScientist(id: number, dataset: "singleyr" | "career") {
  const [scientist, setScientist] = useState<Scientist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchScientist() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/scientists/${id}?dataset=${dataset}`);
        if (!response.ok) throw new Error(response.status === 404 ? "Scientist not found" : `Failed to load ${dataset} data`);
        const data = await response.json();
        if (!cancelled) {
          setScientist(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (Number.isFinite(id) && id > 0) fetchScientist();
    return () => { cancelled = true; };
  }, [id, dataset]);

  return { scientist, loading, error };
}
