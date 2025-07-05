"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
  user?: { name: string; role: string }; // optional
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export default function Navbar({ user, onSignInClick, onSignUpClick }: NavbarProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
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

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white shadow relative">
      <div className="text-xl font-bold text-blue-700">
        <Link href="/">LOCAL EVENT.COM</Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/features">Features</Link>
        <Link href="/industry">Industry</Link>
        <Link href="/explore">Explore Events</Link>
        <Link href="/pricing">Pricing</Link>

        {/* Help Dropdown */}
        <div className="relative" ref={helpDropdownRef}>
          <button
            onClick={() => setHelpDropdownOpen((prev) => !prev)}
            className="hover:text-blue-600 transition"
          >
            Help ▾
          </button>
          {helpDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
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
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            {user ? `Hello, ${user.name}` : "Greetings!"}
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
              {user ? (
                <>
                  <Link href="/buyer/tickets" className="block px-4 py-2 hover:bg-gray-100">My Tickets</Link>
                  <Link href="/buyer/favorites" className="block px-4 py-2 hover:bg-gray-100">Favorites</Link>
                  <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <button
                    onClick={() => {
                      console.log("logout clicked");
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onSignInClick();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onSignUpClick();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Organizer CTA */}
        <Link
          href="/organizer/signup"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Join Us
        </Link>
      </div>
    </nav>
  );
}
