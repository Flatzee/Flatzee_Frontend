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

  const overswipe = () => {
    setSlideOut(true);
    window.setTimeout(() => router.push(`/listing/${listing.id}`), prefersReducedMotion() ? 0 : 180);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem('tipImageNav') === '1';
    if (!seen) setShowImageTip(true);
  }, []);

  // auto-dismiss hint after 10s if user doesn't interact
  useEffect(() => {
    if (!showImageTip) return;
    const t = window.setTimeout(() => {
      dismissImageTip();
    }, 10000);
    return () => window.clearTimeout(t);
  }, [showImageTip]);

  const dismissImageTip = () => {
    try { sessionStorage.setItem('tipImageNav','1'); } catch {}
    setShowImageTip(false);
  };

  return (
    <section
      ref={cardRef}
      className={`relative h-[calc(100vh-var(--bottombar-h)-var(--bottom-safe)-var(--searchbar-h)-var(--topstrip-h))] min-h-[520px] w-full snap-start overflow-hidden rounded-2xl border md:h-auto ${slideOut ? "translate-x-10 opacity-0 transition duration-200" : ""}`}
    >
      <ImageCarousel images={listing.images} onOverswipeRightAtEnd={overswipe} onFirstInteraction={dismissImageTip} />

      {/* first-use hint */}
      {showImageTip && (<ImageNavTip onDismiss={dismissImageTip} />)}
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

      {/* direct open listing page button */}
      <button
        aria-label="Open listing page"
        onClick={() => router.push(`/listing/${listing.id}`)}
        className="absolute bottom-6 right-6 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow-md hover:bg-white focus:outline-none focus-visible:ring"
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
