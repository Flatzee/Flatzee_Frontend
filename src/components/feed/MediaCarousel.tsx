"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Slide =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string; type?: string }
  | { kind: "map"; lat: number; lng: number }
  | { kind: "placeholder"; text: string };

type Props = {
  slides: Slide[];
  onOverswipeRightAtEnd?: () => void;
  onFirstInteraction?: () => void;
  className?: string;
  disableOverswipe?: boolean;
};

/* DELETE-ME: Map sheet polish block (kept for your later removal) */
const SWIPE_THRESHOLD_PX = 60;
const VELOCITY_THRESHOLD = 0.4;
const OVERSWIPE_STRONG_PX = 96;
const OVERSWIPE_VELOCITY = 0.5;
const MAX_OVERSWIPE_PX = 56;
const SHEET_HEIGHT_PCT = 60;

export default function MediaCarousel({
  slides,
  onOverswipeRightAtEnd,
  onFirstInteraction,
  className,
  disableOverswipe
}: Props) {
  // Start on first IMAGE
  const initialIndex = useMemo(() => {
    const idx = slides.findIndex((s) => s.kind === "image");
    return idx >= 0 ? idx : 0;
  }, [slides]);

  const [index, setIndex] = useState(initialIndex);

  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  // UI-only state for the button icon; DO NOT bind this to <video muted={...}>
  const [allowSound, setAllowSound] = useState(false);

  const interactedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // video refs
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  videoRefs.current = [];

  // Map sheet state
  const [mapOpen, setMapOpen] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const mapIndex = useMemo(() => slides.findIndex((s) => s.kind === "map"), [slides]);
  const prevIndexRef = useRef(initialIndex);

  // Animate sheet
  useEffect(() => {
    if (mapOpen) {
      const t = requestAnimationFrame(() => setMapVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setMapVisible(false);
    }
  }, [mapOpen]);

  /* ────────────────────────────────────────────────────────────
     Keep only the current slide playing; DO NOT force its mute.
     Guard re-muting of other slides with a short grace so we
     don’t clobber a fresh user unmute.
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const GRACE_MS = 600;
    const now = Date.now();
    const lastUserUnmuteAt =
      (window as any).__lastUserUnmuteAt ? (window as any).__lastUserUnmuteAt : 0;

    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        // Active slide: ensure it plays if visible; don't touch mute here.
        if (document.visibilityState === "visible") {
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        }
      } else {
        // Non-active slides: pause; only force-mute if outside grace window
        v.pause();
        if (now - lastUserUnmuteAt > GRACE_MS) {
          v.muted = true;
          v.defaultMuted = true;
        }
      }
    });
  }, [index]);

  // Pause all videos helper
  const pauseAll = useCallback(() => {
    videoRefs.current.forEach((v) => {
      try { if (v && !v.paused) v.pause(); } catch {}
    });
  }, []);

  // Ensure current video plays when carousel becomes visible; don't change mute.
  const playIfVideoActive = useCallback(async () => {
    const s = slides[index];
    if (s?.kind !== "video") {
      pauseAll();
      return;
    }
    const el = videoRefs.current[index];
    if (!el) return;

    el.playsInline = true;
    (el as any).disablePictureInPicture = true;
    (el as any).disableRemotePlayback = true;
    el.controls = false;

    if (!interactedRef.current) return; // user gesture required for sound-on playback
    try {
      await el.play();
    } catch {}
  }, [index, slides, pauseAll]);

  // Pause when carousel offscreen; resume if active video
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (!visible) pauseAll();
        else playIfVideoActive();
      },
      { root: null, threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pauseAll, playIfVideoActive]);

  useEffect(() => {
    playIfVideoActive();
  }, [index, playIfVideoActive]);

  // swipe state
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const startT = useRef(0);
  const axisLocked = useRef<"x" | "y" | null>(null);

  const clampIndex = useCallback(
    (i: number) => {
      if (i < 0) return 0;
      if (i > slides.length - 1) return slides.length - 1;
      return i;
    },
    [slides.length]
  );

  const animateTo = (targetIndex: number) => {
    setDragging(false);
    setDragX(0);
    setIndex(clampIndex(targetIndex));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    interactedRef.current = true; // allow inline play on next interactions
    onFirstInteraction?.();

    if (e.pointerType === "mouse" && e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    axisLocked.current = null;
    setDragging(true);
    startX.current = e.clientX;
    lastX.current = e.clientX;
    startY.current = e.clientY;
    startT.current = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (!axisLocked.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        axisLocked.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (axisLocked.current === "y") {
      setDragging(false);
      setDragX(0);
      return;
    }

    e.preventDefault();

    const atStart = index === 0;
    const atEnd = index === slides.length - 1;
    let nextDrag = dx;
    if ((atStart && dx > 0) || (atEnd && dx < 0)) {
      nextDrag = Math.sign(dx) * Math.min(Math.abs(dx) * 0.35, MAX_OVERSWIPE_PX);
    }
    setDragX(nextDrag);
    lastX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    const totalDx = e.clientX - startX.current;
    const dt = Math.max(1, performance.now() - startT.current);
    const velocity = Math.abs(e.clientX - lastX.current) / dt;
    const atEnd = index === slides.length - 1;

    let next = index;
    if (Math.abs(totalDx) > SWIPE_THRESHOLD_PX || velocity > VELOCITY_THRESHOLD) {
      next = totalDx < 0 ? index + 1 : index - 1;
    }

    // If moving onto the map slide → open sheet (and snap back to a non-map slide)
    if (mapIndex >= 0 && next === mapIndex) {
      prevIndexRef.current = index;
      setMapOpen(true);
      const fallback = Math.max(0, mapIndex - 1);
      setDragging(false);
      setDragX(0);
      setIndex(clampIndex(index !== mapIndex ? index : fallback));
      return;
    }

    if (!disableOverswipe && atEnd && (totalDx < -OVERSWIPE_STRONG_PX || velocity > OVERSWIPE_VELOCITY)) {
      setDragging(false);
      setDragX(0);
      onOverswipeRightAtEnd?.();
      return;
    }

    animateTo(next);
  };

  // keyboard nav (ESC closes sheet)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => clampIndex(i - 1));
      if (e.key === "ArrowRight") setIndex((i) => clampIndex(i + 1));
      if (e.key === "Escape") setMapOpen(false);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [clampIndex]);

  // transforms
  const baseX = -index * 100;
  const dragPct = containerRef.current ? (dragX / containerRef.current.clientWidth) * 100 : 0;
  const translate = `translate3d(${baseX + dragPct}%, 0, 0)`;

  // icons for progress
  const IconVideo = (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5">
      <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
  );
  const IconMap = (
    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5">
      <path
        d="M12 2C8.7 2 6 4.7 6 8c0 4 6 12 6 12s6-8 6-12c0-3.3-2.7-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5z"
        fill="currentColor"
      />
    </svg>
  );
  const renderProgressUnit = (s: Slide, i: number) => {
    const isActive = i === index;
    const chip = "inline-flex items-center justify-center rounded-full bg-white/70";
    if (s.kind === "video") {
      return (
        <span key={i} className={clsx(chip, isActive ? "w-7 h-2" : "w-6 h-1.5 opacity-60")}>
          <span className="text-[9px] leading-none text-black/80">{IconVideo}</span>
        </span>
      );
    }
    if (s.kind === "map") {
      return (
        <span key={i} className={clsx(chip, isActive ? "w-7 h-2" : "w-6 h-1.5 opacity-60")}>
          <span className="text-[9px] leading-none text-black/80">{IconMap}</span>
        </span>
      );
    }
    return (
      <span key={i} className={clsx("h-1 rounded-full bg-white/70", isActive ? "w-10" : "w-6 opacity-60")} />
    );
  };

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full h-full min-h-0 overflow-hidden touch-pan-y select-none", className)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Track */}
      <div
        className={clsx(
          "flex h-full will-change-transform",
          dragging ? "transition-none" : "transition-transform duration-200 ease-out"
        )}
        style={{ transform: translate }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative w-full h-full shrink-0">
            {/* IMAGE */}
            {s.kind === "image" && (
              <img src={s.src} alt="" className="h-full w-full object-cover object-center" draggable={false} />
            )}

            {/* VIDEO */}
            {s.kind === "video" && (
              <>
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={s.src}
                  poster={s.poster}
                  muted
                  playsInline
                  // @ts-ignore
                  disablePictureInPicture
                  // @ts-ignore
                  disableRemotePlayback
                  controls={false}
                  preload={i === index ? "auto" : "metadata"}
                  className="h-full w-full object-cover"
                />

                {i === index && (
                  <button
                    aria-label={allowSound ? "Mute video" : "Unmute video"}
                    className="absolute right-2 top-2 z-20 rounded-full bg-black/60 p-2 text-white shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!(window as any).__lastUserUnmuteAt) (window as any).__lastUserUnmuteAt = 0;

                      setAllowSound((prev) => {
                        const next = !prev; // true => sound ON
                        const vEl = videoRefs.current[index];
                        if (vEl) {
                          if (next) {
                            // Fully unmute in a Safari-friendly way
                            vEl.muted = false;
                            vEl.defaultMuted = false;
                            vEl.removeAttribute("muted");
                            vEl.playsInline = true;
                            if (vEl.volume === 0) vEl.volume = 1.0;

                            const p = vEl.play();
                            if (p && typeof p.catch === "function") p.catch(() => {});
                            (window as any).__lastUserUnmuteAt = Date.now();
                          } else {
                            vEl.muted = true;
                            vEl.defaultMuted = true;
                          }
                        }
                        return next;
                      });
                    }}
                  >
                    {allowSound ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M3 10v4h4l5 5V5L7 10H3zm11.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 14.5 12z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M16.5 12A4.5 4.5 0 0 0 12 7.5v-3A7.5 7.5 0 0 1 19.5 12 7.46 7.46 0 0 1 18 16.39l-2.12-2.12A4.48 4.48 0 0 0 16.5 12zM3 10v4h4l5 5V5L7 10H3zM21 20.49 2.51 2 1.1 3.41l3.7 3.7L7 9.3l5 5 2.2 2.2 4.29 4.29L21 20.49z" fill="currentColor" />
                      </svg>
                    )}
                  </button>
                )}
              </>
            )}

            {/* MAP (non-interactive trigger slide) */}
            {s.kind === "map" && (
              <button
                type="button"
                onClick={() => {
                  prevIndexRef.current = index;
                  setMapOpen(true);
                  // snap back to previous image so top stays swipable
                  const fallback = Math.max(0, (mapIndex ?? 1) - 1);
                  setIndex((cur) => (cur === mapIndex ? fallback : cur));
                }}
                className="group h-full w-full"
              >
                <div className="relative h-full w-full bg-neutral-900/80 text-white flex items-center justify-center">
                  <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md">
                    <div className="flex items-center gap-2 opacity-90">
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
                        <path
                          d="M12 2C8.7 2 6 4.7 6 8c0 4 6 12 6 12s6-8 6-12c0-3.3-2.7-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Open map</span>
                    </div>
                    <div className="mt-1 text-[11px] opacity-75">Tap to view location</div>
                  </div>
                </div>
              </button>
            )}

            {s.kind === "placeholder" && (
              <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-600">
                {s.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* top progress with icons */}
      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center gap-2">
        {slides.map((s, i) => renderProgressUnit(s, i))}
      </div>

      {/* Drop-up Map Sheet (60% height, animated) */}
      {mapIndex >= 0 && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close map"
            onClick={() => setMapOpen(false)}
            className={clsx(
              "absolute inset-0 z-40 transition-opacity duration-200",
              mapOpen ? (mapVisible ? "opacity-100" : "opacity-0") : "pointer-events-none opacity-0"
            )}
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          />

          {/* Sheet container */}
          <div
            className={clsx(
              "absolute left-0 right-0 z-50 rounded-t-2xl bg-white shadow-xl",
              "transition-transform duration-250 ease-out"
            )}
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
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-neutral-700">
                  <path
                    d="M12 2C8.7 2 6 4.7 6 8c0 4 6 12 6 12s6-8 6-12c0-3.3-2.7-6-6-6zm0 9.5A3.5 3.5 0 1 1 12 4a3.5 3.5 0 0 1 0 7z"
                    fill="currentColor"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-neutral-800">Location</h3>
              </div>
              <button
                onClick={() => setMapOpen(false)}
                className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                {mapOpen && (
                  <iframe
                    loading="lazy"
                    allowFullScreen
                    className="h-[min(60vh,100%)] w-full"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${(slides[mapIndex] as any).lat},${(slides[mapIndex] as any).lng}&z=15&output=embed`}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
