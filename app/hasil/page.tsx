import { ResultsPanel } from "@/components/results-panel";

export default function HasilPage() {
  return (
    <main className="page-shell space-y-5">
      <section className="rounded-3xl bg-white/60 p-1 backdrop-blur-sm">
        <div className="rounded-[1.3rem] border border-white/80 bg-white/70 p-5">
          <span className="eyebrow">Ringkasan suara</span>
          <h1 className="mt-3 text-[2rem] font-bold leading-tight text-brand-900 sm:text-3xl">
            Hasil Sementara
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-stone-700 sm:text-base">
            Ini cuma gambaran sementara dari warga yang ikut isi survei. Bukan
            hasil resmi pemilihan kepala desa.
          </p>
        </div>
      </section>
      <ResultsPanel />
    </main>
  );
}
