import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { HomeStats } from "@/components/home-stats";
import { StickyHomeCta } from "@/components/sticky-home-cta";
import { issues } from "@/data/issues";

export default function HomePage() {
  return (
    <>
      <main className="page-shell space-y-7">
        <section className="overflow-hidden rounded-3xl bg-brand-700 text-white shadow-[0_24px_64px_rgba(16,45,32,0.22)]">
          <div className="soft-grid relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-brand-900/20" />
            <div className="relative space-y-5 px-5 py-6 sm:px-7 sm:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                  Aspirasi warga Desa Maribaya
                </span>
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white/80">
                  Mobile-first
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-lg text-[2rem] font-bold leading-tight sm:text-4xl">
                  Suara Warga Maribaya 2026
                </h1>
                <p className="max-w-xl text-[15px] leading-7 text-brand-50 sm:text-base">
                  Menurut panjenengan, siapa tokoh yang paling pantas jadi
                  perhatian warga untuk memimpin Desa Maribaya ke depan?
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/10 p-3 text-center">
                <div>
                  <p className="text-lg font-bold sm:text-xl">100%</p>
                  <p className="mt-1 text-xs text-white/80">Anonim</p>
                </div>
                <div>
                  <p className="text-lg font-bold sm:text-xl">1 Menit</p>
                  <p className="mt-1 text-xs text-white/80">Isi survei</p>
                </div>
                <div>
                  <p className="text-lg font-bold sm:text-xl">Tanpa</p>
                  <p className="mt-1 text-xs text-white/80">Login</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/survei"
                  className="touch-button focus-ring w-full rounded-xl bg-accent-300 text-brand-900 shadow-lg shadow-brand-900/10 hover:bg-accent-200"
                >
                  Isi Survei Sekarang
                </Link>
                <Link
                  href="/hasil"
                  className="touch-button focus-ring w-full rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/15"
                >
                  Lihat Hasil Sementara
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "100% Anonim",
              text: "Tanpa nama, NIK, nomor HP, atau alamat detail."
            },
            {
              icon: BadgeCheck,
              title: "Tanpa Login",
              text: "Langsung isi dari HP, termasuk browser WhatsApp."
            },
            {
              icon: Clock3,
              title: "Sekitar 1 Menit",
              text: "Pertanyaan singkat, satu per satu, mudah diikuti."
            }
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="panel rounded-2xl p-4 ring-1 ring-black/[0.02]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-semibold text-brand-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </section>

        <HomeStats />

        <section className="section-band">
          <div className="rounded-[1.1rem] bg-white/70 p-5">
            <span className="eyebrow">Kenapa survei ini dibuat?</span>
            <p className="mt-4 text-[15px] leading-7 text-stone-700 sm:text-base">
              Survei ini dibuat untuk menampung aspirasi warga secara terbuka,
              ringan, dan santai. Hasilnya bukan keputusan resmi, cuma
              gambaran obrolan warga yang ikut mengisi survei ini.
            </p>
          </div>
        </section>

        <section className="section-band">
          <div className="rounded-[1.1rem] bg-white/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="eyebrow">Prioritas warga</span>
                <h2 className="mt-3 text-2xl font-bold text-brand-950">
                  Isu utama warga
                </h2>
              </div>
              <Link
                href="/survei"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
              >
                Pilih isu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
                  className="grid gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/85 px-4 py-4 sm:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-700 ring-1 ring-stone-200">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium leading-6 text-stone-900 sm:text-base">
                      {issue.label}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">
                      {issue.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StickyHomeCta />
    </>
  );
}
