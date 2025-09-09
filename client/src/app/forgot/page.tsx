/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <ErrorMessage message={error} />
      {sent && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
          Email sent!
        </div>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Send Reset Email
      </button>
    </form>
  );
}
