import Link from "next/link";

export function StickyHomeCta() {
  return (
    <div className="fixed inset-x-0 bottom-20 z-30 px-4 sm:bottom-24">
      <div className="mx-auto max-w-md sm:max-w-2xl">
        <Link
          href="/survei"
          className="touch-button focus-ring w-full rounded-full bg-accent-300 text-brand-900 shadow-[0_18px_40px_rgba(201,154,22,0.32)] hover:bg-accent-200"
        >
          Isi Survei
        </Link>
      </div>
    </div>
  );
}
