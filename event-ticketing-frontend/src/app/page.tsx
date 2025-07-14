"use client";

import { useState, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { events } from "@/data/events";
import Link from "next/link";
import Navbar from "@/components/navbar";
import EventSearch from "@/components/eventsearch";
import SignInCard from "@/components/signincard";
import SignUpCard from "@/components/signupcard";

// Shadcn Carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const filters = ["All", "Today", "Tomorrow", "This Week", "Next Month"];

// Promo dari data events langsung
const promoIds = ["week-me-up-bali", "bandung-soundwave", "collab-fest-bandung"];
const promoEvents = events.filter((event) => promoIds.includes(event.id));

const dummyReviews = [
  {
    id: 1,
    name: "Andi Setiawan",
    rating: 5,
    comment: "Acara sangat seru dan tertata dengan baik. Saya akan ikut lagi tahun depan!",
    date: "2025-06-21",
    event: "Surabaya Nusantara Run 2025",
  },
  {
    id: 2,
    name: "Siti Rahma",
    rating: 4,
    comment: "Bagus, tapi bagian registrasi sedikit membingungkan. Overall memuaskan.",
    date: "2025-06-22",
    event: "Yogyakarta Couple Run",
  },
  {
    id: 3,
    name: "Budi Prasetyo",
    rating: 3,
    comment: "Venue kurang luas, tapi performa band pengisi acara keren banget!",
    date: "2025-06-18",
    event: "Jakarta Marathon Festival",
  },
  {
    id: 4,
    name: "Dewi Anggraini",
    rating: 5,
    comment: "Sangat menyenangkan! Panitia sangat ramah dan well prepared.",
    date: "2025-07-01",
    event: "Bali Beach Color Run",
  },
  {
    id: 5,
    name: "Rizky Kurniawan",
    rating: 4,
    comment: "Saya suka konsepnya! Akan lebih baik jika waktu mulai lebih tepat.",
    date: "2025-06-25",
    event: "Bandung Eco Ride",
  },
];

function filterByTime(label: string, data: typeof events) {
  const today = new Date();
  return data.filter((event: { date: string | number | Date }) => {
    const date = new Date(event.date);
    switch (label) {
      case "Today":
        return date.toDateString() === today.toDateString();
      case "Tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
      case "This Week":
        const week = new Date(today);
        week.setDate(today.getDate() + 7);
        return date >= today && date <= week;
      case "Next Month":
        return (
          date.getMonth() === (today.getMonth() + 1) % 12 &&
          date.getFullYear() ===
            (today.getMonth() === 11
              ? today.getFullYear() + 1
              : today.getFullYear())
        );
      default:
        return true;
    }
  });
}

function ReviewCard({ review }: { review: typeof dummyReviews[0] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between mb-1">
        <h3 className="font-semibold">{review.name}</h3>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      <p className="text-sm text-gray-600 italic mb-1">Acara: {review.event}</p>
      <p className="mb-2">{review.comment}</p>
      <div className="text-yellow-500">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const timeFilteredEvents = filterByTime(selectedFilter, events);

  const finalEvents = timeFilteredEvents.filter((event: { name: string }) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* === Navbar === */}
      <Navbar
        onSignInClick={() => {
          setShowSignIn(true);
          setShowSignUp(false);
        }}
        onSignUpClick={() => {
          setShowSignUp(true);
          setShowSignIn(false);
        }}
      />

      {/* === Modal Sign In & Sign Up === */}
      {showSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SignInCard onClose={() => setShowSignIn(false)} />
        </div>
      )}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SignUpCard onClose={() => setShowSignUp(false)} />
        </div>
      )}

      {/* === Hero Section === */}
      <header
        className="relative text-white bg-cover bg-center h-[500px] flex items-center justify-center px-4"
        style={{ backgroundImage: "url('/image/bgevents.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <div className="relative z-10 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Events For All The Things You Love
          </h1>
          <EventSearch onSearch={setSearchQuery} />
        </div>
      </header>

      <main className="p-8">
        {/* === Promo Carousel Section === */}
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-yellow-700 mb-8">
            🎁 Spesial Promo Just For You
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {promoEvents.map((event) => (
                <CarouselItem key={event.id} className="px-2">
                  <div className="bg-white rounded-xl shadow overflow-hidden border border-yellow-300">
                    <img
                      src={event.image}
                      alt={event.alt}
                      className="w-full h-56 object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold mb-2 text-yellow-800">
                        {event.name}
                      </h3>
                      <p className="text-shadow-black mb-4">
                        {event.promoText || "Attractive promo for this event, DONT MISS IT!"}
                       
                      </p>
                      <Link
                        href={`/events/${event.id}`}
                        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                      >
                        Watch Details
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* === Filter Buttons === */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center mt-16">
          {filters.map((label) => (
            <button
              key={label}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer ${
                selectedFilter === label
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* === Events Grid === */}
        {finalEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {finalEvents.map((event: {
              id: Key | null | undefined;
              image: string;
              alt: string;
              name: ReactNode;
            }) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
                  <img
                    src={event.image}
                    alt={event.alt}
                    className="w-full h-48 object-cover rounded"
                  />
                  <div className="mt-2 text-sm font-semibold text-center">
                    {event.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">No events found.</p>
        )}

        {/* === Reviews Section === */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What They Says?</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
            {dummyReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
