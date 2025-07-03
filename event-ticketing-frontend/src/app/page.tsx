"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import EventSearch from "@/components/eventsearch";
import SignInCard from "@/components/signincard";
import SignUpCard from "@/components/signupcard";

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const signInRef = useRef<HTMLDivElement>(null);
  const signUpRef = useRef<HTMLDivElement>(null);

  const handleToggleSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleToggleSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  // Tutup Sign In saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (signInRef.current && !signInRef.current.contains(event.target as Node)) {
        setShowSignIn(false);
      }
    };
    if (showSignIn) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSignIn]);

  // Tutup Sign Up saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (signUpRef.current && !signUpRef.current.contains(event.target as Node)) {
        setShowSignUp(false);
      }
    };
    if (showSignUp) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSignUp]);

  return (
    <div>
      <Navbar onSignInClick={handleToggleSignIn} onSignUpClick={handleToggleSignUp} />

      <header className="relative bg-black text-white">
        <div className="absolute inset-0 bg-black opacity-60 z-0" />
        <img
          src="/header-bg.jpg"
          alt="Event background"
          className="w-full h-[500px] object-cover z-[-1] absolute"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-[500px] text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Events For All The Things You Love
          </h1>
          <EventSearch />
        </div>
      </header>

      <main className="p-8">
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {["All", "Today", "Tomorrow", "This Week", "Next Month"].map((label) => (
            <button
              key={label}
              className="bg-gray-200 px-4 py-2 rounded-full text-sm hover:bg-gray-300"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {["Jakarta", "Bandung", "Surabaya"].map((location) => (
            <div
              key={location}
              className="min-w-[250px] bg-white rounded-lg shadow p-4"
            >
              <div className="text-lg font-semibold mb-2">{location}</div>
              <div className="text-sm text-gray-600">Event Description</div>
            </div>
          ))}
        </div>
      </main>

      {/* Sign In Card */}
      {showSignIn && (
        <div ref={signInRef} className="fixed top-20 right-8 z-50">
          <SignInCard />
        </div>
      )}

      {/* Sign Up Card */}
      {showSignUp && (
        <div ref={signUpRef} className="fixed top-20 right-8 z-50">
          <SignUpCard />
        </div>
      )}
    </div>
  );
}
