"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crosshair, Heart, MapPin, Menu, Search, UserCircle } from "lucide-react";
import MobileDrawer from "@/components/nav/MobileDrawer";
import DateRangePicker, { type DateRange } from "@/components/search/DateRangePicker";
import GuestPicker from "@/components/search/GuestPicker";
import { nearestCity } from "@/lib/geo";

export type SearchState = {
  destination?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
};

type Props = {
  onApplySearch?: (v: SearchState) => void;
};

export default function TopBar({ onApplySearch }: Props) {
  // modal / stepper
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"dest" | "dates" | "guests">("dest");

  // search state
  const [destination, setDestination] = useState<string>("");
  const [range, setRange] = useState<DateRange>({});
  const [guests, setGuests] = useState<number | undefined>(undefined);

  // ui state
  const [showSuggest, setShowSuggest] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileCollapsed, setMobileCollapsed] = useState(false);

  // first-time snackbar hint
  const [showHint, setShowHint] = useState(false);

  // single compact mobile bar ref (always compact to avoid flicker)
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  const SUGGESTIONS = ["Kathmandu", "Bhaktapur", "Lalitpur", "Pokhara", "Butwal", "Biratnagar", "Dharan"];

  // preload destination from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("fz.dest");
      if (saved) setDestination(saved);
    } catch { }
  }, []);

  useEffect(() => {
    const getScroller = () => {
      // Mobile: root window scroll enables chrome shrinking
      // Desktop: inner scroller for traditional behavior
      return window.innerWidth < 768
        ? window
        : document.getElementById("feed-scroll") || window;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = (window.innerWidth < 768)
          ? window.scrollY
          : (document.getElementById("feed-scroll")?.scrollTop || 0);
        const collapsed = y > 16;
        setMobileCollapsed(collapsed);
        document.documentElement.setAttribute("data-top-collapsed", collapsed ? "1" : "0");
        ticking = false;
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scroller: any = getScroller();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);


  // first-time snackbar (mobile only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;
    const seen = sessionStorage.getItem("fz.searchHint") === "1";
    if (!seen) {
      setShowHint(true);
      const t = window.setTimeout(() => dismissHint(), 10000);
      return () => window.clearTimeout(t);
    }
  }, []);
  const dismissHint = () => {
    try {
      sessionStorage.setItem("fz.searchHint", "1");
    } catch { }
    setShowHint(false);
  };

  // keep CSS vars in sync with the compact bar height
  const writeBarHeights = useCallback(() => {
    const root = document.documentElement;
    root.style.setProperty("--topstrip-h", "0px"); // no extra strip
    const barH = Math.round(barRef.current?.getBoundingClientRect().height || 48);
    root.style.setProperty("--searchbar-h", `${barH}px`);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    writeBarHeights();
    const ro = new ResizeObserver(writeBarHeights);
    if (barRef.current) {
      ro.observe(barRef.current);
    }
    window.addEventListener("resize", writeBarHeights, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", writeBarHeights);
    };
  }, [writeBarHeights]);

  // summary line (shown inside compact pill)
  const summary = useMemo(() => {
    const dateText =
      range.start && range.end
        ? `${range.start.toLocaleDateString()} → ${range.end.toLocaleDateString()}`
        : "Dates";
    const guestText = guests ? `${guests} guest${guests === 1 ? "" : "s"}` : "Guests";
    return `${destination || "Destination"} • ${dateText} • ${guestText}`;
  }, [destination, range.start, range.end, guests]);

  // ESC to close modal
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const applySearch = () => {
    try {
      sessionStorage.setItem("fz.dest", destination || "");
      sessionStorage.setItem("fz.searchHint", "1"); // once used, never show hint again
    } catch { }

    onApplySearch?.({
      destination: destination || undefined,
      checkIn: range.start,
      checkOut: range.end,
      guests,
    });

    setOpen(false);
    pillRef.current?.focus();
  };

  const commitDestination = (value: string) => {
    const v = value.trim();
    setDestination(v);
    setShowSuggest(false);
    setStep("dates");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b bg-white shadow-sm isolation-auto">

      {/* single measurer for both desktop & mobile bars */}
      <div ref={barRef} className="mx-auto max-w-7xl">
        {/* DESKTOP BAR (unchanged) */}
        <div className="hidden md:flex h-14 items-center justify-between gap-3 px-4">
          {/* Left */}
          <button
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Center */}
          <button
            ref={pillRef}
            aria-label="Open search: destination, dates, guests"
            onClick={() => {
              setOpen(true);
              setStep("dest");
            }}
            className="group mx-auto flex min-w-[260px] max-w-xl flex-1 items-center justify-between gap-3 rounded-full border bg-white px-4 py-2 text-left text-sm text-neutral-700 shadow-sm focus:outline-none focus-visible:ring"
          >
            <div className="flex flex-1 items-center justify-between gap-3">
              <span className="truncate">{destination || "Destination"}</span>
              <span className="text-neutral-300">|</span>
              <span className="truncate">{range.start ? range.start.toLocaleDateString() : "Check-in"}</span>
              <span className="text-neutral-300">→</span>
              <span className="truncate">{range.end ? range.end.toLocaleDateString() : "Check-out"}</span>
              <span className="text-neutral-300">|</span>
              <span className="truncate">{guests ? `${guests} guest${guests === 1 ? "" : "s"}` : "Guests"}</span>
            </div>
            <Search className="h-4 w-4 text-neutral-500" />
          </button>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button aria-label="Wishlists" className="rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring">
              <Heart className="h-5 w-5" />
            </button>
            <button aria-label="Profile" className="rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring">
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* MOBILE BAR */}
        <div className="md:hidden">
          <div
            className={`flex items-center justify-between px-4 bg-transparent transition-all duration-300 ${mobileCollapsed ? "h-12" : "h-16"
              }`}
          >
            <div
              className={`font-semibold tracking-tight text-[#5563EB] select-none transition-all duration-300 ${mobileCollapsed ? "text-base" : "text-lg"
                }`}
            >
              Flatzee
            </div>

            {/* Center: search pill */}
            <button
              ref={pillRef}
              aria-label="Open search"
              onClick={() => { setOpen(true); setStep("dest"); }}
              className={`flex flex-1 mx-3 items-center justify-between overflow-hidden rounded-full border border-neutral-200 bg-white px-3 text-left text-xs text-neutral-700 shadow-sm focus:outline-none focus-visible:ring transition-all duration-300 ${mobileCollapsed ? "py-2" : "py-3"}`}
            >

              <div className="truncate">{summary}</div>
              <Search className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            </button>

            {/* Right: profile icon */}
            <button
              aria-label="Profile"
              className="rounded-full p-1.5 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
            >
              <UserCircle className="h-5 w-5 text-neutral-700" />
            </button>
          </div>



          {/* Snackbar hint (sits below the bar; auto-hides) */}
          {showHint && (
            <div
              role="status"
              className="fixed left-0 right-0 z-40"
              style={{ top: "calc(var(--searchbar-h) + 8px)" }}
            >
              <div className="mx-auto max-w-7xl px-3">
                <div className="mx-auto w-full rounded-lg bg-neutral-900/95 px-3 py-2 text-xs text-white shadow-lg backdrop-blur supports-[backdrop-filter]:bg-neutral-900/85 flex items-center justify-between">
                  <span>Tip: search a destination, dates, and guests for better matches.</span>
                  <button
                    onClick={dismissHint}
                    className="ml-3 rounded px-2 py-1 text-[11px] font-medium bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH MODAL */}
        {open && (
          <div
            className="fixed inset-0 z-[60] grid place-items-start bg-black/20 p-3 pt-[calc(var(--desktop-topbar-h))]"
            role="dialog"
            aria-label="Search panel"
            onClick={() => setOpen(false)}
          >
            <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 text-xs text-neutral-500">{summary}</div>

              {/* Step: Destination */}
              {step === "dest" && (
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-neutral-600" htmlFor="dest">
                    Destination
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      id="dest"
                      className="w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus-visible:ring"
                      placeholder="Where to?"
                      value={destination}
                      onFocus={() => setShowSuggest(true)}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowSuggest(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitDestination(destination);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowSuggest(false), 100)}
                    />
                    {showSuggest && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white p-1 shadow-lg">
                        <button
                          type="button"
                          aria-label="Use current location"
                          className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              alert("Geolocation not supported");
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const city = nearestCity(pos.coords.latitude, pos.coords.longitude);
                                commitDestination(city);
                              },
                              () => {
                                alert("Location access denied");
                              },
                              { enableHighAccuracy: false, maximumAge: 300000 }
                            );
                          }}
                        >
                          <Crosshair className="h-4 w-4" /> Use current location
                        </button>
                        <div className="my-1 h-px bg-neutral-100" />
                        {SUGGESTIONS.filter((c) => c.toLowerCase().includes(destination.toLowerCase())).map((c) => (
                          <button
                            key={c}
                            type="button"
                            className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring"
                            onClick={() => {
                              commitDestination(c);
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step: Dates */}
              {step === "dates" && (
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-neutral-600">Select dates</label>
                  <DateRangePicker
                    value={range}
                    onChange={setRange}
                    onComplete={(r) => {
                      setRange(r);
                      setStep("guests");
                    }}
                  />
                </div>
              )}

              {/* Step: Guests */}
              {step === "guests" && (
                <div className="mb-1">
                  <label className="mb-2 block text-xs font-medium text-neutral-600">Guests</label>
                  <GuestPicker
                    onComplete={(total) => {
                      setGuests(total);
                      applySearch();
                    }}
                  />
                </div>
              )}

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 focus:outline-none focus-visible:ring"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  aria-label="Search"
                  onClick={applySearch}
                  disabled={!destination || !(range.start && range.end)}
                  className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:opacity-90 focus:outline-none focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </header >
  );
}
