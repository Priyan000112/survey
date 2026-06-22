"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { candidates } from "@/data/candidates";
import { issues } from "@/data/issues";
import {
  getHasVoted,
  isStorageAvailable,
  submitVote
} from "@/lib/storage";
import type { VoteRecord } from "@/lib/types";
import { ShareActions } from "@/components/share-actions";
import { SkeletonBlock } from "@/components/skeleton-block";

type Answers = Omit<VoteRecord, "timestamp">;
type StepOption = {
  value: string;
  label: string;
  caption?: string;
};

type SurveyStep = {
  key: keyof Answers;
  title: string;
  helper: string;
  options: StepOption[];
  required: boolean;
};

const dusunOptions: StepOption[] = [
  { value: "Dusun 1", label: "Dusun 1" },
  { value: "Dusun 2", label: "Dusun 2" },
  { value: "Dusun 3", label: "Dusun 3" },
  { value: "Luar Maribaya", label: "Luar Maribaya" }
];

const ageOptions: StepOption[] = [
  { value: "17-25", label: "17-25 tahun" },
  { value: "26-35", label: "26-35 tahun" },
  { value: "36-50", label: "36-50 tahun" },
  { value: "50+", label: "50+ tahun" }
];

const satisfactionOptions: StepOption[] = [
  { value: "Sangat puas", label: "Sangat puas" },
  { value: "Cukup puas", label: "Cukup puas" },
  { value: "Kurang puas", label: "Kurang puas" },
  { value: "Tidak puas", label: "Tidak puas" }
];

