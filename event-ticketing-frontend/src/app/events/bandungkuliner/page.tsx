export default function FestivalKulinerBandung() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Festival Kuliner Bandung 2025</h1>
      <img
        src="/image/bandungkuliner.jpeg"
        alt="Festival Kuliner Bandung"
        className="rounded-xl mb-6 w-full object-cover"
      />

      <p className="text-lg mb-4">
        Nikmati sensasi rasa khas Nusantara di <strong>Festival Kuliner Bandung 2025</strong>! Diselenggarakan di
        <em> Sumarecon Mall Bandung</em>, acara ini menghadirkan lebih dari 100 tenant kuliner dari seluruh Indonesia.
        Rasakan perjalanan rasa dari Sabang sampai Merauke dalam satu tempat yang penuh cita rasa dan kebahagiaan.
      </p>

      <p className="mb-2">📍 Lokasi: Sumarecon Mall Bandung</p>
      <p className="mb-2">📅 Tanggal: 20–24 Agustus 2025</p>
      <p className="mb-2">⏰ Waktu: 10.00 – 22.00 WIB</p>
      <p className="mb-4">🎟️ Tiket Masuk: Gratis</p>

      <p className="text-lg mb-4">
        Festival ini menjadi ajang tahunan yang dinanti oleh para pecinta kuliner. Tidak hanya menyajikan makanan lezat, 
        tetapi juga menghadirkan demo masak dari chef ternama, lomba makan pedas, pertunjukan musik akustik, hingga bazar produk UMKM lokal.
      </p>

      <p className="text-lg mb-4">
        Area outdoor mall akan disulap menjadi taman kuliner tematik yang nyaman dan instagramable, cocok untuk keluarga, 
        pasangan, dan komunitas kuliner. Jangan lewatkan kesempatan langka mencicipi makanan legendaris seperti sate maranggi, 
        pempek Palembang, rendang Padang, dan kuliner kekinian favorit anak muda!
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Highlight Acara</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Lomba Makan Seblak Level 5🔥 (Sabtu, 14.00 WIB)</li>
        <li>Live Cooking Show bersama Chef Juna (Minggu, 16.00 WIB)</li>
        <li>Stand kuliner legendaris Jawa Barat & nusantara</li>
        <li>Pentas musik akustik & band indie Bandung</li>
        <li>Photobooth tematik & zona anak</li>
      </ul>

      <div className="mt-6 flex justify-start">
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Daftar Sekarang
        </button>
      </div>
    </main>
  );
}
