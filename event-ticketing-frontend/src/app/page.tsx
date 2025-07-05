"use client";

import { useState, useRef, useEffect } from "react";
import EventSearch from "@/components/eventsearch";
import SignInCard from "@/components/signincard";
import SignUpCard from "@/components/signupcard";
import Navbar from "@/components/navbar";
import Link from "next/link";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showSignIn && signInRef.current && !signInRef.current.contains(target)) {
        setShowSignIn(false);
      }
      if (showSignUp && signUpRef.current && !signUpRef.current.contains(target)) {
        setShowSignUp(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSignIn, showSignUp]);

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Jakarta Kreatif Fest (Card Ringkas) */}
          <Link href="/events/jakartakreatiffest">
            <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
              <img
                src="/image/jakartafest.jpg"
                alt="Jakarta Kreatif Fest"
                className="w-full h-50 object-cover rounded"
              />
              <div className="mt-2 text-sm font-semibold text-center">
                Jakarta Kreatif Fest 2025
              </div>
            </div>
          </Link>

          {/* Bandung */}
          <Link href="/events/bandungsoundwave">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
          <img
          src="/image/bandung.jpeg"
          alt="Bandung Soundwave"
          className="w-full h-50 object-cover rounded"
          />
          <div className="mt-2 text-sm font-semibold text-center">
          Bandung Soundwave 2025
          </div>
          </div>
          </Link>
          {/* Surabaya */}
          <Link href="/events/surabayamusic">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
          <img
          src="/image/surabaya.jpg"
          alt="Surabaya Music Parade"
          className="w-full h-50 object-cover rounded"
          />
          <div className="mt-2 text-sm font-semibold text-center">
          Surabaya Music Parade 2025
          </div>
          </div>
        </Link>
        {/* Yogyakarta */}
          <Link href="/events/budayayogya">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
          <img
          src="/image/yogya.jpeg"
          alt="Yogya World Heritage Festival"
          className="w-full h-50 object-cover rounded"
          />
          <div className="mt-2 text-sm font-semibold text-center">
          Yogya World Heritage Festival 2025
          </div>
          </div>
        </Link>
        {/* Jakarta */}
          <Link href="/events/jakartawarehouse">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
          <img
          src="/image/jakartaproject.jpg"
          alt="Surabaya Music Parade"
          className="w-full h-50 object-cover rounded"
          />
          <div className="mt-2 text-sm font-semibold text-center">
          Jakarta Warehouse Project 2025
          </div>
          </div>
          </Link>
          {/* Medan */}
          <Link href="/events/medanfunbike">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
          <img
          src="/image/indomaret2.jpg"
          alt="Surabaya Music Parade"
          className="w-full h-50 object-cover rounded"
          />
          <div className="mt-2 text-sm font-semibold text-center">
          Indomaret Funbike Medan 2025
          </div>
          </div>
          </Link>
          {/* Bandung Kuliner */}
              <Link href="/events/bandungkuliner">
              <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
                <img
                  src="/image/bandungkuliner.jpeg"
                  alt="Festival Kuliner Bandung"
                  className="w-full h-50 object-cover rounded"
                />
                <div className="mt-2 text-sm font-semibold text-center">
                  Festival Kuliner Bandung 2025
                </div>
              </div>
              </Link>
          {/* Bandung Fest */}
          <Link href="/events/bandungfest">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
            <img
              src="/image/bandungfest.jpg"
              alt="Collab Music Fest Bandung"
              className="w-full h-50 object-cover rounded"
            />
            <div className="mt-2 text-sm font-semibold text-center">
              Collab Music Fest 2025
              </div>
              </div>
            </Link>
          {/* Bali */}
          <Link href="/events/bali">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
            <img
              src="/image/bali.jpg"
              alt="Week Me Up Music Festival Bali"
              className="w-full h-50 object-cover rounded"
            />
            <div className="mt-2 text-sm font-semibold text-center">
              Week Me Up Music Festival 2025
            </div>
          </div>
          </Link>
          {/* Jakarta Fair */}
          <Link href="/events/jakartafair">
          <div className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-md transition p-2 cursor-pointer">
            <img
              src="/image/jakartafair.webp"
              alt="Jakarta Fair 2025"
              className="w-full h-50 object-cover rounded"
            />
            <div className="mt-2 text-sm font-semibold text-center">
              Jakarta Fair 2025
            </div>
            </div>
          </Link>
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
