'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";   
import { Eye, EyeOff } from "lucide-react";

export default function OrganizerSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Organizer Sign In</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password with toggle */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[53%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        {/* Link to Sign Up */}
        <div className="text-sm text-center mt-4">
          Belum punya akun?{" "}
          <a href="/organizer/signup" className="text-blue-600 underline hover:text-blue-800">
            Daftar di sini
          </a>
        </div>
      </form>
    </div>
  );
}
