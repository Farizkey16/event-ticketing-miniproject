
"use client";
import Image from "next/image";

export default function EventDetail({ event }: { event: any }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="text-gray-500">{event.date} • {event.time}</p>
      <p className="text-gray-600 mb-4">{event.venue} - {event.address}</p>

      <Image
        src={event.image}
        alt={event.name}
        width={800}
        height={400}
        className="rounded-xl my-6"
      />

      <p className="mb-4">{event.description}</p>

      <h2 className="font-semibold text-xl mt-6 mb-2">Lineup</h2>
      <ul className="list-disc pl-5">
        {event.lineup.map((a: string) => (
          <li key={a}>{a}</li>
        ))}
      </ul>

      <h2 className="font-semibold text-xl mt-6 mb-2">Harga Tiket</h2>
      <ul>
        {event.tickets.map((t: any) => (
          <li key={t.type}>
            {t.type}: Rp{t.price.toLocaleString()}
          </li>
        ))}
      </ul>

      <a
        href={event.registration_url}
        target="_blank"
        className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Daftar Sekarang
      </a>
    </div>
  );
}
