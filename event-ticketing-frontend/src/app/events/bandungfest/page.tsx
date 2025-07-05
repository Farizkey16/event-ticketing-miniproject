export default function CollabMusicFest() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Collab Music Fest 2025</h1>
      <img
        src="/image/bandungfest.jpg"
        alt="Collab Music Fest Bandung"
        className="rounded-xl mb-6 w-full object-cover"
      />

      <p className="text-lg mb-4">
        Siap-siap untuk malam penuh energi dan kolaborasi kreatif di <strong>Collab Music Fest 2025</strong>! 
        Diselenggarakan di <em>Bandung Trade Mall</em>, festival ini adalah panggung kolaboratif lintas genre antara musisi, DJ, dan performer visual.
      </p>

      <p className="mb-2">📍 Lokasi: Bandung Trade Mall (BTM)</p>
      <p className="mb-2">📅 Tanggal: 30 Agustus 2025</p>
      <p className="mb-2">⏰ Waktu: 17.00 – 23.30 WIB</p>
      <p className="mb-4">🎟️ Tiket: Presale mulai Rp100.000</p>

      <p className="text-lg mb-4">
        Acara ini menghadirkan line-up artis dari berbagai aliran seperti hip-hop, pop, R&B, hingga electronic dance music. 
        Pengunjung akan dimanjakan oleh performa kolaborasi unik antara rapper lokal dan DJ nasional, pertunjukan live mural digital, 
        dan beatbox battle yang seru.
      </p>

      <p className="text-lg mb-4">
        Dengan tata cahaya futuristik dan layar LED raksasa, atmosfer BTM akan disulap menjadi rave spot paling keren tahun ini. 
        Jangan lewatkan juga food court malam dan pop-up booth komunitas kreatif yang ikut meramaikan festival ini.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Highlight Acara</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Collab stage: RAN x DJ Dipha Barus</li>
        <li>Beatbox Battle Open Mic (18.30 WIB)</li>
        <li>Live digital mural & mapping visual</li>
        <li>Food trucks & streetwear pop-up market</li>
        <li>Guest performance: Weird Genius</li>
      </ul>

      <div className="mt-6 flex justify-start">
        <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800">
          Daftar Sekarang
        </button>
      </div>
    </main>
  );
}
