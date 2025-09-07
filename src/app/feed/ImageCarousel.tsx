"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { images: string[]; className?: string };

export default function ImageCarousel({ images, className }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // update active dot on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const to = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, images.length - 1));
    el.scrollTo({ left: el.clientWidth * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  return (
    <div className={`relative h-full w-full ${className || ""}`}>
      <div
        ref={trackRef}
        className="carousel-track flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-y"
        style={{
          scrollbarWidth: "none" as any,
          msOverflowStyle: "none",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative h-full w-full shrink-0 snap-start"
            style={{ inlineSize: "100%" }}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* gradient for readability */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        aria-label="Previous image"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition hover:bg-white"
        onClick={() => to(index - 1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next image"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition hover:bg-white"
        onClick={() => to(index + 1)}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* dots */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>

      <style>{`
        .carousel-track::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
