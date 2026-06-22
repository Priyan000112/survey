"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, HelpCircle, Home, Users } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/kandidat", label: "Kandidat", icon: Users },
  { href: "/survei", label: "Survei", icon: ClipboardList },
  { href: "/hasil", label: "Hasil", icon: BarChart3 },
  { href: "/tentang", label: "Tentang", icon: HelpCircle }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
      <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/90 px-2 py-2 shadow-[0_18px_40px_rgba(17,24,39,0.14)] backdrop-blur sm:max-w-2xl">
        <div className="grid grid-cols-5">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`focus-ring flex min-h-[64px] flex-col items-center justify-center rounded-2xl px-1 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-brand-700 text-white shadow-lg shadow-brand-900/15"
                    : "text-stone-500 hover:bg-stone-50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="mb-1 h-6 w-6" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
