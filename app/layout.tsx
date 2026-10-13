import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Top 2% Scientists Visualizer | Stanford/Elsevier 2026",
  description: "Explore the world's most influential researchers from the Stanford/Elsevier 2026 ranking of top 2% scientists worldwide.",
  keywords: ["scientists", "rankings", "citations", "h-index", "research", "stanford", "elsevier"],
  authors: [{ name: "Top 2% Scientists Visualizer" }],
  openGraph: {
    title: "Top 2% Scientists Visualizer",
    description: "Explore 249,000+ top scientists from Stanford/Elsevier 2026 ranking",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    var dark = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
