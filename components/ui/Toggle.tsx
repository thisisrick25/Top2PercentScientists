"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, defaultChecked, onCheckedChange, id, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
    
    const controlledChecked = checked ?? isChecked;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };
    
    return (
      <label className={cn("toggle", className)} htmlFor={toggleId}>
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          className="toggle__input"
          checked={controlledChecked}
          onChange={handleChange}
          {...props}
        />
        <span className="toggle__track">
          <span className="toggle__thumb" />
        </span>
        {label && <span className="toggle__label">{label}</span>}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

import React from "react";