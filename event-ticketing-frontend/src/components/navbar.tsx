"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export default function Navbar({ onSignInClick, onSignUpClick }: NavbarProps) {
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpDropdownRef.current &&
        !helpDropdownRef.current.contains(event.target as Node)
      ) {
        setHelpDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const eventCategories = [
    "Conference", "Seminar", "Workshop", "Webinar",
    "Meetup", "Panel", "Talk", "Training", "Competition",
    "Festival", "Concert", "Performance", "Exhibition",
    "Sports", "Fundraiser", "Networking", "Ceremony",
  ];

  return (
    <nav className="flex justify-between items-center px-6 py-2 h-20 w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      {/* LOGO */}
      <div className="flex items-center h-full">
        <Link href="/" className="flex items-center h-full">
          <img
            src="/image/gambar.png"
            alt="Local Event Logo"
            className="h-full w-auto object-contain"
          />
        </Link>
      </div>

      {/* NAV MENU TENGAH */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/features" className="hover:text-blue-600">
          Features
        </Link>

        {/* Event Dropdown */}
        <div className="relative group">
          <button className="hover:text-blue-600 transition">Event ▾</button>
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50
                invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
            {eventCategories.map((category) => (
              <Link
                key={category}
                href={`/events/${category.toLowerCase()}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Dropdown */}
        <div className="relative group">
          <button className="hover:text-blue-600 transition">Help ▾</button>
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50
                invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
            <Link
              href="/help-center"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Help Center
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* TOMBOL KANAN */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/partner" className="text-gray-700 hover:text-blue-600 transition">
          Be a Partner
        </Link>
        <button onClick={onSignInClick} className="text-gray-700 hover:text-blue-600 transition">
          Your Orders
        </button>
        <button
          onClick={onSignInClick}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Login
        </button>
        <button
          onClick={onSignUpClick}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Register
        </button>
      </div>
    </nav>
  );
}
