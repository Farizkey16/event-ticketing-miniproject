import { listevents } from "@/app/dashboard/events/listevents";
import { notFound } from "next/navigation";

type Event = typeof listevents[number];

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = listevents.find((e: Event) => e.slug === params.slug);

  if (!event) return notFound();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPrice = (price: number) =>
    price === 0 ? "Gratis" : `Mulai Rp${price.toLocaleString("id-ID")}`;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

      {event.thumbnail_img && (
        <img
          src={event.thumbnail_img}
          alt={event.slug}
          className="rounded-xl mb-6 w-full object-cover"
        />
      )}

      <p className="mb-2">Tanggal: {formatDate(event.start_date)}</p>
      <p className="mb-2">Waktu: {formatTime(event.start_date)}</p>
      <p className="mb-2">Kuota: {event.seat_capacity ?? "Tidak diketahui"}</p>
      <p className="mb-4">Harga Tiket: {formatPrice(event.price)}</p>

      {event.description && (
        <p className="text-lg mb-4">{event.description}</p>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Detail Acara</h2>
      <ul className="list-disc list-inside mb-6 text-gray-700">
        <li>Jenis: {event.event_type}</li>
        <li>Slug: {event.slug}</li>
        <li>Berakhir pada: {event.expires_at ? formatDate(event.expires_at) : "N/A"}</li>
      </ul>

      <div className="mt-6 flex justify-start">
        <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          Daftar Sekarang
        </button>
      </div>
    </main>
  );
}
