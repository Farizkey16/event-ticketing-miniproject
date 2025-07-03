"use client";

import { useState } from "react";

export default function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Sign in data:", { email, password });

    // reset form (opsional)
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-semibold mb-2">Login to your account</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter your email below to login to your account
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email or Username"
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

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mb-2"
        >
          Login
        </button>
      </form>

      <button className="w-full border py-2 rounded text-sm hover:bg-gray-100">
        Login with Google
      </button>
    </div>
  );
}
