"use client";

import { ArrowUpRight, BadgeCheck, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/data/listings";
import ImageCarousel from "@/components/feed/ImageCarousel";
import { ImageNavTip, ScrollHint } from "@/components/ux/CoachMarks";
import { useRouter } from "next/navigation";

export default function ListingCard({ listing }: { listing: Listing }) {
  const [slideOut, setSlideOut] = useState(false);
  const [showImageTip, setShowImageTip] = useState(false);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Swipe-right to open (card-level) ---
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    swiping.current = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;
    // Horizontal, slight angle allowed
    if (dx > 70 && Math.abs(dy) < 40) {
      swiping.current = false;
      openListing();
    }
  };
  const onTouchEnd = () => {
    swiping.current = false;
  };

  const openListing = () => {
    setSlideOut(true);
    window.setTimeout(() => router.push(`/listing/${listing.id}`), prefersReducedMotion() ? 0 : 180);
  };

  // Image carousel overswipe → open details too
  const overswipe = () => openListing();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("tipImageNav") === "1";
    if (!seen) setShowImageTip(true);
  }, []);

  useEffect(() => {
    if (!showImageTip) return;
    const t = window.setTimeout(() => dismissImageTip(), 10000);
    return () => window.clearTimeout(t);
  }, [showImageTip]);

  const dismissImageTip = () => {
    try {
      sessionStorage.setItem("tipImageNav", "1");
    } catch {}
    setShowImageTip(false);
  };

  return (
    <section
      ref={cardRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative
        h-[calc(100dvh-var(--searchbar-h)-var(--bottombar-h)-var(--bottom-safe))]
        min-h-[420px] w-full snap-start snap-always overflow-hidden rounded-2xl border
        md:h-auto ${slideOut ? "translate-x-10 opacity-0 transition duration-200" : ""}`}
    >
      <ImageCarousel images={listing.images} onOverswipeRightAtEnd={overswipe} onFirstInteraction={dismissImageTip} />

      {/* first-use hint for image navigation */}
      {showImageTip && <ImageNavTip onDismiss={dismissImageTip} />}
      <ScrollHint />

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pb-16 text-white">
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

        <div className="text-2xl font-semibold drop-shadow">{listing.title}</div>
        <div className="text-sm text-white/90">
          {listing.city}
          {"area" in listing && (listing as any).area ? ` • ${(listing as any).area}` : ""} • NPR{" "}
          {listing.pricePerNight.toLocaleString()}/night
        </div>

        {listing.short && <div className="mt-2 max-w-xl text-sm text-white/90">{listing.short}</div>}
      </div>

      {/* direct open listing page button (offset above bottom bar) */}
      <button
        aria-label="Open listing page"
        onClick={openListing}
        className="absolute right-6 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow-md hover:bg-white focus:outline-none focus-visible:ring
                   bottom-[calc(var(--bottombar-h)+16px)]"
      >
        View listing <ArrowUpRight className="ml-1 inline h-4 w-4 align-text-bottom" />
      </button>
    </section>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
