"use client";

import { HTMLAttributes, forwardRef, isValidElement, ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || "");
    
    const handleChange = (tabValue: string) => {
      setActiveTab(tabValue);
      onValueChange?.(tabValue);
    };
    
    const controlledValue = value ?? activeTab;
    
    return (
      <div ref={ref} className={cn("tabs", className)} {...props} role="tablist">
        {React.Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          
          const childValue = (child.props as { value: string }).value;
          const isActive = controlledValue === childValue;
          
          return React.cloneElement(child as ReactElement<any>, {
            isActive,
            onClick: () => handleChange(childValue),
            role: "tab",
            "aria-selected": isActive,
          });
        })}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, value, isActive, onClick, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("tabs__trigger", isActive && "tabs__trigger--active", className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabTrigger.displayName = "TabTrigger";

import React from "react";