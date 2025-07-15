"use client";

import { useState } from "react";
import { Button } from "./ui/button";

type EventDetail = {
  id: number;
  name: string;
  description?: string;
  price: number;
  start_date: string; // ISO string format
  end_date: string; // ISO string format
  seat_capacity?: number;
  event_type: "FESTIVAL" | "CONCERT" | "EXHIBITION" | "SPORTS";
  created_at: string;
  expires_at?: string;
  thumbnail_img?: string;
  slug: string;
};

type EditEventFormProps = {
  event: EventDetail;
  onSuccess: () => void;
};

export function EditEventForm({ event, onSuccess }: EditEventFormProps) {
  const [form, setForm] = useState(event);

  const handleSubmit = async () => {
    const res = await fetch(
      `http://localhost:3077/api/event/edit/${event.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      }
    );
    console.log(event.id)
    if (res.ok) {
      onSuccess();
      alert("Update successful!")}
    else {
      console.log(event.id)
      alert("Update failed");}
    
  };

  return (
    <div className="space-y-4">
      <label htmlFor="eventname" className="text-sm font-bold">
        Event Name
      </label>
      <input
        className="w-full border px-3 py-2 rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Event Name"
      />

      <label htmlFor="eventname" className="text-sm font-bold">
        Description
      </label>
      <textarea
        className="w-full border px-3 py-2 rounded"
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
      />

      <label htmlFor="eventname" className="text-sm font-bold">
        Price
      </label>
      <input
        type="number"
        className="w-full border px-3 py-2 rounded"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
        placeholder="Price (IDR)"
      />
      <label htmlFor="eventname" className="text-sm font-bold">
        Start Date
      </label>
      <input
        type="datetime-local"
        className="w-full border px-3 py-2 rounded"
        value={form.start_date}
        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        placeholder="Start Date"
      />

      <label htmlFor="eventname" className="text-sm font-bold">
        End Date
      </label>
      <input
        type="datetime-local"
        className="w-full border px-3 py-2 rounded"
        value={form.end_date}
        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        placeholder="End Date"
      />

      <label htmlFor="eventname" className="text-sm font-bold">
        Seat Capacity
      </label>
      <input
        type="number"
        className="w-full border px-3 py-2 rounded"
        value={form.seat_capacity || ""}
        onChange={(e) =>
          setForm({ ...form, seat_capacity: parseInt(e.target.value) })
        }
        placeholder="Seat Capacity"
      />

      <label htmlFor="eventname" className="text-sm font-bold">
        Event Type
      </label>
      <select
        className="w-full border px-3 py-2 rounded"
        value={form.event_type}
        onChange={(e) =>
          setForm({
            ...form,
            event_type: e.target.value as EventDetail["event_type"],
          })
        }
      >
        <option value="FESTIVAL">FESTIVAL</option>
        <option value="CONCERT">CONCERT</option>
        <option value="EXHIBITION">EXHIBITION</option>
        <option value="SPORTS">SPORTS</option>
      </select>

              <label htmlFor="eventname" className="text-sm font-bold">
        Expires At
      </label>
      <input
        type="datetime-local"
        className="w-full border px-3 py-2 rounded"
        value={form.expires_at || ""}
        onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
        placeholder="Expires At"
      />

      <div className="space-y-2">
        <label className="block text-sm font-bold">Thumbnail Image</label>
        {/* {form.thumbnail_img && (
        //   <img
        //     src={imageFile ? URL.createObjectURL(imageFile) : form.thumbnail_img}
        //     alt="Thumbnail"
        //     className="w-full h-32 object-cover rounded"
        //   />
        )} */}
        <input
          type="file"
          accept="image/*"
          //   onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleSubmit}>Save Changes</Button>
    </div>
  );
}
