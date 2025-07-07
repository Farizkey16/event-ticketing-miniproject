"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export default function SignInCard({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X />
      </button>
      <h2 className="text-xl font-bold mb-2 text-center">Buyer Sign In</h2>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>

        <div className="text-center text-sm text-gray-500">atau</div>

        <button className="w-full border py-2 rounded">
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
