import { SurveyFlow } from "@/components/survey-flow";

export default function SurveiPage() {
  return (
    <main className="page-shell space-y-5">
      <section className="rounded-3xl bg-white/60 p-1 backdrop-blur-sm">
        <div className="rounded-[1.3rem] border border-white/80 bg-white/70 p-5">
          <span className="eyebrow">Form survei</span>
          <h1 className="mt-3 text-[2rem] font-bold leading-tight text-brand-900 sm:text-3xl">
            Isi Survei
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-stone-700 sm:text-base">
            Jawab santai saja satu per satu. Kalau halaman ditutup sebelum
            dikirim, isian akan mulai lagi dari awal.
          </p>
        </div>
      </section>
      <SurveyFlow />
    </main>
  );
}
