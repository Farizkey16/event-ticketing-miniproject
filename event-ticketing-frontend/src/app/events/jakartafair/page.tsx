export default function JakartaFair2025() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Jakarta Fair 2025</h1>
      <img
        src="/image/jakartafair.webp"
        alt="Jakarta Fair 2025"
        className="rounded-xl mb-6 w-full object-cover"
      />

      <p className="text-lg mb-4">
        <strong>Jakarta Fair Kemayoran 2025</strong> kembali hadir sebagai pameran dan hiburan terbesar di Indonesia! 
        Acara tahunan ini akan diselenggarakan selama lebih dari satu bulan, menyuguhkan pameran multiproduk, konser musik, kuliner, wahana permainan, dan berbagai pertunjukan budaya.
      </p>

      <p className="mb-2">📍 Lokasi: JIEXPO Kemayoran, Jakarta</p>
      <p className="mb-2">📅 Tanggal: 12 Juni – 14 Juli 2025</p>
      <p className="mb-2">⏰ Jam Operasional: 15.30 – 22.00 WIB (weekday), 10.00 – 23.00 WIB (weekend)</p>
      <p className="mb-4">🎟️ Tiket Masuk: Mulai dari Rp40.000</p>

      <p className="text-lg mb-4">
        Tahun ini, Jakarta Fair menghadirkan lebih dari 2.000 tenant dari berbagai sektor, mulai dari otomotif, elektronik, fashion, UMKM, hingga kuliner khas Nusantara. 
        Jangan lewatkan konser musik dari musisi papan atas seperti <em>NOAH</em>, <em>Slank</em>, <em>Tiara Andini</em>, <em>The Changcuters</em>, dan masih banyak lagi setiap malam!
      </p>

      <p className="text-lg mb-4">
        Selain belanja dan konser, pengunjung juga dapat menikmati wahana permainan keluarga, parade budaya, pertunjukan kembang api, dan Jakarta Fair Carnaval. 
        Acara ini cocok untuk semua kalangan – dari keluarga, pasangan muda, hingga anak-anak muda yang ingin menikmati suasana festival yang meriah.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Highlight Jakarta Fair 2025</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Konser musik harian (NOAH, Slank, Tiara Andini, dll.)</li>
        <li>Wahana bermain & zona anak</li>
        <li>Stand kuliner dari seluruh Indonesia</li>
        <li>Jakarta Fair Parade & Fireworks Night</li>
        <li>Pameran produk multiproduk & UMKM</li>
      </ul>

      <div className="mt-6 flex justify-start">
        <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
          Daftar Sekarang
        </button>
      </div>
    </main>
  );
}
