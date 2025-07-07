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

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white shadow relative">
      <div className="text-xl font-bold text-blue-700">
        <Link href="/">LOCAL EVENT.COM</Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/features" className="hover:text-blue-600">Features</Link>
        <Link href="/industry" className="hover:text-blue-600">Industry</Link>
        <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>

        <div className="relative" ref={helpDropdownRef}>
          <button
            onClick={() => setHelpDropdownOpen((prev) => !prev)}
            className="hover:text-blue-600 transition"
          >
            Help ▾
          </button>
          {helpDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <Link href="/help-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help Center</Link>
              <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact Us</Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/partner" className="text-sm text-gray-700 hover:text-blue-600 transition">
          Be a Partner
        </Link>

        <button onClick={onSignInClick} className="text-sm text-gray-700 hover:text-blue-600 transition">
          Your Orders
        </button>

        <button onClick={onSignInClick} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
          Login
        </button>

        <button onClick={onSignUpClick} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
          Register
        </button>
      </div>
    </nav>
  );
}
