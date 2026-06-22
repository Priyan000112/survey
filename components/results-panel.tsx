"use client";

import { useEffect, useState } from "react";
import { fetchVoteSummary } from "@/lib/storage";
import type { StatBucket, VoteSummary } from "@/lib/types";
import { SkeletonBlock } from "@/components/skeleton-block";
import { RefreshCw } from "lucide-react";

const MEDALS = ["🥇", "🥈", "🥉"];

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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-brand-950">Elektabilitas</h2>
        <div className="text-right">
          <p className="text-sm font-semibold text-stone-600">{total} suara</p>
          {lastUpdated && (
            <p className="flex items-center justify-end gap-1 text-xs text-stone-400">
              <RefreshCw className="h-3 w-3" />
              {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => {
          const percentage = total ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0;
          const isFirst = index === 0;

          return (
            <div
              key={item.label}
              className={`rounded-2xl border p-4 ${
                isFirst
                  ? "border-brand-300 bg-gradient-to-r from-brand-50 to-accent-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{MEDALS[index] ?? `${index + 1}`}</span>
                  <h3 className={`font-bold leading-tight ${isFirst ? "text-lg text-brand-900" : "text-base text-stone-800"}`}>
                    {item.label}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`font-bold ${isFirst ? "text-3xl text-brand-700" : "text-xl text-stone-700"}`}>
                    {percentage}%
                  </div>
                  <div className="text-xs text-stone-500">{item.count} suara</div>
                </div>
              </div>

              <div className="mt-3 h-4 overflow-hidden rounded-full bg-stone-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isFirst ? "bg-gradient-to-r from-brand-500 to-brand-700" : "bg-brand-400"}`}
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
      <h2 className="text-base font-bold text-brand-950">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => {
          const percentage = total ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0;

          return (
            <div key={item.label} className="rounded-xl bg-stone-50 px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-stone-800 leading-5">{item.label}</span>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-stone-400">{item.count} suara</span>
                  <span className="text-sm font-bold text-brand-700 w-12 text-right">{percentage}%</span>
                </div>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-brand-500"
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
          <p className="text-base text-stone-700">
            Data belum bisa dimuat. Coba buka lagi sebentar.
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
      <section className="panel rounded-2xl p-5 text-center space-y-2">
        <p className="text-4xl">🗳️</p>
        <h2 className="text-lg font-bold text-brand-950">Belum ada suara masuk</h2>
        <p className="text-base text-stone-600">
          Nanti kalau sudah ada yang mengisi, hasil akan muncul di sini.
        </p>
      </section>
    );
  }

  const leader = summary.candidateStats[0];
  const leaderPct = leader ? parseFloat(((leader.count / summary.totalVotes) * 100).toFixed(1)) : 0;

  return (
    <section className="space-y-4">
      {/* Hero banner tokoh teratas */}
      <section className="overflow-hidden rounded-3xl bg-brand-700 text-white shadow-[0_24px_64px_rgba(16,45,32,0.18)] p-5">
        <p className="text-sm text-white/70">Unggul sementara</p>
        <h2 className="mt-1 text-3xl font-bold leading-tight">{leader?.label}</h2>
        <p className="mt-1 text-5xl font-bold text-accent-300">{leaderPct}%</p>
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
          <div>
            <p className="text-xl font-bold">{summary.totalVotes}</p>
            <p className="mt-0.5 text-xs text-white/70">Total suara</p>
          </div>
          <div>
            <p className="text-xl font-bold">{summary.candidateStats.length}</p>
            <p className="mt-0.5 text-xs text-white/70">Tokoh</p>
          </div>
          <div>
            <p className="text-xl font-bold truncate text-sm leading-5 pt-1">{summary.topIssue.split(" ").slice(0, 2).join(" ")}</p>
            <p className="mt-0.5 text-xs text-white/70">Isu teratas</p>
          </div>
        </div>
      </section>

      <MainChart items={summary.candidateStats} total={summary.totalVotes} lastUpdated={lastUpdated} />

      <CompactChart title="Isu paling banyak dipilih" items={summary.issueStats} total={summary.totalVotes} />
      <CompactChart title="Per dusun" items={summary.dusunStats} total={summary.totalVotes} />
      <CompactChart title="Kelompok usia" items={summary.ageStats} total={summary.totalVotes} />
      <CompactChart title="Kepuasan pemerintahan desa" items={summary.satisfactionStats} total={summary.totalVotes} />
    </section>
  );
}
