"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { events } from "@/data/events";

export default function PurchasePage() {
  const rawEventId = useParams()?.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId ?? "";
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return <div className="p-6 text-red-600">Event Not Found.</div>;
  }

  const isFreeEvent = event.price.toLowerCase() === "gratis";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pointsUsed, setPointsUsed] = useState(0);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(
    isFreeEvent ? "done" : "waiting for payment"
  );
  const [countdownStartTime, setCountdownStartTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0); // in seconds

  // Timer logic
  useEffect(() => {
    if (!countdownStartTime || isFreeEvent) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(countdownStartTime.getTime() + 2 * 60 * 60 * 1000).getTime(); // 2 hours
      const diff = Math.floor((end - now) / 1000);

      if (diff <= 0) {
        setRemainingTime(0);
        clearInterval(interval);
        if (!paymentProof) {
          setTransactionStatus("expired");
        }
      } else {
        setRemainingTime(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownStartTime, paymentProof, isFreeEvent]);

  // Status otomatis
  useEffect(() => {
    if (isFreeEvent) {
      setTransactionStatus("done");
      return;
    }

    if (!selectedPaymentMethod) {
      setTransactionStatus("waiting for payment");
    } else if (selectedPaymentMethod && !paymentProof) {
      setTransactionStatus("waiting for payment");
    } else if (selectedPaymentMethod && paymentProof) {
      setTransactionStatus("waiting for admin confirmation");
    }
  }, [selectedPaymentMethod, paymentProof, isFreeEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFreeEvent && !countdownStartTime) {
      setCountdownStartTime(new Date());
    }

    alert("Pendaftaran berhasil dikirim!");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Buy A Ticket</h1>

      {/* Info Event */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Start Date:</strong> {event.date}</p>
        <p><strong>Event Time:</strong> {event.time}</p>
        <p><strong>Ticket Price:</strong> {event.price}</p>
      </div>

      {/* Form Pembelian */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {!isFreeEvent && (
          <>
            <div>
              <label className="block mb-1 font-medium">Payment Method</label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">-- Choose Payment Method --</option>
                {event.paymentMethods?.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Payment Proof</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        <div>
          <label className="block mb-1 font-medium">Use Point</label>
          <input
            type="number"
            value={pointsUsed}
            onChange={(e) => setPointsUsed(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Countdown Timer */}
        {!isFreeEvent && countdownStartTime && transactionStatus !== "expired" && (
          <div className="p-4 bg-blue-50 border border-blue-300 rounded">
            <p className="font-medium text-blue-800">
              countdownStartTime: <span className="font-bold">{formatTime(remainingTime)}</span>
            </p>
          </div>
        )}

        <div className="p-4 bg-yellow-100 border rounded">
          <p><strong>Transaction Status:</strong> {transactionStatus}</p>
        </div>

        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-700"
        >
          {isFreeEvent ? "Join For Free" : "Buy A TICKET"}
        </button>
      </form>
    </div>
  );
}
