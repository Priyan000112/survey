"use client";

import { useMemo } from "react";
import { Copy, MessageCircleMore } from "lucide-react";

type ShareActionsProps = {
  sticky?: boolean;
  title?: string;
};

export function ShareActions({
  sticky = false,
  title = "Bagikan ke keluarga dan tetangga agar hasil lebih akurat."
}: ShareActionsProps) {
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.origin;
  }, []);

  const shareText = encodeURIComponent(
    "Ayo isi Survei Suara Warga Maribaya 2026. Suara panjenengan penting."
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    if (!shareUrl || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  }

  const wrapperClass = sticky
    ? "fixed inset-x-0 bottom-20 z-30 px-4 sm:bottom-24"
    : "";

  return (
    <div className={wrapperClass}>
      <div className="panel mx-auto max-w-md p-4 sm:max-w-2xl">
        <p className="text-sm font-medium text-brand-800">{title}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="touch-button focus-ring gap-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
          >
            <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
            Bagikan WhatsApp
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="touch-button focus-ring gap-2 rounded-xl border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
          >
            <Copy className="h-5 w-5" aria-hidden="true" />
            Salin tautan
          </button>
        </div>
      </div>
    </div>
  );
}
