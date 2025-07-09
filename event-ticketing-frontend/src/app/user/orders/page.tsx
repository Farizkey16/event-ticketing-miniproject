"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dummyOrders as orders } from "@/data/dummy-orders";

const user = {
  name: "Harry Kurniawan",
  tier: "Silver",
  point: 0,
};

export default function UserOrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "refunds">("orders");
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Account", path: "/user/account" },
    { label: "Payment", path: "#", action: () => setShowPaymentPanel(true) },
    { label: "Review ", path: "/user/reviews" },
    { label: "Your Orders", path: "/user/orders" },
    { label: "New Order", path: "/user/new-orders" },
    { label: "Help-center", path: "/user/help-center" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">⭐ Tier {user.tier}</p>
          <p className="text-sm text-gray-600">{user.point} Poin</p>
        </div>

        <nav className="space-y-2 text-sm">
          {menuItems.map((item) =>
            item.action ? (
              <button
                key={item.label}
                onClick={item.action}
                className="block w-full text-left px-2 py-1 rounded text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </button>
            ) : (
              <Link key={item.path} href={item.path}>
                <span
                  className={`block w-full text-left px-2 py-1 rounded cursor-pointer ${
                    pathname === item.path
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
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
                <p className="text-lg font-semibold mb-2">
                  Tidak ada pesanan dalam 90 hari
                </p>
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
                    <div className="text-sm text-gray-500">
                      Order ID: {order.id}
                    </div>
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

      {/* Payment Side Panel */}
      {showPaymentPanel && (
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 z-50 border-l">
          <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Bank Name</label>
              <select className="w-full border rounded p-2">
                <option value="">-- Bank Option --</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BCA">BCA</option>
                <option value="BRI">BRI</option>
                <option value="BTN">BTN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Account Number
              </label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Account Holder Name
              </label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentPanel(false)}
                className="text-gray-600 hover:underline"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
