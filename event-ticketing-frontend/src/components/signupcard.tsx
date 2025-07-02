"use client";

import { useState } from "react";

export default function SignUpCard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi dasar
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi tidak cocok");
      return;
    }

    console.log("Sign up data:", {
      username,
      email,
      password,
    });

    // Reset form
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-semibold mb-2">Create a new account</h2>
      <p className="text-sm text-gray-600 mb-4">Fill your details below.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-3 py-2 border rounded text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-3 py-2 border rounded text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-3">
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

        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-blue-600"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mb-2"
        >
          Sign Up
        </button>
      </form>

      <button className="w-full border py-2 rounded text-sm hover:bg-gray-100">
        Sign up with Google
      </button>
    </div>
  );
}
