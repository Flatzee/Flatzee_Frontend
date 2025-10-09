"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar, { type SearchState } from "@/components/feed/TopBar";
import BottomBar from "@/components/feed/BottomBar";
import ListingCard from "@/components/feed/ListingCard";
import EndOfFeed from "@/components/feed/EndOfFeed";
import { LISTINGS } from "@/data/listings";
import { useAutoplay } from "@/hooks/useAutoplay";

type Search = { destination?: string; checkIn?: Date; checkOut?: Date; guests?: number };

export default function FeedPage() {
  const [search, setSearch] = useState<Search>({});
  const [showTips, setShowTips] = useState(false); // first-time inline tips (visible below bar)
  
  // Initialize autoplay management
  useAutoplay();

  // Enable root-level scroll snap on mobile for browser chrome shrinking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const isMobile = window.innerWidth < 768;
      document.body.classList.toggle("feed-snap", isMobile);
      document.documentElement.classList.toggle("feed-snap", isMobile);
      
      // Hide scrollbars on mobile for cleaner experience
      if (isMobile) {
        document.documentElement.style.scrollbarWidth = 'none';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document.documentElement.style as any).msOverflowStyle = 'none';
      } else {
        document.documentElement.style.scrollbarWidth = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document.documentElement.style as any).msOverflowStyle = '';
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
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

      {/* Mobile: No inner scroller - root scrolling enables chrome shrinking */}
      {/* Desktop: Keep inner scroller for traditional behavior */}
      <main
        id="feed-scroll"
        className="
          bg-neutral-50
          pt-[var(--searchbar-h)] 
          pb-[calc(var(--bottombar-h)+var(--bottom-safe))]
          scroll-smooth
          /* Desktop: inner scroller with snap */
          md:h-screen-dvh md:overflow-y-auto md:snap-y md:snap-mandatory
          /* Mobile: no inner scroll, root handles it */
          md:overscroll-contain
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
