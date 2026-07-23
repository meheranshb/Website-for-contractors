import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildCraft — Premium Contracting & Construction",
  description:
    "BuildCraft delivers premium residential and commercial construction, remodeling and renovations. Get an instant quote and pay your deposit securely online.",
  keywords: [
    "contractor",
    "construction",
    "remodeling",
    "roofing",
    "kitchen remodel",
    "get a quote",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
