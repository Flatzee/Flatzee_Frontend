import Header from "@/components/ui/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";


export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="grid gap-6 py-10 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Find your perfect apartment—fast.
            </h1>
            <p className="mb-6 text-lg text-neutral-600">
              Search verified listings, compare prices, and rent with confidence.
            </p>
          
            <Button asChild className="whitespace-nowrap">
              <Link href="/feed">Open For-You Feed</Link>
            </Button>

            {/* Simple Search */}
            <div className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row">
              <Input placeholder="City / Area" />
              <Input placeholder="Budget (NPR)" />
              <Button className="whitespace-nowrap">Search</Button>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              Tip: Try “Kapan” or “Lazimpat”.
            </p>
          </div>
          <div className="h-64 rounded-2xl bg-[url('https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center md:h-96" />
        </section>

        {/* Featured */}
        <section className="py-8">
          <h2 className="mb-4 text-2xl font-semibold">Featured listings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 bg-[url('https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                <CardContent className="p-4">
                  <div className="font-medium">2BHK in Kapan</div>
                  <div className="text-sm text-neutral-500">NPR 32,000 / month</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Value props */}
        <section className="grid gap-6 py-12 md:grid-cols-3">
          {[
            { t: "Verified Listings", d: "Owner-verified with clear details."},
            { t: "Smart Filters", d: "Save time with precise search."},
            { t: "Secure Process", d: "Transparent communication & terms."},
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border p-6">
              <div className="mb-2 text-lg font-semibold">{x.t}</div>
              <div className="text-neutral-600">{x.d}</div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="my-16 rounded-2xl border bg-neutral-50 p-8 text-center">
          <h3 className="mb-2 text-2xl font-semibold">Ready to get started?</h3>
          <p className="mb-4 text-neutral-600">Create an account and start browsing apartments today.</p>
          <Button>Create Account</Button>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-neutral-500">© {new Date().getFullYear()} Flatzee</footer>
    </>
  )
}
