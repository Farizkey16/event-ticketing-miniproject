import { events } from "../events"
import { notFound } from "next/navigation";

type Event = typeof events[number];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = events.find((e: Event) => e.id === params.id);

  if (!event) return notFound();

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <img src={event.image} alt={event.alt} className="rounded-xl mb-6 w-full object-cover" />
      <p className="mb-2">📍 Lokasi: {event.location}</p>
      <p className="mb-2">📅 Tanggal: {event.date}</p>
      <p className="mb-2">⏰ Waktu: {event.time}</p>
      <p className="mb-4">🎟️ Tiket: {event.price}</p>

      {event.description.map((para: string, idx: number) => (
        <p key={idx} className="text-lg mb-4">{para}</p>
      ))}

      <h2 className="text-xl font-semibold mt-6 mb-2">Highlight Acara</h2>
      <ul className="list-disc list-inside mb-6">
        {event.highlights.map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <div className="mt-6 flex justify-start">
        <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          Daftar Sekarang
        </button>
      </div>
    </main>
  );
}
