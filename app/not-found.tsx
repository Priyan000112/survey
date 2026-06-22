import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="panel space-y-4 p-6 text-center">
        <span className="text-sm font-medium text-brand-700">404</span>
        <h1 className="text-3xl font-bold text-brand-900">Halaman tidak ditemukan</h1>
        <p className="text-base leading-7 text-stone-700">
          Tautan mungkin salah atau halaman sudah dipindah.
        </p>
        <Link
          href="/"
          className="touch-button focus-ring bg-brand-600 text-white hover:bg-brand-700"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}
