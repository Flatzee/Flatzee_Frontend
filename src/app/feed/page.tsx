"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar, { type SearchState } from "@/components/feed/TopBar";
import BottomBar from "@/components/feed/BottomBar";
import ListingCard from "@/components/feed/ListingCard";
import { LISTINGS } from "@/data/listings";

type Search = { destination?: string; checkIn?: Date; checkOut?: Date; guests?: number };

export default function FeedPage() {
  const [search, setSearch] = useState<Search>({});
  const [nudged, setNudged] = useState(false);

  // first-open nudge (mobile only, no filters yet)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    const hasFilters = !!(search.destination || search.checkIn || search.checkOut || search.guests);
    const seen = sessionStorage.getItem("feedSearchNudged") === "1";
    if (isMobile && !hasFilters && !seen) {
      setNudged(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { items, soft } = useMemo(() => {
    const all = [...LISTINGS];
    const dest = (search.destination || "").trim().toLowerCase();
    if (!dest) {
      return { items: all, soft: false };
    }
    let maxScore = 0;
    const scored = all
      .map((l) => {
        const city = l.city.toLowerCase();
        const starts = city.startsWith(dest);
        const includes = !starts && city.includes(dest);
        const score = (starts ? 100 : includes ? 60 : 0) + (l.verified ? 10 : 0) + l.rating;
        if (score > maxScore) maxScore = score;
        return { l, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.l);
    const soft = maxScore < 100; // no strong startsWith match
    return { items: scored, soft };
  }, [search]);

  // Use the prop TopBar actually supports
  const onApplySearch = (v: SearchState) => {
    try {
      sessionStorage.setItem("feedSearchNudged", "1");
    } catch {}
    setNudged(false);
    setSearch({
      destination: v.destination,
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      guests: v.guests,
    });
  };

  return (
    <div className="relative">
      {/* Pass onApplySearch (not onOpenSearch) */}
      <TopBar onApplySearch={onApplySearch} />

      <main
        id="feed-scroll"
        className="
          h-screen overflow-y-auto bg-neutral-50
          pt-[calc(var(--topstrip-h)+var(--searchbar-h)+var(--top-safe))]
          md:pb-0
          pb-[calc(var(--bottombar-h)+var(--bottom-safe))]
          snap-y snap-mandatory scroll-smooth
        "
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-3 md:px-6">
          {nudged && (
            <div
              role="status"
              className="md:hidden mx-auto w-full max-w-2xl rounded-xl border bg-white p-3 text-sm text-neutral-700 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>Try searching for a destination, dates, and guests to get the best results.</div>
                <button
                  className="shrink-0 rounded-lg border px-2 py-1 text-xs hover:bg-neutral-50 focus:outline-none focus-visible:ring"
                  onClick={() => {
                    try {
                      sessionStorage.setItem("feedSearchNudged", "1");
                    } catch {}
                    setNudged(false);
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          )}
          {search.destination && (
            <div className="mx-auto w-full max-w-2xl text-center text-xs text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1">
                Destination: <strong>{search.destination}</strong>
              </span>
            </div>
          )}
          {soft && search.destination && (
            <div className="mx-auto w-full max-w-2xl rounded-full border bg-white px-3 py-2 text-center text-xs text-neutral-600">
              Showing closest matches
            </div>
          )}
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </main>

      <BottomBar />
    </div>
  );
}
