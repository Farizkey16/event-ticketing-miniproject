"use client";

import { useState } from "react";
import { events } from "@/app/events/events";
import Link from "next/link";
import Navbar from "@/components/navbar";
import EventSearch from "@/components/eventsearch";
import SignInCard from "@/components/signincard";
import SignUpCard from "@/components/signupcard";

const filters = ["All", "Today", "Tomorrow", "This Week", "Next Month"];

function filterByTime(label: string, data: typeof events) {
  const today = new Date();
  return data.filter((event) => {
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
          date.getFullYear() === (today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear())
        );
      default:
        return true;
    }
  });
}

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const timeFilteredEvents = filterByTime(selectedFilter, events);

  const finalEvents = timeFilteredEvents.filter((event) =>
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

      {/* === Filter Buttons + Events === */}
      <main className="p-8">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
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

        {finalEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {finalEvents.map((event) => (
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
      </main>
    </div>
  );
}
