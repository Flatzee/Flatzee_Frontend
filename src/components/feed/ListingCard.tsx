"use client";

import { ArrowUpRight, BadgeCheck, Star, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/data/listings";
import ImageCarousel from "@/components/feed/ImageCarousel";
import { ImageNavTip } from "@/components/ux/CoachMarks";
import { useRouter } from "next/navigation";

type ListingExtras = {
  area?: string;
  short?: string;
  verified?: boolean;
  badges?: string[]; // ["premium"] | ["sponsored"] | ["forYou"] | ["featured"]
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const extras = listing as Listing & ListingExtras;

  const [slideOut, setSlideOut] = useState(false);
  const [showImageTip, setShowImageTip] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const router = useRouter();

  // // --- Swipe LEFT to open listing ---
  // const startX = useRef(0);
  // const startY = useRef(0);
  // const swiping = useRef(false);

  // const onTouchStart = (e: React.TouchEvent) => {
  //   const t = e.touches[0];
  //   startX.current = t.clientX;
  //   startY.current = t.clientY;
  //   swiping.current = true;
  // };
  // const onTouchMove = (e: React.TouchEvent) => {
  //   if (!swiping.current) return;
  //   const t = e.touches[0];
  //   const dx = t.clientX - startX.current;
  //   const dy = t.clientY - startY.current;
  //   if (dx < -70 && Math.abs(dy) < 40) {
  //     swiping.current = false;
  //     openListing();
  //   }
  // };
  // const onTouchEnd = () => {
  //   swiping.current = false;
  // };

  const openListing = () => {
    setSlideOut(true);
    window.setTimeout(
      () => router.push(`/listing/${listing.id}`),
      prefersReducedMotion() ? 0 : 180
    );
  };

  const overswipe = () => openListing();

  // First-use hints
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("tipImageNav") === "1";
    if (!seen) setShowImageTip(true);
  }, []);
  useEffect(() => {
    if (!showImageTip) return;
    const t = window.setTimeout(() => {
      try { sessionStorage.setItem("tipImageNav", "1"); } catch {}
      setShowImageTip(false);
    }, 10000);
    return () => window.clearTimeout(t);
  }, [showImageTip]);

  useEffect(() => {
    if (!showScrollHint) return;
    const t = window.setTimeout(() => setShowScrollHint(false), 5000);
    return () => window.clearTimeout(t);
  }, [showScrollHint]);

  const badges = extras.badges || [];
  const isPremium = badges.some((b) => ["premium", "sponsored", "featured"].includes(b));
  const primaryBadge =
    badges.find((b) => ["premium", "sponsored", "featured", "forYou"].includes(b)) || undefined;

  return (
    <section
      // onTouchStart={onTouchStart}
      // onTouchMove={onTouchMove}
      // onTouchEnd={onTouchEnd}

      className={`snap-card relative 
        w-full overflow-hidden rounded-2xl border 
        ${isPremium ? "ring-1 ring-amber-300/70" : ""}
        ${slideOut ? "translate-x-10 opacity-0 transition duration-200" : ""}`}
    >
      {/* Featured/Sponsored pill */}
      {primaryBadge && (
        <div className="absolute left-3 top-3 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-medium text-white shadow">
            <Sparkles className="h-3.5 w-3.5" />
            {primaryBadge === "forYou" ? "For You" : "Sponsored"}
          </span>
        </div>
      )}

       {/* Concrete height for the media region = full slide */}
        <div className="relative w-full" style={{ height: "var(--slide-h)" }}>
          <ImageCarousel
            className="h-full"
            images={listing.images}
            onOverswipeRightAtEnd={overswipe}
            onFirstInteraction={() => setShowImageTip(false)}
          />
      +  </div>

      {showImageTip && <ImageNavTip onDismiss={() => setShowImageTip(false)} />}

      {/* Subtle bottom gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black/65 via-black/35 to-transparent" />

      {/* Text block anchored to bottom (expands upward as needed) */}
       <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] text-white">
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-black/45 px-2 py-0.5">
            <Star className="mr-1 h-3 w-3" /> {listing.rating} ({listing.reviews}) 
          </span>
          {extras.verified && (
            <span className="inline-flex items-center rounded-full bg-black/45 px-2 py-0.5">
              <BadgeCheck className="mr-1 h-3 w-3" /> Verified
            </span>
          )}
        </div>

        <h3 className="text-2xl font-semibold leading-tight drop-shadow">
          {listing.title}
        </h3>

        <div className="mt-0.5 text-sm text-white/90">
          {listing.city}
          {extras.area ? ` • ${extras.area}` : ""} • NPR{" "}
          {listing.pricePerNight.toLocaleString()}/night
        </div>

        {extras.short && (
           <p className="mt-1.5 max-w-xl text-[13px] leading-snug text-white/90">
            {extras.short}
          </p>
        )}

        {/* Inline CTA (subtle) */}
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <div className="text-base font-semibold drop-shadow">
            NPR {listing.pricePerNight.toLocaleString()}{" "}
            <span className="text-xs font-normal opacity-90">/ night</span>
          </div>
          <button
            onClick={openListing}
            className="inline-flex items-center gap-1 rounded-lg border border-white/50 bg-white/85 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white focus:outline-none focus-visible:ring"
          >
            Book
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* brief scroll hint (auto hides in 5s) */}
      {showScrollHint && (
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 -translate-x-1/2 text-[11px] text-white/85">
          <div className="flex items-center gap-1 animate-bounce">
            <span className="inline-block rounded-full bg-white/70 px-2 py-1 text-neutral-900/90">
              Scroll for next
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
