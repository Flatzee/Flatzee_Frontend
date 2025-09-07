"use client";

import { useEffect, useState } from "react";

export function ImageNavTip({ onDismiss }: { onDismiss: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = typeof window !== 'undefined' && sessionStorage.getItem('tipImageNav') === '1';
    if (!seen) setShow(true);
  }, []);
  if (!show) return null;
  const dismiss = () => { try { sessionStorage.setItem('tipImageNav','1'); } catch {}; setShow(false); onDismiss(); };
  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white shadow-md backdrop-blur">
        <span>Tap left or right to change photo</span>
        <button onClick={dismiss} className="rounded-full border border-white/30 px-2 py-0.5 text-[10px] hover:bg-white/10 focus:outline-none focus-visible:ring">Got it</button>
      </div>
    </div>
  );
}

export function ScrollHint() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const seen = typeof window !== 'undefined' && sessionStorage.getItem('tipScroll') === '1';
    if (!seen) setShow(true);
    const el = document.getElementById('feed-scroll');
    if (!el) return;
    const onScroll = () => {
      if (!show) return;
      const y = (el as HTMLElement).scrollTop;
      const threshold = Math.max(320, window.innerHeight * 0.7);
      if (y > threshold) {
        try { sessionStorage.setItem('tipScroll','1'); } catch {}
        setShow(false);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [show]);
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center">
      <div className="animate-bounce rounded-full bg-black/60 px-3 py-1 text-xs text-white shadow">Scroll for next ↓</div>
    </div>
  );
}

