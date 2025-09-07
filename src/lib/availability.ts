export function isAvailable(
  listing: { availability?: { start: string; end: string }[] },
  checkIn?: Date,
  checkOut?: Date
): boolean {
  if (!checkIn || !checkOut) return true; // if no dates, treat as available
  if (!listing.availability || listing.availability.length === 0) return true; // no constraints

  const start = startOfDay(checkIn).getTime();
  const end = endOfDay(checkOut).getTime();
  return listing.availability.some((r) => {
    const rs = new Date(r.start).getTime();
    const re = new Date(r.end).getTime();
    return rs <= start && re >= end;
  });
}

export function startOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

export function endOfDay(d: Date) {
  const n = new Date(d);
  n.setHours(23, 59, 59, 999);
  return n;
}

