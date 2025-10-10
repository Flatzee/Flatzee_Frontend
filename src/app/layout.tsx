import type { Metadata } from "next";
import "./globals.css";
import ViewportProvider from "./ViewportProvider";

export const metadata: Metadata = {
  title: "Flatzee – Find your next apartment",
  description: "Apartment rentals made simple.",
  // not strictly required, but good practice:
  other: { viewport: "width=device-width, initial-scale=1, viewport-fit=cover" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-neutral-900">
        {/* Visual viewport provider enables chrome shrinking and snap stability */}
        <ViewportProvider />
        {children}
      </body>
    </html>
  );
}
