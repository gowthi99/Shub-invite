export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
          <span className="absolute inset-2 animate-pulse rounded-full bg-linear-to-br from-gold to-brand" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
