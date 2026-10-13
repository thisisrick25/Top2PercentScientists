"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarList } from "./BarList";
import { CountEntry } from "@/types";

export function TopFieldsCard({ items, total }: { items: CountEntry[]; total: number }) {
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Top Research Fields
          <span className="text-caption text-tertiary">Share of all scientists</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarList items={items.slice(0, 10)} total={total} emptyLabel="No field data" />
      </CardContent>
    </Card>
  );
}

export function TopCountriesCard({ items, total }: { items: CountEntry[]; total: number }) {
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Top Countries
          <span className="text-caption text-tertiary">Share of all scientists</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarList items={items.slice(0, 10)} total={total} emptyLabel="No country data" />
      </CardContent>
    </Card>
  );
}
