import type { Candidate } from "@/lib/types";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <article className="panel rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-lg font-bold text-brand-700 ring-1 ring-brand-100">
          {candidate.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950">{candidate.name}</h2>
            <span className="rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-[#8c6509]">
              {candidate.category}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-stone-500">
            Tokoh potensial, belum tentu calon resmi
          </p>
          <p className="mt-3 text-base leading-7 text-stone-700">
            {candidate.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
