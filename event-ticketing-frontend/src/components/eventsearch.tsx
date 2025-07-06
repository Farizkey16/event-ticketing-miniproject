"use client";

import { useState } from "react";

export default function EventSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
      >
        Find Events
      </button>
    </div>
  );
}
