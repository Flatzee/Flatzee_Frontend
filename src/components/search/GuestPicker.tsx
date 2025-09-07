"use client";

import { useEffect, useState } from "react";

type Props = {
  defaultValue?: { adults?: number; children?: number; infants?: number };
  onComplete?: (totalGuests: number, breakdown: { adults: number; children: number; infants: number }) => void;
  className?: string;
};

export default function GuestPicker({ defaultValue, onComplete, className }: Props) {
  const [adults, setAdults] = useState(defaultValue?.adults ?? 2);
  const [children, setChildren] = useState(defaultValue?.children ?? 0);
  const [infants, setInfants] = useState(defaultValue?.infants ?? 0);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onComplete?.(adults + children, { adults, children, infants });
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [adults, children, infants, onComplete]);

  const total = adults + children;

  return (
    <div className={`w-full ${className ?? ""}`} aria-label="Guests picker">
      <div className="space-y-3">
        <Row label="Adults" value={adults} onChange={setAdults} ariaLabel="Adjust adults" />
        <Row label="Children" value={children} onChange={setChildren} ariaLabel="Adjust children" />
        <Row label="Infants" value={infants} onChange={setInfants} ariaLabel="Adjust infants" />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="text-neutral-600">{total} guest{total === 1 ? "" : "s"} • {infants} infant{infants === 1 ? "" : "s"}</div>
        <button
          type="button"
          aria-label="Apply guests"
          onClick={() => onComplete?.(total, { adults, children, infants })}
          className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 focus:outline-none focus-visible:ring"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, onChange, ariaLabel }: { label: string; value: number; onChange: (n: number) => void; ariaLabel: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${ariaLabel}`}
          className="h-8 w-8 rounded-full border text-lg leading-none hover:bg-neutral-50 focus:outline-none focus-visible:ring"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          -
        </button>
        <div className="w-6 text-center text-sm" aria-live="polite">{value}</div>
        <button
          type="button"
          aria-label={`Increase ${ariaLabel}`}
          className="h-8 w-8 rounded-full border text-lg leading-none hover:bg-neutral-50 focus:outline-none focus-visible:ring"
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

