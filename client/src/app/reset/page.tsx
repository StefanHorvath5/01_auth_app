/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { useRouter } from "next/navigation";

export default function ResetPage() {
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token, newPassword }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <ErrorMessage message={error} />
      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
          Password reset!
        </div>
      )}
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        required
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Token"
        value={token}
        required
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        required
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Reset Password
      </button>
    </form>
  );
}
