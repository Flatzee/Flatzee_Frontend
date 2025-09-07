"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type Tab = "forYou" | "premium" | "verified" | "popular";
export type TopBarProps = {
  value: Tab;
  onChange: (v: Tab) => void;
};

export default function TopBar({ value, onChange }: TopBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b bg-white/70 backdrop-blur-md px-4">
        {/* logo pill */}
        <div className="h-8 w-8 rounded-full bg-neutral-200" />
        {/* fake search (opens modal) */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center gap-2 rounded-full border px-4 py-2 text-left text-sm text-neutral-600"
        >
          <Search className="h-4 w-4" />
          <span className="truncate">
            Search: Destination · Dates · Guests
          </span>
        </button>
      </div>

      {/* tabs beneath header */}
      <div className="fixed inset-x-0 top-16 z-40 flex h-10 items-center gap-4 bg-white/80 px-4 text-sm">
        {([
          ["forYou", "For You"],
          ["premium", "Premium Listings"],
          ["verified", "Flatzee Verified"],
          ["popular", "Popular"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            className={`rounded-full px-3 py-1 ${
              value === (k as Tab)
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
            onClick={() => onChange(k as Tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Simple search modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 text-lg font-semibold">Search</div>
            <div className="grid gap-3 md:grid-cols-3">
              <input className="rounded-lg border p-2" placeholder="Destination" />
              <input className="rounded-lg border p-2" placeholder="Dates" />
              <input className="rounded-lg border p-2" placeholder="Guests" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg px-4 py-2 text-sm hover:bg-neutral-100" onClick={() => setOpen(false)}>Cancel</button>
              <button className="rounded-lg bg-black px-4 py-2 text-sm text-white" onClick={() => setOpen(false)}>Search</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
