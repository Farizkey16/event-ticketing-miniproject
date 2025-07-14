"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { format } from "date-fns";

type EventDetail = {
  id: number;
  name: string;
  description?: string;
  price: number;
  start_date: string;
  end_date: string;
  seat_capacity?: number;
  event_type: "FESTIVAL" | "CONCERT" | "EXHIBITION" | "SPORTS";
  created_at: string;
  expires_at?: string;
  thumbnail_img?: string;
  slug: string;
};

export function CreateEventDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<EventDetail, "id" | "created_at">>({
    name: "",
    description: "",
    price: 0,
    start_date: "",
    end_date: "",
    seat_capacity: 0,
    event_type: "FESTIVAL",
    expires_at: "",
    thumbnail_img: "",
    slug: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3077/api/event/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });

    if (res.ok) {
      setOpen(false);
      onSuccess();
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">+ QUICK CREATE</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Create Event</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Event Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Price (IDR)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
        />

        <Input
          type="datetime-local"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Seat Capacity"
          value={form.seat_capacity}
          onChange={(e) =>
            setForm({ ...form, seat_capacity: parseInt(e.target.value) })
          }
        />

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

        <Input
          type="datetime-local"
          placeholder="Expires At"
          value={form.expires_at}
          onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
        />

        <Input
          placeholder="Thumbnail Image URL"
          value={form.thumbnail_img}
          onChange={(e) => setForm({ ...form, thumbnail_img: e.target.value })}
        />

        <Input
          placeholder="Slug (e.g. jakarta-fest)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />

        <Button onClick={handleSubmit} className="w-full mt-4">
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
