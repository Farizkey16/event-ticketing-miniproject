"use client";
import { useState, useEffect, useRef } from "react";

export default function HelpDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent text-sm font-medium text-gray-700 hover:text-blue-600 transition"
      >
        Help ▾
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <a
            href="/help-center"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            📚 Help Center
          </a>
          <a
            href="/contact"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            ✉️ Contact Us
          </a>
        </div>
      )}
    </div>
  );
}
