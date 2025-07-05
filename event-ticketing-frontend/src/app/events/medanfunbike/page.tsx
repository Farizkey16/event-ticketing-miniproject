
import Head from 'next/head';
import Image from 'next/image';

export default function IndomaretFunbikeMedanPage() {
  return (
    <>
      <Head>
        <title>Indomaret Funbike Medan 2025</title>
        <meta
          name="description"
          content="Acara bersepeda keluarga penuh keceriaan di Medan bersama Indomaret. Dapatkan jersey, snack, dan hadiah menarik!"
        />
      </Head>

      <main className="bg-gray-50 min-h-screen px-4 py-10 text-gray-800">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          {/* Gambar utama */}
          <Image
            src="/image/indomaret2.jpg"
            alt="Indomaret Funbike Medan"
            width={1200}
            height={600}
            className="w-full h-auto rounded-xl mb-6 object-cover"
          />

          {/* Judul */}
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            Indomaret Funbike Medan 2025
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Minggu, 21 September 2025 • Lapangan Merdeka, Medan
          </p>

          {/* Detail Acara */}
          <ul className="text-base space-y-2 mb-6">
            <li><strong>📅 Tanggal:</strong> Minggu, 21 September 2025</li>
            <li><strong>🕕 Waktu:</strong> 06.00 – 11.00 WIB</li>
            <li><strong>📍 Lokasi:</strong> Lapangan Merdeka, Medan</li>
            <li><strong>🚴‍♀️ Jarak Tempuh:</strong> ±15 KM</li>
            <li><strong>🎟️ Harga Tiket:</strong> Rp50.000 (termasuk jersey, snack, dan kupon undian)</li>
            <li><strong>📞 Kontak:</strong> info@funbikeindomaret.id | +62 813 9876 4321</li>
          </ul>

          {/* Deskripsi */}
          <p className="text-justify leading-relaxed text-gray-700 mb-6">
            Indomaret Funbike Medan 2025 adalah sebuah ajang olahraga santai yang menggabungkan semangat hidup sehat,
            kebersamaan komunitas, dan keseruan bersepeda bersama di jantung kota Medan. Diperuntukkan bagi semua
            kalangan—dari pemula hingga penggemar sepeda aktif—acara ini menempuh rute sejauh ±15 kilometer melewati
            ikon-ikon kota seperti Jalan Balai Kota, Kesawan, hingga kawasan heritage Kota Lama. Dengan tiket seharga
            Rp50.000, peserta tidak hanya mendapatkan jersey eksklusif dan snack, tetapi juga berkesempatan memenangkan
            hadiah menarik dari undian doorprize, mulai dari sepeda lipat hingga voucher belanja.
          </p>

          <p className="text-justify leading-relaxed text-gray-700 mb-6">
            Selain bersepeda, pengunjung juga dapat menikmati hiburan musik, bazar makanan, dan aktivitas interaktif di
            area finish. Indomaret Funbike bukan hanya soal kayuh sepeda—ia adalah perayaan gaya hidup aktif, ramah
            lingkungan, dan penuh keceriaan yang bisa dinikmati bersama keluarga dan sahabat.
          </p>

          {/* Highlight */}
          <h2 className="text-xl font-semibold mb-2 text-blue-700">🎉 Highlight Acara</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Rute ±15 KM melewati pusat kota Medan</li>
            <li>Jersey eksklusif untuk semua peserta</li>
            <li>Doorprize utama: Sepeda lipat, kulkas, dan voucher belanja</li>
            <li>Live music & zona kuliner lokal</li>
            <li>Games dan hiburan keluarga di area finish</li>
          </ul>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Daftar Sekarang
        </button>
        </main>
    </>
  );
}
