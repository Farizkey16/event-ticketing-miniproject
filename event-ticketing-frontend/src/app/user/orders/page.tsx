"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Dummy user login
const user = {
  name: "Harry Kurniawan",
  tier: "Silver",
  point: 0,
};

// Dummy orders
const orders = [
  {
    id: "ORD123456",
    eventName: "Jakarta Kreatif Fest 2025",
    date: "1 Oktober 2025",
    location: "Istora Senayan, Jakarta",
    status: "E-Ticket",
  },
  {
    id: "ORD123457",
    eventName: "Bandung Music Carnival",
    date: "15 September 2025",
    location: "Trans Convention Center, Bandung",
    status: "E-Ticket",
  },
];

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "refunds">("orders");
  const pathname = usePathname();

  const menuItems = [
    { label: "Akun", path: "/user/account" },
    { label: "Metode Pembayaran", path: "/user/payment-methods" },
    { label: "Kumpulan Review Kamu", path: "/user/reviews" },
    { label: "Wishlist", path: "/user/wishlist" },
    { label: "Your Orders", path: "/user/orders" },
    { label: "Pusat Bantuan", path: "/user/help-center" },
    
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">⭐ Tier {user.tier}</p>
          <p className="text-sm text-gray-600">{user.point} Poin</p>
        </div>

        <nav className="space-y-2 text-sm">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <span
                className={`block w-full text-left px-2 py-1 rounded ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-4">Riwayat</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pesanan Lama
          </button>
          <button
            onClick={() => setActiveTab("refunds")}
            className={`px-4 py-2 rounded ${
              activeTab === "refunds"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Refund Lama
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white border rounded-lg p-6 text-center shadow">
                <p className="text-lg font-semibold mb-2">Tidak ada pesanan dalam 90 hari</p>
                <p className="text-sm text-gray-500 mb-4">
                  Pakai filter buat lihat daftar pesanan sebelumnya
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Atur Periode
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500">Order ID: {order.id}</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{order.eventName}</h3>
                  <p className="text-sm text-gray-600">{order.date}</p>
                  <p className="text-sm text-gray-600">{order.location}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "refunds" && (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            Belum ada refund yang diproses.
          </div>
        )}
      </main>
    </div>
  );
}
