import { useEffect, useRef, useState } from "react";
import { LISTINGS } from "@/data/listings";

export function useInfiniteListings(batchSize = LISTINGS.length) {
  const [data, setData] = useState(() =>
    Array.from({ length: batchSize }, (_, i) => ({
      ...LISTINGS[i % LISTINGS.length],
      id: `fz-${String(i + 1).padStart(3, "0")}`,
    }))
  );
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        const nextPage = pageRef.current + 1;
        const start = (nextPage - 1) * batchSize;
        const nextChunk = Array.from({ length: batchSize }, (_, i) => ({
          ...LISTINGS[(start + i) % LISTINGS.length],
          id: `fz-${String(start + i + 1).padStart(3, "0")}`,
        }));
        setData(prev => [...prev, ...nextChunk]);
        pageRef.current = nextPage;
      }
    }, { rootMargin: "600px" });

    if (sentinelRef.current) io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [batchSize]);

  return { data, sentinelRef };
}
