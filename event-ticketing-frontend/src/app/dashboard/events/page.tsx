"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listevents } from "./listevents";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditEventForm } from "@/components/EditEventForm";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

export default function EventsPage() {
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventDetail | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3077/api/event/fetch", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
    }
      const data = await res.json();
      if (res.ok) setEvents(data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.length === 0 ? (
          <p className="text-muted-foreground">No events found.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl shadow-md overflow-hidden border bg-white hover:shadow-lg transition-all duration-200"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{event.name}</h2>
                <p className="text-sm text-gray-600 mb-1"><a target="_blank" href={`http://localhost:3000/events/${event.slug}`}>Link to the event</a></p>
                <p className="text-sm text-gray-500">
                  {event.start_date} – {event.end_date}
                </p>
                <p className="text-sm text-blue-600 font-semibold mt-2">
                  Rp{event.price.toLocaleString()}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpenEdit(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      setEventToDelete(event);
                      setOpenDelete(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EditEventForm
              event={selectedEvent}
              onSuccess={() => {
                fetchEvents();
                setOpenEdit(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{eventToDelete?.name}</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                if (!eventToDelete) return;
                try {
                  const res = await fetch(
                    `http://localhost:3077/api/event/delete/${eventToDelete.id}`,
                    {
                      method: "DELETE",
                      credentials: "include",
                    }
                  );
                  if (res.ok) {
                    await fetchEvents();
                    setOpenDelete(false);
                  } else {
                    const err = await res.json();
                    alert(err.message || "Failed to delete.");
                  }
                } catch (err) {
                  console.error("Delete error:", err);
                  alert("Something went wrong.");
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
