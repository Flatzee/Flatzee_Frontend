import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flatzee – Find your next apartment",
  description: "Apartment rentals made simple.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}

