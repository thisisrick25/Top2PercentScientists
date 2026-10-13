"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { getRankBadgeClass } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  rank?: number;
  variant?: "rank" | "default" | "success" | "warning" | "info" | "error";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, rank, variant = "default", children, ...props }, ref) => {
    let badgeClass = "badge";
    
    if (variant === "rank" && rank) {
      badgeClass += ` ${getRankBadgeClass(rank)}`;
    } else {
      badgeClass += ` badge--${variant}`;
    }
    
    return (
      <span
        ref={ref}
        className={cn(badgeClass, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";