// components/accountcard.tsx
"use client";

import { X } from "lucide-react";

export default function AccountCard({ onClose }: { onClose: () => void }) {
  const userProfile = {
    name: "harry kurniawan",
    phone: "+6287876785670",
    email: "ada.apanich@gmail.com",
    birthdate: "",
    gender: "",
    country: "Indonesia",
  };

  return (
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X />
      </button>

      <h2 className="text-xl font-bold mb-4">Profil</h2>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Nama lengkap</span>
          <span className="font-medium">{userProfile.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nomor HP</span>
          <span className="font-medium">{userProfile.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email</span>
          <span className="font-medium">{userProfile.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tanggal lahir</span>
          <span className="text-gray-400 italic">Isi tanggal lahirmu</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Jenis kelamin</span>
          <span className="text-gray-400 italic">-</span>
        </div>
      </div>

      <h3 className="font-semibold mb-2">Pengaturan</h3>
      <div className="space-y-2">
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-2 rounded text-left">
          Ganti Kata Sandi
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-2 rounded text-left">
          Bahasa <span className="float-right text-sm text-gray-500">Indonesia</span>
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-2 rounded text-left">
          Negara atau Wilayah <span className="float-right text-sm text-gray-500">{userProfile.country}</span>
        </button>
      </div>
    </div>
  );
}
