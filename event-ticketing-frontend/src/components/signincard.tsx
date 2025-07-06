"use client";

import { useState } from "react";

type SignInCardProps = {
  onClose: () => void;
};

export default function SignInCard({ onClose }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Sign in data:", { email, password });

    // Reset form
    setEmail("");
    setPassword("");

    // Tutup card
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative z-50">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        aria-label="Close"
      >
        ×
      </button>

      <h2 className="text-lg font-semibold mb-2">Welcome Back</h2>
      <p className="text-sm text-gray-600 mb-4">Sign in to your account</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mb-2"
        >
          Sign In
        </button>
      </form>

      <button className="w-full border py-2 rounded text-sm hover:bg-gray-100">
        Sign in with Google
      </button>
    </div>
  );
}
