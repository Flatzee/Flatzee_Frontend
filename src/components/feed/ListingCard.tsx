// ListingCard.tsx (PATCH)
// NOTE: you already import lucide icons; we'll use MapPin & X
"use client";

import { ArrowUpRight, BadgeCheck, Star, Sparkles, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Listing } from "@/data/listings";
import MediaCarousel from "@/components/feed/MediaCarousel"; // <-- your patched carousel (images/videos only)
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

  // NEW: local state for map sheet
  const [mapOpen, setMapOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(false); // trigger slide-up anim

  const router = useRouter();

  const openListing = () => {
    setSlideOut(true);
    window.setTimeout(() => router.push(`/listing/${listing.id}`), prefersReducedMotion() ? 0 : 180);
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

  /* ────────────────────────────────────────────────────────────────────────────
     DELETE-ME (single block of comments)

     Why this fixes your conflict:
     - The map is no longer a carousel slide, so end-overswipe works exactly as before.
     - We add a small floating "Map" icon button layered over the media.
     - When tapped, we open a 60% tall drop-up sheet with an embedded map (iframe).
     - Backdrop click, X button, or ESC closes it. Nice padding, title, animation.

     Customize:
     - Move the button: change its fixed position classes below.
     - Change height: adjust SHEET_HEIGHT_PCT.
     - Replace iframe with your map component if you have lat/lng.
  ──────────────────────────────────────────────────────────────────────────── */

  const SHEET_HEIGHT_PCT = 60; // 60% sheet height

  // Animate sheet in/out
  useEffect(() => {
    if (mapOpen) {
      const id = requestAnimationFrame(() => setMapVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setMapVisible(false);
    }
  }, [mapOpen]);

  // Optional: ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMapOpen(false);
    };
    if (mapOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapOpen]);

  return (
    <section
      className={`snap-card relative w-full overflow-hidden rounded-2xl border bg-black
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

{/* Media fills the entire slide */}
      <MediaCarousel
        className="h-full w-full"
        slides={[
          // Video (if available)
          ...(listing.videos && listing.videos.length > 0
            ? listing.videos.map(v => ({
              kind: "video" as const,
              src: v.src,
              poster: v.poster,
              type: v.type
            }))
            : [{ kind: "placeholder" as const, text: "No video uploaded" }]),

          // Images
          ...listing.images.map(src => ({
            kind: "image" as const,
            src
          })),
        ]}
        onOverswipeRightAtEnd={overswipe}
        onFirstInteraction={() => setShowImageTip(false)}
      />

      {/* Floating Map button (top-right, subtle) */}
      <button
        type="button"
        onClick={() => setMapOpen(true)}
        className="absolute right-2 top-20 z-20 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1.5 text-xs text-white shadow hover:bg-black/70 focus:outline-none focus-visible:ring"
        aria-label="Open map"
      >
        <MapPin className="h-4 w-4" />
        Map
      </button>

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

      {/* ===================== Drop-up Map Sheet (60%) ===================== */}
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close map"
        onClick={() => setMapOpen(false)}
        className={[
          "absolute inset-0 z-40 transition-opacity duration-200",
          mapOpen ? (mapVisible ? "opacity-100" : "opacity-0") : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />

      {/* Sheet */}
      <div
        className={[
          "absolute left-0 right-0 z-50 rounded-t-2xl bg-white shadow-xl",
          "transition-transform duration-250 ease-out",
        ].join(" ")}
        style={{
          bottom: 0,
          height: `${SHEET_HEIGHT_PCT}%`,
          transform: mapOpen
            ? mapVisible
              ? "translateY(0%)"
              : "translateY(100%)"
            : "translateY(100%)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-neutral-700" />
            <h3 className="text-sm font-semibold text-neutral-800">Location</h3>
          </div>
          <button
            onClick={() => setMapOpen(false)}
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            {/* Replace the src with your own coords if you have them on listing */}
            <iframe
              loading="lazy"
              allowFullScreen
              className="h-[min(50vh,100%)] w-full"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(listing.city)}&z=14&output=embed`}
            />
          </div>
        </div>
      </div>
      {/* =================================================================== */}
    </section>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
