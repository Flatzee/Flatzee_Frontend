"use client";

import { ArrowUpRight, BadgeCheck, Star } from "lucide-react";
import { useState } from "react";
import type { Listing } from "@/data/listings";
import ImageCarousel from "./ImageCarousel";

export default function ListingCard({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);

  return (
<section
  className="
    relative
    h-[calc(100dvh-var(--topstrip-h)-var(--searchbar-h)-var(--bottombar-h)-var(--bottom-safe))]
    min-h-[420px]
    w-full snap-start overflow-hidden rounded-2xl border
    md:h-auto
  "
>      {/* Images */}
      <ImageCarousel images={listing.images} />

      {/* bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-black/50 px-2 py-0.5">
            <Star className="mr-1 h-3 w-3" /> {listing.rating} ({listing.reviews})
          </span>
          {listing.verified && (
            <span className="inline-flex items-center rounded-full bg-black/50 px-2 py-0.5">
              <BadgeCheck className="mr-1 h-3 w-3" /> Verified
            </span>
          )}
        </div>

        <div className="text-2xl font-semibold drop-shadow">
          {listing.title}
        </div>
        <div className="text-sm text-white/90">
          {listing.city}{listing.area ? ` • ${listing.area}` : ""} • NPR {listing.pricePerNight.toLocaleString()}/night
        </div>

        {listing.short && (
          <div className="mt-2 max-w-xl text-sm text-white/90">
            {listing.short}
          </div>
        )}
      </div>

      {/* expand arrow -> details panel */}
      <button
        aria-label="View details"
        onClick={() => setOpen(true)}
        className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/90 p-3 shadow-md hover:bg-white"
      >
        <ArrowUpRight className="h-5 w-5" />
      </button>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs text-white/80">
        <div className="animate-bounce">Scroll for next</div>
      </div>

      {/* details bottom sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 max-h-[80%] rounded-t-2xl bg-white p-4 shadow-xl transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-neutral-200" />
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_360px]">
          <div>
            <h3 className="text-xl font-semibold">{listing.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">
              {listing.city}{listing.area ? ` • ${listing.area}` : ""} • Hosted by {listing.hostName} ({listing.hostYears} yrs)
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg border p-3">Wi-Fi</div>
              <div className="rounded-lg border p-3">Kitchen</div>
              <div className="rounded-lg border p-3">Balcony</div>
              <div className="rounded-lg border p-3">Parking</div>
              <div className="rounded-lg border p-3">Washer</div>
              <div className="rounded-lg border p-3">24/7 Support</div>
            </div>
            <p className="mt-4 text-sm text-neutral-700">
              A comfortable, light-filled apartment perfect for couples or solo travelers. Close to cafes and public transport.
            </p>
          </div>

          <aside className="rounded-2xl border p-4">
            <div className="mb-2 text-lg font-semibold">
              NPR {listing.pricePerNight.toLocaleString()} <span className="text-sm font-normal text-neutral-500">/ night</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-lg border p-2 text-sm" placeholder="Check-in" />
              <input className="rounded-lg border p-2 text-sm" placeholder="Check-out" />
              <input className="col-span-2 rounded-lg border p-2 text-sm" placeholder="Guests" />
            </div>
            <button className="mt-3 w-full rounded-lg bg-black px-4 py-2 text-sm text-white">Request to book</button>
            <button className="mt-2 w-full rounded-lg border px-4 py-2 text-sm" onClick={() => setOpen(false)}>Close</button>
          </aside>
        </div>
      </div>
    </section>
  );
}
