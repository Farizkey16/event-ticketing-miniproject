
import Head from 'next/head';
import Image from 'next/image';

export default function jakartawarehouse() {
  return (
    <>
      <Head>
        <title>Jakarta Warehouse Project</title>
        <meta
          name="description"
          content="Festival seni, musik, dan pertunjukan panggung terbesar di Jakarta –"
        />
      </Head>

      <main className="bg-gray-50 min-h-screen px-4 py-10 text-gray-800">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          {/* Gambar utama */}
          <Image
            src="/image/jakartaproject.jpg"
            alt="JAkarta Warehouse Project"
            width={1200}
            height={600}
            className="w-full h-auto rounded-xl mb-6 object-cover"
          />

          {/* Judul */}
          <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">
            Jakarta Warehouse Project 2025
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Jakarta Warehouse Project
          </p>

          {/* Detail Acara */}
          <ul className="text-base space-y-2 mb-6">
            <li><strong>Tanggal:</strong> Jumat–Minggu, 22–24 Agustus 2025</li>
            <li><strong>Waktu:</strong> 14.00 – 23.00 WIB</li>
            <li><strong>Lokasi:</strong> JIEXPO, Kemayoran</li>
            <li><strong>Harga Tiket:</strong> Mulai dari Rp75.000</li>
            
          </ul>

          {/* Deskripsi */}
          <p className="mb-6 text-justify leading-relaxed text-gray-700">
          Jakarta Warehouse Project, atau yang lebih dikenal dengan DWP, adalah salah satu festival musik 
          elektronik terbesar di Asia Tenggara yang setiap tahunnya menarik ribuan penonton dari seluruh dunia. 
          Diselenggarakan di pusat kota Jakarta, DWP menjadi magnet bagi para penikmat EDM, house, techno, dan 
          genre musik elektronik lainnya. Dengan tata panggung megah berstandar internasional, sistem pencahayaan
           dan audio canggih, serta lineup DJ kelas dunia seperti Martin Garrix, Zedd, Armin van Buuren, dan 
           DJ Snake, DWP bukan hanya festival—ia adalah pengalaman imersif yang mengguncang jiwa. Tidak hanya 
           sekadar konser, acara ini menjadi pertemuan budaya global, tempat komunitas musik elektronik merayakan
            kebebasan berekspresi, semangat muda, dan persatuan dalam musik. Kombinasi antara musik, visual, 
            serta atmosfer malam Jakarta yang semarak menjadikan DWP sebagai event yang tak terlupakan bagi 
            siapa pun yang mengalaminya. Dengan komitmen terhadap kualitas produksi dan inovasi setiap tahunnya, 
            Jakarta Warehouse Project telah menjelma menjadi simbol modernitas dan energi kreatif Indonesia 
            di mata dunia.
          </p>


          {/* Highlight Acara */}
          <h2 className="text-xl font-semibold mb-2 text-pink-700">🎤 Highlight Acara</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
            <li>Panggung Musik: Efek Rumah Kaca, Raisa, Barasuara, Diskoria, dan DJ internasional</li>
            <li>Panggung Teater: Pentas urban oleh Teater Koma dan Teater Garasi</li>
            <li>Art Zone: Live mural painting & pameran seni instalasi interaktif</li>
            <li>Street Food Night: Deretan food truck dan UMKM kreatif Jakarta</li>
            <li>Workshop: DJ Class, Beatbox, Urban Dance, Pop Art DIY</li>
          </ul>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
        Daftar Sekarang
      </button>
      </main>
    </>
  );
}
