export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-stone-200 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
