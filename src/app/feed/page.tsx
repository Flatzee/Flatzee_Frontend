"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar, { type SearchState } from "@/components/feed/TopBar";
import BottomBar from "@/components/feed/BottomBar";
import ListingCard from "@/components/feed/ListingCard";
import EndOfFeed from "@/components/feed/EndOfFeed";
import { LISTINGS } from "@/data/listings";

type Search = { destination?: string; checkIn?: Date; checkOut?: Date; guests?: number };

export default function FeedPage() {
  const [search, setSearch] = useState<Search>({});
  const [showTips, setShowTips] = useState(false); // first-time inline tips (visible below bar)

  // First-time inline tips (mobile only). We show them inside the feed, right
  // under the sticky bar so they never hide behind it. Auto-hide after 10s.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return; // mobile only
    const seen = sessionStorage.getItem("fz.feedTips") === "1";
    if (!seen) {
      setShowTips(true);
      const t = window.setTimeout(() => dismissTips(), 10000);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const enable = () => {
      const isMobile = window.innerWidth < 768;
      document.body.classList.toggle("feed-snap", isMobile);
    };
    enable();
    window.addEventListener("resize", enable);
    return () => window.removeEventListener("resize", enable);
  }, []);


  const dismissTips = () => {
    try {
      sessionStorage.setItem("fz.feedTips", "1");
    } catch {}
    setShowTips(false);
  };

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

  const onApplySearch = (v: SearchState) => {
    try {
      sessionStorage.setItem("fz.feedTips", "1"); // once they interact, hide tips
    } catch {}
    setShowTips(false);
    setSearch({
      destination: v.destination,
      checkIn: v.checkIn,
      checkOut: v.checkOut,
      guests: v.guests,
    });
  };

  return (
    <div className="relative">
      <TopBar onApplySearch={onApplySearch} />

      {/* <main
        id="feed-scroll"
        className="h-[100dvh] overflow-y-auto overscroll-contain bg-neutral-50
                   pt-[calc(var(--topstrip-h)+var(--searchbar-h))]
                   md:pb-0 pb-[calc(var(--bottombar-h)+var(--bottom-safe))]
                   snap-y snap-mandatory scroll-smooth"
      > */}
      <main
         id="feed-scroll"
          className="
            bg-neutral-50
            pt-[var(--searchbar-h)] 
            pb-[calc(var(--bottombar-h)+var(--bottom-safe))]
            scroll-smooth
            /* Desktop keeps inner scroller & snap */
            md:h-screen-dvh md:overflow-y-auto md:snap-y md:snap-mandatory
          "
        >

        <div className="mx-auto grid max-w-7xl gap-6 px-3 md:px-6">
          {/* First-time inline tips (below the bar, never hidden) */}
          {showTips && (
            <div
              role="status"
              className="md:hidden mx-auto w-full max-w-2xl rounded-xl border bg-white p-3 text-sm text-neutral-700 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div>👋 Welcome! Quick tips:</div>
                  <ul className="list-disc pl-5 text-[13px] text-neutral-600">
                    <li>Swipe <strong>down</strong> to see the next listing.</li>
                    <li>Tap <strong>left/right</strong> on the photo to view more images.</li>
                    <li>Swipe <strong>right</strong> on a listing to open its details.</li>
                  </ul>
                </div>
                <button
                  className="shrink-0 rounded-lg border px-2 py-1 text-xs hover:bg-neutral-50 focus:outline-none focus-visible:ring"
                  onClick={dismissTips}
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

          <EndOfFeed />
        </div>
      </main>

      <BottomBar />
    </div>
  );
}
