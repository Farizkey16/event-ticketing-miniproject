'use client';
import EventTypeSelector from "@/components/eventtypeselector";
import { useState } from "react";
import React from "react";

export default function CreateEventPage() {
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [priceValue, setPriceValue] = useState('');

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <EventTypeSelector />

      <div className="mb-4">
        <label className="block font-medium mb-1">Event name *</label>
        <input
          type="text"
          placeholder="Enter event name"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select a venue</label>
        <input
          type="text"
          placeholder="Venue name or address"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select date & time</label>
        <div className="flex gap-2">
          <input type="date" className="border rounded px-3 py-2 w-full" />
          <input type="time" className="border rounded px-3 py-2 w-full" />
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Ticket Price</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="price"
              value="free"
              checked={priceType === 'free'}
              onChange={() => setPriceType('free')}
            />
            Free
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="price"
              value="paid"
              checked={priceType === 'paid'}
              onChange={() => setPriceType('paid')}
            />
            Paid
          </label>
        </div>

        {priceType === 'paid' && (
          <div className="mt-2">
            <input
              type="number"
              min={0}
              placeholder="Enter price (Rp)"
              className="w-full border rounded px-3 py-2"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
            />
          </div>
        )}
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
    </div>
  );
}
