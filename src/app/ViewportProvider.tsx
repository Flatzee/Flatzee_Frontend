"use client";
import { useEffect, useRef } from "react";

/* ULTRA-STABLE VIEWPORT PROVIDER (refined)
   - Android: 100svh (stable)
   - iOS: debounced visualViewport, first-scroll freeze
   - NEW: skip freeze during programmatic scrolls (data-progscroll="1")
   - NEW: on unfreeze, force a fresh setVVH() so --vvh is never stale
   - Honors data-nosettle="1" to skip snapping only (still updates --vvh)
*/
export default function ViewportProvider() {
  const finalizeTimer = useRef<number | null>(null);
  const resizeTimer = useRef<number | null>(null);
  const freezeTimer = useRef<number | null>(null);
  const frozenRef = useRef(false);
  const interactingRef = useRef(false);

  useEffect(() => {
    const html = document.documentElement;

    const ua = navigator.userAgent || "";
    const isIOS =
      /iP(hone|ad|od)/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const supports = (p: string, v: string) =>
      typeof CSS !== "undefined" && CSS.supports?.(p, v);

    // ANDROID / CHROMIUM → fixed (stable) height
    if (!isIOS) {
      const chosen = supports("height", "100svh")
        ? "100svh"
        : supports("height", "100dvh")
          ? "100dvh"
          : "100vh";
      html.style.setProperty("--vvh", chosen);
      return;
    }

    // iOS / WebKit path
    const HEIGHT_EPS = 12;
    const STABLE_MS = 300;
    const SETTLE_COOLDOWN = 500;

    let lastVVH = 0;
    let lastSettleAt = 0;

    const setVVH = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      html.style.setProperty("--vvh", `${h}px`);
      return h;
    };

    const getScrollPadTop = () => {
      const cs = getComputedStyle(html);
      const pad = parseInt(cs.getPropertyValue("scroll-padding-top"));
      const bar = parseInt(cs.getPropertyValue("--searchbar-h")) || 56;
      return Number.isFinite(pad) && pad > 0 ? pad : bar;
    };

    const snapToNearest = () => {
      // Skip snapping if page opted out (but still allow measurement)
      if (html.getAttribute("data-nosettle") === "1") return;
      if (frozenRef.current || interactingRef.current) return;

      const now = performance.now();
      if (now - lastSettleAt < SETTLE_COOLDOWN) return;
      lastSettleAt = now;

      const cards = document.querySelectorAll<HTMLElement>(".snap-card");
      if (!cards.length) return;

      const padTop = getScrollPadTop();
      const scrollTop = window.scrollY;
      let closest: HTMLElement | null = null;
      let minDist = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const targetY = scrollTop + rect.top - padTop;
        const d = Math.abs(scrollTop - targetY);
        if (d < minDist) {
          minDist = d;
          closest = card;
        }
      });

      if (closest && minDist > 4) {
        const rect = (closest as HTMLElement).getBoundingClientRect();
        const targetY = window.scrollY + rect.top - padTop;
        window.scrollTo({ top: targetY }); // instant correction
      }
    };

    const scheduleFinalize = () => {
      if (finalizeTimer.current) window.clearTimeout(finalizeTimer.current);
      finalizeTimer.current = window.setTimeout(() => {
        snapToNearest();
      }, STABLE_MS);
    };

    // Debounced visualViewport resize (but still allowed while frozen? No.)
    const onVVResize = () => {
      if (frozenRef.current) return; // ignore noisy changes while frozen
      if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
      resizeTimer.current = window.setTimeout(() => {
        const h = window.visualViewport?.height ?? window.innerHeight;
        if (Math.abs(h - lastVVH) > HEIGHT_EPS) {
          lastVVH = h;
          html.style.setProperty("--vvh", `${h}px`);
          scheduleFinalize();
        }
      }, 180);
    };

    const onWindowResize = () => onVVResize();

    // First user scroll → freeze ~0.9s, but NOT if programmatic
    /* Smooth-stabilize instead of hard-freeze  */
    let wheelTimer: number | undefined; // or: let wheelTimer: ReturnType<typeof setTimeout> | undefined;

    const onFirstScroll = () => {
      if (html.getAttribute("data-progscroll") === "1") return;
      if (frozenRef.current) return;

      // mark as stabilizing (still allow gentle height tracking)
      frozenRef.current = true;

      // adaptive tracking window: update vvH every 150 ms for ~1 s
      const t0 = performance.now(); // prefer-const ✅

      const tick = () => {
        if (!frozenRef.current) return;
        const dt = performance.now() - t0;
        setVVH(); // keep layout aligned with live viewport
        if (dt < 1000) {
          requestAnimationFrame(tick);
        } else {
          frozenRef.current = false;
          setVVH();           // final correction
          scheduleFinalize(); // optional snap settle
        }
      };

      requestAnimationFrame(tick);
    };

    // If attached to window via addEventListener('pointerdown', ...)
    // use native event types. If used as React props, you can switch to React.PointerEventHandler.
    const onPointerDown = (_e?: PointerEvent) => {
      interactingRef.current = true;
    };

    const onPointerUp = (_e?: PointerEvent) => {
      interactingRef.current = false;
      scheduleFinalize();
    };

    const onWheel = (_e?: WheelEvent) => {
      interactingRef.current = true;

      if (wheelTimer !== undefined) {
        window.clearTimeout(wheelTimer); // typed, no any ✅
      }

      wheelTimer = window.setTimeout(() => {
        interactingRef.current = false;
        scheduleFinalize();
      }, 200);
    };

    // Initial set + listeners
    lastVVH = setVVH();

    window.addEventListener("resize", onWindowResize, { passive: true });
    window.addEventListener("orientationchange", onWindowResize);
    window.visualViewport?.addEventListener("resize", onVVResize);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onFirstScroll, { passive: true });

    return () => {
      [finalizeTimer, resizeTimer, freezeTimer].forEach((r) => {
        if (r.current) window.clearTimeout(r.current);
      });
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("orientationchange", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onVVResize);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onFirstScroll);
    };
  }, []);

  return null;
}
