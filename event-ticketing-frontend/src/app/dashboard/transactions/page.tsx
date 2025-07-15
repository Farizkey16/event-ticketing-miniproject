"use client";

import { previousDay } from "date-fns";
import { useState, useEffect } from "react";

type TransactionStatus =
  | "waiting_for_payment"
  | "waiting_for_admin_confirmation"
  | "rejected"
  | "accepted"
  | "expired"
  | "canceled";

type Transaction = {
  id: number;
  user_id: number;
  event_id: number;
  voucher_id?: number;
  coupon_id?: number;
  created_at: string;
  status: TransactionStatus;
  payment_proof_url: string;
  total_price: number;
  discount_applied?: number;
  eventName?: string;
  buyerName?: string;
};

const resolvedStatuses: TransactionStatus[] = [
  "accepted",
  "rejected",
  "expired",
  "canceled",
];

const dummyTransactions: Transaction[] = [
  {
    id: 1,
    user_id: 101,
    event_id: 1001,
    created_at: "2025-07-10T10:00:00Z",
    status: "waiting_for_admin_confirmation",
    payment_proof_url: "/proofs/proof1.jpg",
    total_price: 250000,
    eventName: "Week Me Up Bali",
    buyerName: "John Doe",
  },
  {
    id: 2,
    user_id: 102,
    event_id: 1002,
    created_at: "2025-07-11T14:30:00Z",
    status: "waiting_for_admin_confirmation",
    payment_proof_url: "/proofs/proof2.jpg",
    total_price: 100000,
    discount_applied: 20000,
    eventName: "Jakarta Kreatif Fest",
    buyerName: "Agus Santoso",
  },
];

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const statusStyles: Record<TransactionStatus, string> = {
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    waiting_for_payment: "bg-yellow-100 text-yellow-700",
    waiting_for_admin_confirmation: "bg-blue-100 text-blue-700",
    expired: "bg-gray-100 text-gray-700",
    canceled: "bg-orange-100 text-orange-700",
  };

  const fetchTransaction = async () => {
    try {
      const res = await fetch(
        "http://localhost:3077/api/transactions/get-transactions",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      if (res.ok) setTransactions(data.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      
      const res = await fetch(
        `http://localhost:3077/api/transactions/${id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { Content_Type: "application/json" },
          body: JSON.stringify({
            status: action === "accept" ? "accepted" : "rejected",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update transaction..");

      setTransactions((prev) =>
        prev.map((trx) =>
          trx.id === id
            ? { ...trx, status: action === "accept" ? "accepted" : "rejected" }
            : trx
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update transaction.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Transactions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.map((trx) => {
          const isResolved = resolvedStatuses.includes(trx.status);

          return (
            <div
              key={trx.id}
              className="border rounded-xl shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-4 space-y-2">
                <h2 className="font-bold text-md">{trx.eventName}</h2>
                <p className="text-sm text-gray-600">Buyer: {trx.buyerName}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(trx.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  Total: Rp{trx.total_price.toLocaleString()}
                </p>
                {trx.discount_applied && (
                  <p className="text-xs text-green-500">
                    Discount: Rp{trx.discount_applied.toLocaleString()}
                  </p>
                )}
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                    statusStyles[trx.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {trx.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex gap-2 p-4 border-t mt-2">
                <button
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
                  onClick={() => window.open(trx.payment_proof_url, "_blank")}
                >
                  View Proof
                </button>
                {isResolved ? (
                  <p className="text-xs text-gray-500 italic">
                    Already processed
                  </p>
                ) : (
                  <>
                    <button
                      className="text-xs px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded cursor-pointer"
                      onClick={() => handleAction(trx.id, "accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded cursor-pointer"
                      onClick={() => handleAction(trx.id, "reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
