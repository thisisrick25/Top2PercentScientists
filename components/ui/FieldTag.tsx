"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type FieldTagVariant = "info" | "success" | "warning" | "error";

export interface FieldTagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: FieldTagVariant;
}

export const FieldTag = forwardRef<HTMLSpanElement, FieldTagProps>(
  ({ className, variant = "info", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("field-tag", `field-tag--${variant}`, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

FieldTag.displayName = "FieldTag";