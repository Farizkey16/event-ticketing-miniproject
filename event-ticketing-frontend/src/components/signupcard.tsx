"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function SignUpCard({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referred_by_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/user/register", {
        email: form.email,
        username: form.username,
        password: form.password,
        referred_by_code: form.referred_by_code,
      });

      alert(res.data.message || "Registration successful!");
      onClose(); // tutup card
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X />
      </button>
      <h2 className="text-xl font-bold mb-2 text-center">Create a new account</h2>
      <p className="text-sm text-gray-500 text-center mb-4">Fill your details below.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded pr-10"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="text"
          placeholder="Referral Code (optional)"
          className="w-full px-4 py-2 border rounded"
          value={form.referred_by_code}
          onChange={(e) => setForm({ ...form, referred_by_code: e.target.value })}
        />

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Sign Up
        </button>
        <button type="button" className="w-full border py-2 rounded">
          Sign up with Google
        </button>
      </form>
    </div>
  );
}
