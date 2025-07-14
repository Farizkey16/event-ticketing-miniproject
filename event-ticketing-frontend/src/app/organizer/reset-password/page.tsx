"use client";
import { Card } from "@/components/ui/card";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");


  const inputCurrentPassword = useRef<HTMLInputElement | null>(null);
  const inputNewPassword = useRef<HTMLInputElement | null>(null);
  const inputConfirmNewPassword = useRef<HTMLInputElement | null>(null);

  const [currPass, setcurrPass] = useState(false);
  const [newPass, setnewPass] = useState(false);
  const [confPass, setconfPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentPassword = inputCurrentPassword.current?.value;
    const newPassword = inputNewPassword.current?.value;
    const confirmNewPassword = inputConfirmNewPassword.current?.value;

    if (newPassword !== confirmNewPassword) {
      alert("The new passwords don't match.");
      return;
    }

    if (currentPassword == newPassword) {
      alert("Use different password than your current password.");
      return;
    }

    const res = await fetch("http://localhost:3077/api/organizer/reset-password/confirm", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful.");
      router.push("/organizer/signin");
    } else {
      alert(data.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-md rounded-2xl bg-white">
        <h1 className="text-center font-bold">Reset your password</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="current-password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={currPass ? "text" : "password"}
                className="w-full pr-12 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400 transition"
                placeholder="Enter your current password here."
                ref={inputCurrentPassword}
                required
              ></input>
              <button
                type="button"
                id="curr-password"
                onClick={() => setcurrPass((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-black p-1 rounded-sm px-2 text-white"
              >
                {currPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="new-password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={newPass ? "text" : "password"}
                className="w-full pr-12 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400 transition"
                placeholder="Enter your new password here."
                ref={inputNewPassword}
                required
              ></input>
              <button
                type="button"
                id="new-password"
                onClick={() => setnewPass((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-black p-1 rounded-sm px-2 text-white"
              >
                {newPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirm-password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={confPass ? "text" : "password"}
                className="w-full pr-12 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-400 transition"
                placeholder="Reenter your new password here."
                ref={inputConfirmNewPassword}
                required
              ></input>

              <button
                type="button"
                id="conf-password"
                onClick={() => setconfPass((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-black p-1 rounded-sm px-2 text-white"
              >
                {confPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </Card>
    </div>
  );
}