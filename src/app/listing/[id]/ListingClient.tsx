"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Star } from "lucide-react";
import { LISTINGS } from "@/data/listings";
import ImageCarousel from "@/components/feed/ImageCarousel";
import DateRangePicker, { type DateRange } from "@/components/search/DateRangePicker";
import GuestPicker from "@/components/search/GuestPicker";

export default function ListingClient({ id }: { id: string }) {
  const router = useRouter();
  const listing = useMemo(() => LISTINGS.find((l) => l.id === id), [id]);
  const [range, setRange] = useState<DateRange>({});
  const [guests, setGuests] = useState<number>(2);

  if (!listing) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.push("/feed")}
          className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-lg font-semibold">Listing not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-white/80 px-3 backdrop-blur">
        <button
          aria-label="Back to feed"
          onClick={() => router.push("/feed")}
          className="rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium">{listing.title}</div>
      </div>

      {/* Gallery */}
      <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9] md:aspect-[16/7]">
        <ImageCarousel images={listing.images} disableOverswipe />
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[1.15fr_.85fr] md:py-6">
        <div className="space-y-6">
          {/* Overview */}
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">{listing.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
              <span className="inline-flex items-center">
                <Star className="mr-1 h-4 w-4" /> {listing.rating} ({listing.reviews})
              </span>
              {listing.verified && (
                <span className="inline-flex items-center">
                  <BadgeCheck className="mr-1 h-4 w-4" /> Verified
                </span>
              )}
              <span>
                - {listing.city}
                {listing.area ? `, ${listing.area}` : ""}
              </span>
            </div>
          </div>

          {/* About */}
          <section>
            <h2 className="mb-2 text-base font-semibold">About this place</h2>
            <p className="text-sm text-neutral-700">
              A comfortable, light-filled apartment perfect for couples or solo travelers. Close to cafes and public transport.
              Enjoy a quiet night with city views and thoughtful amenities throughout your stay.
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="mb-2 text-base font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
              {[
                "Wi-Fi",
                "Kitchen",
                "Balcony",
                "Parking",
                "Washer",
                "24/7 Support",
                "Air conditioning",
                "Hair dryer",
                "Essentials",
                "TV",
                "Workspace",
                "Smoke alarm",
              ].map((a) => (
                <div key={a} className="rounded-lg border bg-white p-3">
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* Host */}
          <section>
            <h2 className="mb-2 text-base font-semibold">Host</h2>
            <div className="flex items-center gap-3 rounded-2xl border bg-white p-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-900 text-white">
                {initials(listing.hostName)}
              </div>
              <div className="text-sm">
                <div className="font-medium">Hosted by {listing.hostName}</div>
                <div className="text-neutral-600">
                  {listing.hostYears} years hosting {listing.verified && " – Verified"}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="mb-2 text-base font-semibold">Reviews</h2>
            <div className="space-y-3">
              {mockReviews().map((r, i) => (
                <div key={i} className="rounded-2xl border bg-white p-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-neutral-500">{r.date}</div>
                  </div>
                  <div className="mb-1 text-amber-500">{"**********".slice(0, r.stars)}</div>
                  <div className="text-sm text-neutral-700">{r.text}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="mb-2 text-base font-semibold">FAQs</h2>
            <div className="divide-y rounded-2xl border bg-white">
              {mockFaqs().map((f, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm">
                    {f.q}
                    <span className="text-neutral-400 transition group-open:rotate-180">^</span>
                  </summary>
                  <div className="p-4 pt-0 text-sm text-neutral-700">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="h-max space-y-3 rounded-2xl border bg-white p-4">
          <div className="text-lg font-semibold">
            NPR {listing.pricePerNight.toLocaleString()}
            <span className="text-sm font-normal text-neutral-500"> / night</span>
          </div>
          <DateRangePicker value={range} onChange={setRange} />
          <GuestPicker defaultValue={{ adults: 2 }} onComplete={(total) => setGuests(total)} />
          <button
            aria-label="Request to book"
            className="mt-2 w-full rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 focus:outline-none focus-visible:ring"
          >
            Request to book
          </button>
          <div className="text-xs text-neutral-500">This is a demo. No payment is collected.</div>
        </aside>
      </div>
    </div>
  );
}

/* Helpers */
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function mockReviews() {
  return [
    { name: "Alex", date: "Aug 2025", stars: 5, text: "Amazing stay with gorgeous views. Host was very helpful!" },
    { name: "Priya", date: "Jul 2025", stars: 5, text: "Clean, cozy, and close to everything. Would book again." },
    { name: "Sam", date: "Jun 2025", stars: 4, text: "Great value. A bit noisy at night but manageable." },
  ];
}

function mockFaqs() {
  return [
    { q: "Is parking available?", a: "Yes, there is one free parking spot on-site." },
    { q: "Do you allow pets?", a: "Small pets are allowed with prior notice." },
    { q: "What time is check-in?", a: "Check-in is from 3 PM; check-out by 11 AM." },
    { q: "Is Wi-Fi fast?", a: "Reliable Wi-Fi suitable for remote work and streaming." },
  ];
}
