"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DateRange = { start?: Date; end?: Date };

type Props = {
  value: DateRange;
  onChange: (v: DateRange) => void;
  onComplete?: (v: Required<DateRange>) => void;
  className?: string;
};

export default function DateRangePicker({ value, onChange, onComplete, className }: Props) {
  const today = startOfDay(new Date());
  const [monthCursor, setMonthCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // When start chosen, auto move to the month of the end if later
  useEffect(() => {
    if (value.start && (!value.end || value.end < value.start)) {
      // stay on current; user is picking end
    }
  }, [value.start, value.end]);

  const weeks = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);

  const selectingEnd = Boolean(value.start && !value.end);

  const onDayClick = (day: Date) => {
    if (day < today) return;
    if (!value.start || (value.start && value.end)) {
      onChange({ start: day, end: undefined });
      return;
    }
    // selecting end
    if (value.start) {
      const start = value.start;
      const end = day < start ? start : day;
      const range = { start, end } as Required<DateRange>;
      onChange(range);
      onComplete?.(range);
    }
  };

  const isInRange = (d: Date) => {
    if (!value.start) return false;
    if (value.start && !value.end) return isSameDay(d, value.start);
    if (value.start && value.end) return d >= startOfDay(value.start) && d <= endOfDay(value.end);
    return false;
  };

  const isStart = (d: Date) => value.start && isSameDay(d, value.start);
  const isEnd = (d: Date) => value.end && isSameDay(d, value.end);

  return (
    <div className={`w-full select-none ${className ?? ""}`} aria-label="Calendar date range picker">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {monthCursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          aria-label="Next month"
          className="rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus-visible:ring"
          onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((d, i) => {
          const inMonth = d.getMonth() === monthCursor.getMonth();
          const disabled = d < today || !inMonth;
          const inRange = isInRange(d);
          const start = isStart(d);
          const end = isEnd(d);
          return (
            <button
              key={i}
              type="button"
              aria-label={`Select ${d.toDateString()}`}
              disabled={disabled}
              onClick={() => onDayClick(d)}
              className={`relative h-9 rounded-md text-sm focus:outline-none focus-visible:ring ${
                disabled ? "cursor-not-allowed text-neutral-300" : "hover:bg-neutral-100"
              } ${inRange ? "bg-neutral-900 text-white" : ""} ${start || end ? "!bg-black !text-white" : ""}`}
            >
              {d.getDate()}
              {start && (
                <span className="pointer-events-none absolute -top-1 -left-1 rounded bg-black px-1 py-0.5 text-[10px] text-white">Start</span>
              )}
              {end && !start && (
                <span className="pointer-events-none absolute -top-1 -left-1 rounded bg-black px-1 py-0.5 text-[10px] text-white">End</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-neutral-600">
        {selectingEnd ? "Select checkout date" : value.start ? "Dates selected" : "Select check-in date"}
      </div>
    </div>
  );
}

function isSameDay(a: Date, b?: Date) {
  if (!b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function endOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(23, 59, 59, 999);
  return n;
}

function buildMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekday = first.getDay();
  const start = new Date(first);
  start.setDate(first.getDate() - startWeekday);
  const days: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      week.push(startOfDay(day));
    }
    days.push(week);
  }
  return days;
}

