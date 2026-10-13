"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  highlight?: boolean;
  loading?: boolean;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, delta, deltaPositive, highlight, loading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("stat-card", highlight && "stat-card--highlight", loading && "stat-card--loading", className)}
        {...props}
        role="status"
        aria-live="polite"
      >
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">
          {loading ? (
            <span aria-hidden="true">———</span>
          ) : (
            <span className="tabular-nums">{value}</span>
          )}
        </div>
        {delta && (
          <div className={cn("stat-card__delta", deltaPositive !== undefined && (deltaPositive ? "text-success" : "text-error"))}>
            {delta}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";