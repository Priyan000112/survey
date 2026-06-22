"use client";

import { useEffect, useState } from "react";
import { fetchVoteSummary } from "@/lib/storage";
import type { StatBucket, VoteSummary } from "@/lib/types";
import { SkeletonBlock } from "@/components/skeleton-block";

function SummaryCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/10">
      <p className="text-sm text-white/78">{label}</p>
      <p className="mt-2 text-2xl font-bold leading-tight text-white">{value}</p>
    </div>
  );
}

function MainChart({
  items,
  total,
  lastUpdated
}: {
  items: StatBucket[];
  total: number;
  lastUpdated: Date | null;
}) {
  return (
    <section className="panel rounded-3xl p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Fokus utama</span>
          <h2 className="mt-3 text-2xl font-bold text-brand-950">
            Elektabilitas sementara
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-500">{total} responden</p>
          {lastUpdated && (
            <p className="text-xs text-stone-400">
              Diperbarui {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item, index) => {
          const percentage = total ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0;

          return (
            <div
              key={item.label}
              className={`rounded-2xl border p-4 ${
                index === 0
                  ? "border-brand-200 bg-brand-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-stone-500">
                    {index === 0 ? "Peringkat 1" : `Peringkat ${index + 1}`}
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-6 text-stone-900">
                    {item.label}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-bold text-brand-700">
                    {percentage}%
                  </div>
                  <div className="text-sm text-stone-500">{item.count} suara</div>
                </div>
              </div>

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CompactChart({
  title,
  items,
  total
}: {
  title: string;
  items: StatBucket[];
  total: number;
}) {
  return (
    <section className="panel rounded-2xl p-5">
      <h2 className="text-lg font-semibold text-brand-950">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const percentage = total ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0;

          return (
            <div key={item.label} className="rounded-xl bg-stone-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium leading-6 text-stone-800">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-brand-700">
                  {percentage}%
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ResultsPanel() {
  const [ready, setReady] = useState(false);
  const [summary, setSummary] = useState<VoteSummary | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;

    function load() {
      fetchVoteSummary()
        .then((serverSummary) => {
          if (!active) return;
          setSummary(serverSummary);
          setLoadError(false);
          setReady(true);
          setLastUpdated(new Date());
        })
        .catch(() => {
          if (!active) return;
          setSummary(null);
          setLoadError(true);
          setReady(true);
        });
    }

    load();
    const interval = setInterval(load, 30_000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!ready || !summary) {
    if (ready && loadError) {
      return (
        <section className="panel rounded-2xl p-5">
          <h2 className="text-xl font-semibold text-brand-950">Hasil sementara</h2>
          <p className="mt-3 text-[15px] leading-7 text-stone-700">
            Data hasil belum bisa dimuat sekarang. Coba buka lagi sebentar.
          </p>
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <SkeletonBlock className="h-44 w-full" />
        <SkeletonBlock className="h-80 w-full" />
        <SkeletonBlock className="h-64 w-full" />
      </section>
    );
  }

  if (summary.totalVotes === 0) {
    return (
      <section className="panel rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-brand-950">Belum ada hasil masuk</h2>
        <p className="mt-3 text-[15px] leading-7 text-stone-700">
          Belum ada suara yang tercatat. Nanti kalau sudah ada yang mengisi,
          ringkasan dan grafik akan muncul di sini.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-brand-700 text-white shadow-[0_24px_64px_rgba(16,45,32,0.18)]">
        <div className="space-y-4 px-5 py-5">
          <div>
            <span className="inline-flex rounded-full bg-white/12 px-3 py-1 text-sm">
              Ringkasan cepat
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-tight">
              Gambaran hasil sementara
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard label="Total responden" value={`${summary.totalVotes}`} />
            <SummaryCard label="Tokoh teratas" value={summary.leader} />
            <SummaryCard label="Isu teratas" value={summary.topIssue} />
          </div>
        </div>
      </section>

      <MainChart items={summary.candidateStats} total={summary.totalVotes} lastUpdated={lastUpdated} />

      <section className="grid gap-4">
        <CompactChart
          title="Isu paling banyak dipilih"
          items={summary.issueStats}
          total={summary.totalVotes}
        />
        <CompactChart
          title="Distribusi responden per dusun"
          items={summary.dusunStats}
          total={summary.totalVotes}
        />
        <CompactChart
          title="Distribusi usia"
          items={summary.ageStats}
          total={summary.totalVotes}
        />
        <CompactChart
          title="Kepuasan terhadap pemerintahan saat ini"
          items={summary.satisfactionStats}
          total={summary.totalVotes}
        />
      </section>
    </section>
  );
}
