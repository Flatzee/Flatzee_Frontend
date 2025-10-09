"use client";
import { useEffect, useRef } from "react";

/**
 * Keeps --vvh in sync with the visual viewport and performs a single,
 * instant re-snap *after* the browser chrome finishes animating.
 * No resnaps during normal scroll; no smooth scrolling here.
 */
export default function ViewportProvider() {
  const finalizeTimer = useRef<number | null>(null);
  const lastVVHRef = useRef<number>(0);
  const settlingRef = useRef<boolean>(false);
  const lastSettleAtRef = useRef<number>(0);

  useEffect(() => {
  // ----- Platform gating -----
  const ua = navigator.userAgent || "";
  const isIOS =
    /iP(hone|ad|od)/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const supportsDVH = typeof CSS !== "undefined" && CSS.supports?.("height", "100dvh");

  // On Chromium/Brave/Android: let CSS handle it (no listeners = no jitter)
  if (!isIOS && supportsDVH) {
    document.documentElement.style.setProperty("--vvh", "100dvh");
    return; // do not attach visualViewport listeners
  }

  // ----- iOS/WebKit path: stabilize after chrome animation -----
  const HEIGHT_EPS = 6;        // ignore tiny height changes (px)
  const STABLE_MS = 100;       // how long the height must be stable
  const SETTLE_COOLDOWN = 350; // don't resettle again within this window

  let finalizeTimer: number | null = null;
  let lastVVH = 0;
  let lastSettleAt = 0;

  const setVVH = () => {
    const h = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty("--vvh", `${h}px`);
    return h;
  };

  const getScrollPadTop = () => {
    const cs = getComputedStyle(document.documentElement);
    const pad = parseInt(cs.getPropertyValue("scroll-padding-top"));
    const bar = parseInt(cs.getPropertyValue("--searchbar-h")) || 56;
    return Number.isFinite(pad) && pad > 0 ? pad : bar;
  };

  const snapToNearest = () => {
    const now = performance.now();
    if (now - lastSettleAt < SETTLE_COOLDOWN) return;
    lastSettleAt = now;

    const cards = document.querySelectorAll(".snap-card");
    if (!cards.length) return;

    const padTop = getScrollPadTop();
    const scrollTop = window.scrollY;

    let closest: Element | null = null;
    let minDist = Infinity;

    cards.forEach((card) => {
      const rect = (card as Element).getBoundingClientRect();
      const targetY = scrollTop + rect.top - padTop;
      const d = Math.abs(scrollTop - targetY);
      if (d < minDist) {
        minDist = d;
        closest = card;
      }
    });

    if (closest && minDist > 2) {
      const rect = (closest as Element).getBoundingClientRect();
      const targetY = window.scrollY + rect.top - padTop;
      // Instant correction; do NOT smooth (prevents tug-of-war with Safari)
      window.scrollTo({ top: targetY });
    }
  };

  const scheduleFinalize = () => {
    if (finalizeTimer) window.clearTimeout(finalizeTimer);
    finalizeTimer = window.setTimeout(() => {
      snapToNearest();
    }, STABLE_MS);
  };

  const onVVResize = () => {
    const h = setVVH();
    if (Math.abs(h - lastVVH) > HEIGHT_EPS) {
      lastVVH = h;
    }
    // Only perform a single settle after the height stops changing
    scheduleFinalize();
  };

  const onWindowResize = () => onVVResize();

  // Initial set
  lastVVH = setVVH();

  // Listeners (minimal)
  window.addEventListener("resize", onWindowResize, { passive: true });
  window.addEventListener("orientationchange", onWindowResize);
  window.visualViewport?.addEventListener("resize", onVVResize);
  // Do NOT listen to visualViewport.scroll (too noisy on Chromium)

  return () => {
    if (finalizeTimer) window.clearTimeout(finalizeTimer);
    window.removeEventListener("resize", onWindowResize);
    window.removeEventListener("orientationchange", onWindowResize);
    window.visualViewport?.removeEventListener("resize", onVVResize);
  };
}, []);


  return null;
}
