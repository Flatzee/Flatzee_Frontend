"use client";

import * as React from "react";
import Image from "next/image";

type Props = {
  images: string[];
  className?: string;
  onOverswipeRightAtEnd?: () => void;
  disableOverswipe?: boolean;
  onFirstInteraction?: () => void;
};

export default function ImageCarousel({
  images,
  className,
  onOverswipeRightAtEnd,
  disableOverswipe,
  onFirstInteraction,
}: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);
  const interactedRef = React.useRef(false);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const root = rootRef.current;
    if (!root) return;
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  });

  React.useEffect(() => {
    // reset progress animation on image change
    setAnimKey((k) => k + 1);
  }, [index]);

  const to = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, images.length - 1));
    el.scrollTo({ left: el.clientWidth * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  const markInteracted = () => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      onFirstInteraction?.();
    }
  };

  const prev = () => {
    markInteracted();
    to(index - 1);
  };
  const next = () => {
    markInteracted();
    if (index >= images.length - 1) {
      if (!disableOverswipe) onOverswipeRightAtEnd?.();
      return;
    }
    to(index + 1);
  };

  // ✅ compute hooks BEFORE any early returns
  const cursorStyle = React.useMemo(
    () => ({
      left: { cursor: "w-resize" as const },
      mid: { cursor: "default" as const },
      right: { cursor: "e-resize" as const },
    }),
    []
  );

  if (images.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`relative h-full w-full outline-none ${className || ""}`}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Listing images"
    >
      {/* top progress segments */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex gap-1 p-2">
        {images.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40">
            <div
              key={`${animKey}-${i}-${index === i}`}
              className={`h-full ${index === i ? "bg-white" : "bg-white/60 w-0"}`}
              style={
                index === i
                  ? { width: "100%", transition: prefersReducedMotion() ? undefined : "width 3s linear" }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <div
        ref={trackRef}
        className="carousel-track flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-y"
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0 snap-start" style={{ inlineSize: "100%" }}>
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* click zones */}
      <div className="absolute inset-0 z-10 flex">
        <button aria-label="Previous image" onClick={prev} className="h-full w-[35%] bg-transparent" style={cursorStyle.left} />
        <div aria-hidden className="h-full w-[30%]" style={cursorStyle.mid} />
        <button aria-label="Next image" onClick={next} className="h-full w-[35%] bg-transparent" style={cursorStyle.right} />
      </div>

      <style>{`
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-track { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
