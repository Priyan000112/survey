"use client";

import { useEffect, useState } from "react";
import { fetchVoteSummary } from "@/lib/storage";

export function HomeStats() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetchVoteSummary()
      .then((summary) => {
        if (active) {
          setCount(summary.totalVotes);
        }
      })
      .catch(() => {
        if (active) {
          setCount(0);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-3xl bg-[#fcfaf5] p-1 shadow-soft">
      <div className="grid gap-4 rounded-[1.3rem] border border-white/80 bg-white/70 p-5 sm:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="eyebrow">Respon masuk</span>
          <h2 className="mt-3 text-base font-semibold text-brand-950">
            Total responden terkumpul
          </h2>
          <p className="mt-3 text-5xl font-bold text-brand-700">
            {count === null ? "--" : count}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-700 p-4 text-white">
          <p className="text-sm font-semibold text-white/90">
            Catatan keterbatasan
          </p>
          <p className="mt-3 text-sm leading-6 text-white/80">
            Angka ini berasal dari semua suara yang sudah masuk ke server
            survei.
          </p>
        </div>
      </div>
    </section>
  );
}
