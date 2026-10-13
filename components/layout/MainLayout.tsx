"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      <Header />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container-dashboard flex flex-col items-center gap-2 text-center">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Citation: Ioannidis, John P.A. (2026), "August 2026 data-update for "Updated science-wide
            author databases of standardized citation indicators"", Elsevier Data Repository, V9,{" "}
            <a
              href="https://doi.org/10.17632/btchxktzyw.9"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              doi: 10.17632/btchxktzyw.9
            </a>
          </p>
          <p className="font-mono text-xs text-muted-foreground">Top 2% Scientists Visualizer</p>
        </div>
      </footer>
    </div>
  );
}
