'use client';
import EventTypeSelector from "@/components/eventtypeselector";
import PlatformDropdown from "@/components/platformdropdown";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function CreateOnlineEventPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Online Event</h1>

      <EventTypeSelector />

      <div className="mb-4">
        <label className="block font-medium mb-1">Event name *</label>
        <input
          type="text"
          placeholder="Enter event name"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <PlatformDropdown />

      <div className="mb-4">
        <label className="block font-medium mb-1">Online meeting link</label>
        <input
          type="text"
          placeholder="e.g. Zoom/Meet link"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Date & time</label>
        <div className="flex gap-2">
          <input type="date" className="border rounded px-3 py-2" />
          <input type="time" className="border rounded px-3 py-2" />
        </div>
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
    </div>
  );
}
