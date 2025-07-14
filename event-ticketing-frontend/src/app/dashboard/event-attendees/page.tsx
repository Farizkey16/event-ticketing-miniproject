"use client";

import { useState, useEffect } from "react";
import { sampleAttendees } from "./sampleAttendees";
import { apiBackend } from "@/lib/apiHelper";

export type Attendee = {
  id: number;
  eventName: string;
  userName: string;
  ticketQuantity: number;
  totalPricePaid: number;
  status: "attending" | "attended" | "expired" | "cancelled";
};

export default function AttendanceTable() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch("http://localhost:3077/api/event/get-attendees", {
          method: "GET",
          credentials: "include"
        })
        
        const json = await res.json();

        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }

        console.log("Attendees:", json.data);
        setAttendees(json.data)
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAttendees();
  }, []);

  const sortByEvent = () => {
    const sorted = [...attendees].sort((a, b) =>
      sortAsc
        ? a.eventName.localeCompare(b.eventName)
        : b.eventName.localeCompare(a.eventName)
    );
    setAttendees(sorted);
    setSortAsc(!sortAsc);
  };

  const statusColor = {
    attending: "bg-yellow-100 text-yellow-800",
    attended: "bg-green-100 text-green-800",
    expired: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Attendant List</h2>
      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th
                className="px-4 py-3 cursor-pointer hover:underline"
                onClick={sortByEvent}
              >
                Event Name
              </th>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">Tickets</th>
              <th className="px-4 py-3">Total Paid</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a, index) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{a.eventName}</td>
                <td className="px-4 py-2">{a.userName}</td>
                <td className="px-4 py-2">{a.ticketQuantity}</td>
                <td className="px-4 py-2">
                  Rp{(a.totalPricePaid ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColor[a.status]
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
