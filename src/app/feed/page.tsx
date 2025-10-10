"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TopBar, { type SearchState } from "@/components/feed/TopBar";
import BottomBar from "@/components/feed/BottomBar";
import ListingCard from "@/components/feed/ListingCard";
import EndOfFeed from "@/components/feed/EndOfFeed";
import { LISTINGS } from "@/data/listings";
import type { Listing } from "@/data/listings";
import { ChevronUp } from "lucide-react";

type Search = { destination?: string; checkIn?: Date; checkOut?: Date; guests?: number };

/* ──────────────────────────────────────────────────────────────────────────────
   🔧 INFINITE-TEST SWITCH
   Set to false to disable the infinite-scroll test harness. You can also delete
   the blocks marked with "INFINITE-TEST" later.
────────────────────────────────────────────────────────────────────────────── */
const __INF_TEST__ = true;

/* For test rendering only: we add a React key while keeping the real id intact */
type ListingWithKey = Listing & { __key?: string };

export default function FeedPage() {
  const [search, setSearch] = useState<Search>({});
  const [showTips, setShowTips] = useState(false);

  // Enable root scroll-snap on this route only
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("feed-snap");
    body.classList.add("feed-snap");
    return () => {
      html.classList.remove("feed-snap");
      body.classList.remove("feed-snap");
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    const seen = sessionStorage.getItem("fz.feedTips") === "1";
    if (!seen) {
      setShowTips(true);
      const t = window.setTimeout(() => dismissTips(), 10000);
      return () => window.clearTimeout(t);
    }
  }, []);

  const dismissTips = () => {
    try { sessionStorage.setItem("fz.feedTips", "1"); } catch {}
    setShowTips(false);
  };

  // Base filtered list for current search
  const { base, soft } = useMemo(() => {
    const all = [...LISTINGS];
    const dest = (search.destination || "").trim().toLowerCase();
    if (!dest) return { base: all, soft: false };
    let maxScore = 0;
    const scored = all
      .map((l) => {
        const city = (l.city || "").toLowerCase();
        const starts = city.startsWith(dest);
        const includes = !starts && city.includes(dest);
        const score = (starts ? 100 : includes ? 60 : 0) + (l.verified ? 10 : 0) + (l.rating || 0);
        if (score > maxScore) maxScore = score;
        return { l, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.l);
    const soft = maxScore < 100;
    return { base: scored, soft };
  }, [search]);

  const onApplySearch = (v: SearchState) => {
    try { sessionStorage.setItem("fz.feedTips", "1"); } catch {}
    setShowTips(false);
    setSearch({ destination: v.destination, checkIn: v.checkIn, checkOut: v.checkOut, guests: v.guests });
  };

  /* ────────────────────────────────────────────────────────────────────────────
     🔧 INFINITE-TEST: batching + IntersectionObserver
     IMPORTANT: We DO NOT mutate l.id anymore. We add a separate __key for React.
  ───────────────────────────────────────────────────────────────────────────── */
  const [items, setItems] = useState<ListingWithKey[]>([]);
  const batchRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const MAX_BATCHES = 50;

  const makeBatch = (seed: Listing[], batchIndex: number): ListingWithKey[] =>
    seed.map((l, i) => ({
      ...l,                    // keep the real l.id for routing!
      __key: `${l.id}__b${batchIndex}i${i}`, // unique React key only
    }));

  // Reset when base list changes
  useEffect(() => {
    if (!__INF_TEST__) return;
    batchRef.current = 0;
    setItems(makeBatch(base, batchRef.current++));
  }, [base]);

  const loadMore = () => {
    if (!__INF_TEST__ || loadingRef.current || batchRef.current >= MAX_BATCHES) return;
    loadingRef.current = true;
    setTimeout(() => {
      setItems((cur) => cur.concat(makeBatch(base, batchRef.current++)));
      loadingRef.current = false;
    }, 200);
  };

  useEffect(() => {
    if (!__INF_TEST__) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { root: null, rootMargin: "200% 0px", threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [__INF_TEST__]);
  /* ──────────────────────────────────────────────────────────────────────────── */

  /* ────────────────────────────────────────────────────────────────────────────
     “Go Up” button — only when user scrolls UP after scrolling down past 1vh.
     - stays hidden initially
     - appears when dy < -MIN_DELTA AND y > threshold
     - auto-hides after 2s
  ───────────────────────────────────────────────────────────────────────────── */
  const [showGoUp, setShowGoUp] = useState(false);
  const lastYRef = useRef(0);
  const passedThresholdRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const MIN_DELTA = 80;                  // ignore tiny jitters
    const THRESHOLD_FACTOR = 1;            // must scroll > 1 * viewport height
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const lastY = lastYRef.current;
      const dy = y - lastY;

      // mark once we've gone far enough down
      const threshold = window.innerHeight * THRESHOLD_FACTOR;
      if (y > threshold) passedThresholdRef.current = true;
      if (y < 20) passedThresholdRef.current = false; // back to top resets the flag

      // Show only if: we already scrolled down past threshold AND now moving upward
      if (passedThresholdRef.current && dy < -MIN_DELTA) {
        setShowGoUp(true);
        if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = window.setTimeout(() => setShowGoUp(false), 2000);
      }

      lastYRef.current = y;
    };

    // init baseline
    lastYRef.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  /* Smooth, snap-safe scroll. Temporarily disables snap & settle, animates via rAF,
   then restores everything. Also guards against user interruption. */
function smoothScrollToTopSnapSafe() {
  const html = document.documentElement;
  const body = document.body;

  // mark programmatic scroll + disable settle during the tween
  html.setAttribute("data-progscroll", "1");
  html.setAttribute("data-nosettle", "1");

  // Temporarily disable CSS snap + native smooth behavior (we animate ourselves)
  const prevHtmlSnap = html.style.scrollSnapType;
  const prevBodySnap = body.style.scrollSnapType;
  const prevHtmlBeh = html.style.scrollBehavior;
  const prevBodyBeh = body.style.scrollBehavior;
  html.style.scrollSnapType = "none";
  body.style.scrollSnapType = "none";
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";

  // Compute exact top of first card (respect sticky header padding)
  const padTop = parseInt(getComputedStyle(html).getPropertyValue("scroll-padding-top")) || 0;
  const firstCard = document.querySelector(".snap-card") as HTMLElement | null;
  const targetY = firstCard
    ? Math.max(0, firstCard.getBoundingClientRect().top + window.scrollY - padTop)
    : 0;

  const startY = window.scrollY;
  const duration = 420;
  const startT = performance.now();

  let interrupted = false;
  const onUser = () => { interrupted = true; };
  window.addEventListener("wheel", onUser, { passive: true, once: true });
  window.addEventListener("touchstart", onUser, { passive: true, once: true });
  window.addEventListener("keydown", onUser, { passive: true, once: true });

  const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

  function step(now: number) {
    if (interrupted) return finish();
    const t = Math.min(1, (now - startT) / duration);
    const y = Math.round(startY + (targetY - startY) * easeOutCubic(t));
    window.scrollTo(0, y);
    if (t < 1) requestAnimationFrame(step);
    else {
      // final pin (exact)
      window.scrollTo(0, targetY);
      finish();
    }
  }

  function finish() {
    // tiny timeout lets the browser paint final position before restoring
    setTimeout(() => {
      html.style.scrollSnapType = prevHtmlSnap;
      body.style.scrollSnapType = prevBodySnap;
      html.style.scrollBehavior = prevHtmlBeh;
      body.style.scrollBehavior = prevBodyBeh;
      html.removeAttribute("data-nosettle");
      html.removeAttribute("data-progscroll");
    }, 120);
  }

  requestAnimationFrame(step);
}


    const goUp = () => {
  setShowGoUp(false);
  smoothScrollToTopSnapSafe();
};


  /* ──────────────────────────────────────────────────────────────────────────── */

  // Choose data source
  const renderList: ListingWithKey[] = __INF_TEST__ ? items : (base as ListingWithKey[]);

  return (
    <div className="relative">
      <TopBar onApplySearch={onApplySearch} />

      <main className="bg-neutral-50 pt-[var(--searchbar-h)] pb-[calc(var(--bottombar-h)+var(--bottom-safe))]">
        <div className="mx-auto grid max-w-7xl gap-2 md:gap-6 px-0 md:px-6">
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

          {renderList.map((l) => (
            <ListingCard key={l.__key ?? l.id} listing={l} />
          ))}

          {/* Sentinel triggers the next batch */}
          <div ref={sentinelRef} className="h-4" />

          {/* INFINITE-TEST sentinel */}
          {__INF_TEST__ && (
            <div ref={sentinelRef} className="h-24 mb-[calc(var(--bottombar-h,56px)+40px)]" />
          )}

          {!__INF_TEST__ && <EndOfFeed />}
        </div>
      </main>

      <BottomBar />

      {/* Subtle middle-right "Go Up" icon button */}
      <button
        onClick={goUp}
        aria-label="Scroll to top"
        className={[
          "fixed z-[80]",
          "top-1/2 -translate-y-1/2 right-3 md:right-4",
          "rounded-full p-2 shadow-md backdrop-blur",
          "bg-black/60 text-white",
          "transition-opacity duration-200",
          showGoUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
