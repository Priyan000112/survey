export default function TentangPage() {
  return (
    <main className="page-shell space-y-5">
      <section className="rounded-3xl bg-white/60 p-1 backdrop-blur-sm">
        <div className="rounded-[1.3rem] border border-white/80 bg-white/70 p-5">
          <span className="eyebrow">Transparansi</span>
          <h1 className="mt-3 text-[2rem] font-bold leading-tight text-brand-900 sm:text-3xl">
            Tentang Survei
          </h1>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <div>
          <h2 className="section-title">Tujuan</h2>
          <p className="mt-2 text-base leading-7 text-stone-700">
            Survei ini dibuat buat seru-seruan sambil melihat arah obrolan
            warga Desa Maribaya. Survei ini tidak mewakili panitia Pilkades,
            pemerintah desa, atau tokoh mana pun.
          </p>
        </div>
        <div>
          <h2 className="section-title">Privasi</h2>
          <p className="mt-2 text-base leading-7 text-stone-700">
            Survei ini tidak meminta NIK, nomor HP, alamat detail, atau data
            pribadi sensitif. Jawaban yang masuk hanya dipakai untuk melihat
            gambaran hasil bersama.
          </p>
        </div>
        <div>
          <h2 className="section-title">Batasan sistem</h2>
          <p className="mt-2 text-base leading-7 text-stone-700">
            Sistem sudah mencoba membatasi pengisian ganda, tapi ini tetap
            bukan sistem verifikasi resmi. Jadi hasilnya paling pas dibaca
            sebagai gambaran partisipasi online, bukan angka final.
          </p>
        </div>
        <div>
          <h2 className="section-title">Keterbatasan hasil</h2>
          <p className="mt-2 text-base leading-7 text-stone-700">
            Hasil yang tampil akan berubah mengikuti suara yang masuk. Karena
            ini survei santai berbasis online, hasilnya bisa berubah sewaktu-
            waktu dan tidak dimaksudkan sebagai patokan resmi.
          </p>
        </div>
      </section>
    </main>
  );
}
