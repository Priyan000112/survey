import type { VotePayload, VoteSubmitResult, VoteSummary } from "@/lib/types";

const HAS_VOTED_KEY = "svm_2026_has_voted";
const TEXT_SCALE_KEY = "svm_2026_text_scale";

export type TextScale = "normal" | "large";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function isStorageAvailable() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const probe = "__svm_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function getHasVoted() {
  return read<boolean>(HAS_VOTED_KEY, false);
}

export async function submitVote(vote: VotePayload): Promise<VoteSubmitResult> {
  const storageAvailable = isStorageAvailable();

  if (storageAvailable && getHasVoted()) {
    return {
      saved: false,
      storageAvailable: true,
      duplicate: true,
      message: "Di browser ini survei sudah pernah dikirim."
    };
  }

  try {
    const response = await fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vote)
    });

    const data = (await response.json()) as VoteSubmitResult;

    if (response.ok && data.saved && storageAvailable) {
      write(HAS_VOTED_KEY, true);
    }

    return {
      ...data,
      storageAvailable
    };
  } catch {
    return {
      saved: false,
      storageAvailable,
      duplicate: false,
      message: "Koneksi ke server lagi bermasalah. Coba lagi sebentar."
    };
  }
}

export async function fetchVoteSummary() {
  const response = await fetch("/api/votes", {
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data hasil.");
  }

  const data = (await response.json()) as { summary: VoteSummary };
  return data.summary;
}

export function getTextScale(): TextScale {
  return read<TextScale>(TEXT_SCALE_KEY, "normal");
}

export function setTextScale(value: TextScale) {
  if (!isStorageAvailable()) {
    return;
  }

  write(TEXT_SCALE_KEY, value);
}
