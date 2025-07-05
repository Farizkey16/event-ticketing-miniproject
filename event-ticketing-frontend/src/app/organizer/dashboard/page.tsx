"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrganizerDashboard() {
  const router = useRouter();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, Organizer!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Events */}
        <div className="bg-white shadow rounded p-6 border">
          <h2 className="text-lg font-semibold mb-2">Total Events</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        {/* Tickets Sold */}
        <div className="bg-white shadow rounded p-6 border">
          <h2 className="text-lg font-semibold mb-2">Tickets Sold</h2>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        {/* Upcoming Events */}
        <div
          onClick={() => router.push("/organizer/upcoming")}
          className="bg-white shadow rounded p-6 border cursor-pointer hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>

        {/* Create New Event */}
        <Link
          href="/organizer/create-event"
          className="bg-white shadow rounded p-6 border cursor-pointer hover:bg-gray-50 transition block"
        >
          <h2 className="text-lg font-semibold mb-2">Create New Event</h2>
          <p className="text-3xl font-bold text-purple-600">+</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-gray-50 border rounded p-4 text-gray-600">
          <p>No recent activities yet.</p>
        </div>
      </div>
    </div>
  );
}
