"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function OrganizerSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/organizer/dashboard");
      } else {
        alert("Email atau password salah.");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSignIn}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Organizer Sign In</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[53%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Link to Sign Up */}
        <div className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/organizer/signup"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Daftar di sini
          </a>
        </div>
      </form>
    </div>
  );
}
