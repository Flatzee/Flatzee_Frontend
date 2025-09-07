import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Flatzee – Find your next apartment",
  description: "Apartment rentals made simple."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  )
}
