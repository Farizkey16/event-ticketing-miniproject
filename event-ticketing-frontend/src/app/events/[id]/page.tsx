"use client";

import { useParams, useRouter } from "next/navigation";
import { events, type Event } from "@/data/events"; // ✅ Gunakan `type Event` bukan `type events`
import Image from "next/image";

export default function EventDetailPage() {
  const router = useRouter();
  const rawId = useParams()?.id;
  const eventId = Array.isArray(rawId) ? rawId[0] : rawId ?? "";

  const event: Event | undefined = events.find((e) => e.id === eventId);

  if (!event) {
    return <div className="p-6 text-red-600">Event tidak ditemukan.</div>;
  }

  const handleDaftar = () => {
    router.push(`/purchase/${event.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Gambar */}
      <Image
        src={event.image}
        alt={event.alt}
        width={1200}
        height={600}
        className="rounded-lg mb-6"
      />

      {/* Info Dasar */}
      <div className="text-lg space-y-2 mb-6">
        <p>📍 <strong>Location:</strong> {event.location}</p>
        <p>📅 <strong>Start Date:</strong> {event.date}</p>
        <p>⏰ <strong>Event Time:</strong> {event.time}</p>
        <p>🎟️ <strong>Ticket Price:</strong> {event.price}</p>
      </div>

      {/* Deskripsi */}
      <div className="mb-6 space-y-2 text-justify">
        {event.description.map((desc, i) => (
          <p key={i}>{desc}</p>
        ))}
      </div>

      {/* Highlight */}
      {event.highlights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Event Highlight </h2>
          <ul className="list-disc list-inside space-y-1">
            {event.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tombol Daftar */}
      <button
        onClick={handleDaftar}
        className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg"
      >
        Join Now
      </button>
    </div>
  );
}
