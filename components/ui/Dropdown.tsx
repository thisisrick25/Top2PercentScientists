"use client";

import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, children, align = "right", ...props }, ref) => {
    return (
      <div ref={ref} className={cn("dropdown", className)} {...props}>
        <div className="dropdown__trigger">{trigger}</div>
        <div
          className={cn("dropdown__menu", align === "left" && "left-0", align === "right" && "right-0")}
          role="menu"
        >
          {children}
        </div>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("dropdown__item", active && "dropdown__item--active", className)}
        role="menuitem"
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";