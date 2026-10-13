"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useScientist } from "@/hooks/useScientists";
import { ScientistDetail } from "@/components/table/ScientistDetail";

export default function ScientistProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = parseInt(params.id as string, 10);
  const dataset = (searchParams.get("dataset") as "singleyr" | "career") || "singleyr";

  const { scientist, loading, error } = useScientist(id, dataset);

  return (
    <div className="container-table py-8">
      <div className="mb-6">
        <Link
          href={`/scientists?dataset=${dataset}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Scientists
        </Link>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        </div>
      )}

      {!loading && (error || !scientist) && (
        <div className="py-16 text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Scientist Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            No scientist found with id #{id.toLocaleString("en-US")} in the {dataset === "singleyr" ? "Single-Year" : "Career"} dataset.
          </p>
          <Link href={`/scientists?dataset=${dataset}`} className="btn btn--primary inline-flex">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Scientists
          </Link>
        </div>
      )}

      {!loading && scientist && (
        <div className="rounded-lg border border-border bg-card">
          <ScientistDetail scientist={scientist} dataset={dataset} />
        </div>
      )}

      {scientist && (
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Go back
          </Button>
        </div>
      )}
    </div>
  );
}
