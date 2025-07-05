
import Head from 'next/head';
import Image from 'next/image';

export default function FestivalBudayaJogjaPage() {
  return (
    <>
      <Head>
        <title>Yogya World Heritage Festival 2025</title>
        <meta name="description" content="Informasi lengkap tentang Festival Budaya Jogja 2025 di Yogyakarta." />
      </Head>
      <main className="min-h-screen bg-gray-50 text-gray-800 px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600">
            Yogya World Heritage Festival 2025
          </h1>
          <ul className="text-base space-y-2 mb-6">
            <li><strong>Tanggal:</strong> Sabtu, 12 Juli 2025</li>
            <li><strong>Waktu:</strong> 10.00 – 22.00 WIB</li>
            <li><strong>Lokasi:</strong> Alun-Alun Kidul, Yogyakarta</li>
            <li><strong>Harga Tiket:</strong> Gratis</li>
            <li><strong>Kontak:</strong> info@budayajogja.id | +62 812 3456 7890</li>
          </ul>
          <Image
            src="/image/yogya.jpeg"
            alt="Yogya World Heritage Festival"
            width={1200}
            height={600}
            className="w-full h-auto rounded-2xl mb-6 object-cover"
            />

          <h2 className="text-xl font-semibold mb-2">Deskripsi Acara</h2>
          <p className="mb-6 text-justify leading-relaxed text-gray-700">
            Yogya World Heritage Festival adalah sebuah inisiatif budaya berskala internasional yang diselenggarakan untuk
            merayakan dan mengangkat kekayaan warisan budaya Yogyakarta ke panggung dunia. Festival ini menjadi ajang
            pertemuan lintas budaya, tempat di mana tradisi lokal bertemu dengan apresiasi global, dalam suasana yang penuh
            semangat, edukatif, dan inspiratif. Dengan latar belakang kota yang memiliki warisan budaya tak benda dan situs
            sejarah yang diakui oleh UNESCO, seperti Candi Prambanan dan Kraton Yogyakarta, acara ini dirancang untuk
            menampilkan kolaborasi seni, forum diskusi budaya, pertunjukan tari lintas negara, serta pameran kerajinan tangan
            dari berbagai penjuru dunia. Pengunjung dapat menikmati perjalanan budaya melalui instalasi seni interaktif,
            panggung pertunjukan terbuka, kuliner tradisional, dan lokakarya kreatif yang menghadirkan seniman, budayawan,
            dan pelaku kreatif dari berbagai latar belakang. Tidak hanya sebagai hiburan, festival ini juga menjadi media
            refleksi atas pentingnya pelestarian budaya di tengah tantangan modernisasi. Yogya World Heritage Festival adalah
            sebuah undangan terbuka untuk merayakan keberagaman, memperkuat identitas lokal, dan membangun jejaring budaya
            global yang berkelanjutan, semua berpijak dari jantung budaya Jawa: Yogyakarta.
            </p>


          <h2 className="text-xl font-semibold mb-2">Highlight Acara</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tari Ramayana kolosal (18.00 WIB)</li>
            <li>Workshop Batik Tulis (13.00 WIB)</li>
            <li>Live music keroncong & jazz etnik (20.00 WIB)</li>
            <li>Stand kuliner Gudeg, Bakpia, dan Wedang Uwuh</li>
          </ul>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
        Daftar Sekarang
      </button>
      </main>
    </>
  );
}