export function SurveyFlow() {
  const [ready, setReady] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [storageReady, setStorageReady] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [answers, setAnswers] = useState<Answers>({
    candidateId: "",
    issue: "",
    dusun: "",
    ageGroup: "",
    satisfaction: ""
  });

  useEffect(() => {
    const storageOk = isStorageAvailable();
    setStorageReady(storageOk);
    setHasVoted(getHasVoted());
    setReady(true);
  }, []);

  const steps = useMemo(
    (): SurveyStep[] => [
      {
        key: "candidateId",
        title: "Tokoh paling layak memimpin",
        helper: "Pilih satu nama yang menurut panjenengan paling layak dilirik warga.",
        options: candidates.map((candidate) => ({
          value: candidate.id,
          label: candidate.name,
          caption: candidate.category
        })),
        required: true
      },
      {
        key: "issue",
        title: "Isu paling penting bagi warga",
        helper: "Pilih satu hal yang menurut panjenengan paling perlu dibenahi.",
        options: issues.map((issue) => ({
          value: issue.label,
          label: issue.label,
          caption: issue.description
        })),
        required: true
      },
      {
        key: "dusun",
        title: "Panjenengan tinggal di mana?",
        helper: "Pilih dusun atau wilayah yang paling dekat.",
        options: dusunOptions,
        required: true
      },
      {
        key: "ageGroup",
        title: "Kelompok usia",
        helper: "Biar kelihatan gambaran umum yang ikut mengisi.",
        options: ageOptions,
        required: true
      },
      {
        key: "satisfaction",
        title: "Kepuasan terhadap pemerintahan desa saat ini",
        helper: "Pilih jawaban yang paling dekat dengan pandangan panjenengan.",
        options: satisfactionOptions,
        required: true
      }
    ],
    []
  );

  function selectAnswer(key: keyof Answers, value: string) {
    setAnswers((current) => ({
      ...current,
      [key]: value
    }));
  }

  function nextStep() {
    const currentStep = steps[stepIndex];
    const currentValue = answers[currentStep.key as keyof Answers];

    if (currentStep.required && !currentValue) {
      return;
    }

    if (stepIndex === steps.length - 1) {
      void handleSubmit();
      return;
    }

    setStepIndex((value) => value + 1);
  }

  async function handleSubmit() {
    setSubmitError("");

    const result = await submitVote(answers);

    setStorageReady(result.storageAvailable);

    if (!result.saved) {
      setHasVoted(result.duplicate);
      setSubmitError(result.message ?? "Suara gagal dikirim.");
      return;
    }

    setHasVoted(true);
    setSubmitted(true);
  }

  function previousStep() {
    setStepIndex((value) => Math.max(0, value - 1));
  }

  if (!ready) {
    return (
      <section className="panel rounded-2xl space-y-4 p-5">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-3/4" />
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </section>
    );
  }

  if (hasVoted && !submitted) {
    return (
      <section className="panel rounded-2xl space-y-4 p-5">
        <CheckCircle2 className="h-10 w-10 text-brand-600" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-brand-900">Suara sudah tercatat</h2>
        <p className="text-base leading-7 text-stone-700">
          Di browser ini survei sudah pernah dikirim. Hasil sementara masih bisa
          dilihat di halaman ringkasan.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/hasil"
            className="touch-button focus-ring bg-brand-600 text-white hover:bg-brand-700"
          >
            Lihat Hasil
          </Link>
          <Link
            href="/kandidat"
            className="touch-button focus-ring border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
          >
            Baca Profil Tokoh
          </Link>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <>
        <section className="panel rounded-2xl space-y-4 p-5">
          <CheckCircle2 className="h-10 w-10 text-brand-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-brand-900">Terima kasih</h2>
          <p className="text-base leading-7 text-stone-700">
            Suara panjenengan sudah masuk.
            {!storageReady && (
              <span className="mt-2 block text-brand-800">
                Mode privat terdeteksi, jadi ada kemungkinan suara tidak tersimpan.
              </span>
            )}
          </p>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm leading-6 text-stone-700">
              Survei ini dibuat santai untuk melihat gambaran umum. Hasil yang
              tampil berasal dari suara yang masuk ke server survei.
            </p>
          </div>
          <Link
            href="/hasil"
            className="touch-button focus-ring bg-brand-600 text-white hover:bg-brand-700"
          >
            Lihat Hasil Sementara
          </Link>
        </section>
        <ShareActions sticky />
      </>
    );
  }

  const currentStep = steps[stepIndex];
  const currentValue = answers[currentStep.key as keyof Answers];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <>
      {!storageReady && (
        <section className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-6 text-amber-900">
              Mode privat terdeteksi. Panjenengan tetap bisa lanjut, tapi ada
              kemungkinan suara tidak tersimpan dengan normal.
            </p>
          </div>
        </section>
      )}

      <section className="panel rounded-3xl p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-brand-700">
            Pertanyaan {stepIndex + 1} dari {steps.length}
          </span>
          <span className="text-sm text-stone-500">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track mt-3">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-5 rounded-2xl bg-brand-50/70 p-4">
          <h2 className="text-2xl font-bold leading-tight text-brand-900">
            {currentStep.title}
          </h2>
          <p className="mt-2 text-base leading-7 text-stone-700">
            {currentStep.helper}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {currentStep.options.map((option) => {
            const active = currentValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  selectAnswer(currentStep.key as keyof Answers, option.value)
                }
                className={`focus-ring min-h-[72px] w-full rounded-2xl border px-5 py-5 text-left transition ${
                  active
                    ? "border-brand-600 bg-brand-50 shadow-[inset_0_0_0_2px_rgba(31,93,63,0.3)]"
                    : "border-stone-300 bg-white hover:border-brand-300 hover:bg-stone-50/70"
                }`}
                aria-pressed={active}
              >
                <div className="text-base font-bold leading-6 text-stone-900">
                  {option.label}
                </div>
                {option.caption ? (
                  <div className="mt-1 text-sm leading-6 text-stone-600">
                    {option.caption}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={previousStep}
            disabled={stepIndex === 0}
            className="touch-button focus-ring gap-2 rounded-xl border border-stone-300 bg-white text-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Kembali
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={currentStep.required && !currentValue}
            className="touch-button focus-ring gap-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {stepIndex === steps.length - 1 ? "Kirim Suara" : "Lanjut"}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {submitError ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-6 text-amber-900">{submitError}</p>
          </div>
        ) : null}

        {!currentStep.required && (
          <button
            type="button"
            onClick={nextStep}
            className="focus-ring mt-4 text-sm font-semibold text-brand-700"
          >
            Lewati pertanyaan ini
          </button>
        )}
      </section>
    </>
  );
}
