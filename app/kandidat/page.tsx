import { CandidateCard } from "@/components/candidate-card";
import { candidates } from "@/data/candidates";

export default function KandidatPage() {
  return (
    <main className="page-shell space-y-5">
      <section className="panel rounded-2xl p-5">
        <span className="eyebrow">Daftar tokoh</span>
        <h1 className="mt-3 text-[2rem] font-bold leading-tight text-brand-900 sm:text-3xl">
          Tokoh Potensial
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-stone-700 sm:text-base">
          Daftar berikut memuat tokoh potensial yang sering disebut warga.
          Belum tentu menjadi calon resmi.
        </p>
      </section>

      <section className="space-y-4">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </section>
    </main>
  );
}
