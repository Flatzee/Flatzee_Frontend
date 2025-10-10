"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  images: string[];
  onOverswipeRightAtEnd?: () => void; // called when user swipes forward on last slide
  onFirstInteraction?: () => void;
  className?: string;
  disableOverswipe?: boolean;
};

const SWIPE_THRESHOLD_PX = 60;   // distance to trigger slide if slow
const VELOCITY_THRESHOLD = 0.4; // px/ms (fast flick)
const OVERSWIPE_STRONG_PX = 96;  // require a hard swipe to open listing
const OVERSWIPE_VELOCITY = 0.5;
const MAX_OVERSWIPE_PX = 56;     // how far we allow pulling past edges visually

export default function ImageCarousel({
  images,
  onOverswipeRightAtEnd,
  onFirstInteraction,
  className, disableOverswipe
}: Props) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);        // current drag delta
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const startT = useRef(0);
  const axisLocked = useRef<"x" | "y" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampIndex = useCallback((i: number) => {
    if (i < 0) return 0;
    if (i > images.length - 1) return images.length - 1;
    return i;
  }, [images.length]);

  // Helpers
  const animateTo = (targetIndex: number) => {
    setDragging(false);
    setDragX(0);
    setIndex(clampIndex(targetIndex));
  };

  // pointer handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    axisLocked.current = null;
    setDragging(true);
    startX.current = e.clientX;
    lastX.current = e.clientX;
    startY.current = e.clientY;
    startT.current = performance.now();
    onFirstInteraction?.();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // lock axis after small move
    if (!axisLocked.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        axisLocked.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }

    if (axisLocked.current === "y") {
      // let the page scroll vertically; don't treat as swipe
      setDragging(false);
      setDragX(0);
      return;
    }

    // Prevent vertical scrolling when we’re swiping horizontally
    e.preventDefault();

    // Limit overswipe at edges
    const atStart = index === 0;
    const atEnd = index === images.length - 1;
    let nextDrag = dx;
    if ((atStart && dx > 0) || (atEnd && dx < 0)) {
      // resistance at edges
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

    const atEnd = index === images.length - 1;

    // Decide next index
    let next = index;
    if (Math.abs(totalDx) > SWIPE_THRESHOLD_PX || velocity > VELOCITY_THRESHOLD) {
      next = totalDx < 0 ? index + 1 : index - 1;
    }

    // Overswipe forward on last slide -> open listing
    if (!disableOverswipe && atEnd && (totalDx < -OVERSWIPE_STRONG_PX || velocity > OVERSWIPE_VELOCITY)) {
      setDragging(false);
      setDragX(0);
      onOverswipeRightAtEnd?.();
      return;
    }

    animateTo(next);
  };

  // keyboard (accessibility)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => clampIndex(i - 1));
      if (e.key === "ArrowRight") setIndex((i) => clampIndex(i + 1));
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [clampIndex]);

  // compute transform
  const baseX = -index * 100; // percentage
  const dragPct =
    containerRef.current ? (dragX / containerRef.current.clientWidth) * 100 : 0;
  const translate = `translate3d(${baseX + dragPct}%, 0, 0)`;

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full h-full min-h-0 overflow-hidden touch-pan-y select-none", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Listing photos"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* track */}
      <div
        className={clsx(
          "flex h-full will-change-transform",   // ⬅️ important - this makes the image fill container in each listing card
          dragging ? "transition-none" : "transition-transform duration-200 ease-out"
        )}
        style={{ transform: translate }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full h-full shrink-0"> {/* <-- h-full */}
            {/* image fills slide */}
            {/* You can swap to <Image> if using next/image */}
            <img
              src={src}
              alt=""
              className="block h-full w-full object-cover object-center"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* dots (optional) */}
      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={clsx(
              "h-1 rounded-full bg-white/70",
              i === index ? "w-10" : "w-6 opacity-60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
