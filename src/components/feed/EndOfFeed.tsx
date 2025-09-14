"use client";

type Props = {
  onSearch?: () => void;
};

export default function EndOfFeed({ onSearch }: Props) {
  const openSearch = () => {
    if (onSearch) return onSearch();
    // Fallback: click the mobile pill if present
    const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open search"]');
    btn?.click();
  };

  const backToTop = () => {
    const scroller = document.getElementById("feed-scroll");
    scroller?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      className="
        relative
        h-[calc(100dvh-var(--searchbar-h)-var(--bottombar-h)-var(--bottom-safe))]
        min-h-[420px]
        w-full snap-start snap-always overflow-hidden rounded-2xl border
        bg-white grid place-items-center p-6 text-center
      "
      aria-label="End of results"
    >
      <div className="max-w-xs">
        <div className="text-2xl font-semibold">You’re all caught up</div>
        <p className="mt-2 text-sm text-neutral-600">
          Try a different destination or new dates to see more places.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={openSearch}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring"
          >
            Search new destination
          </button>
          <button
            onClick={backToTop}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring"
          >
            Back to top
          </button>
        </div>
      </div>
    </section>
  );
}
