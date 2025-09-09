/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../../lib/api";
import ErrorMessage from "../../components/ErrorMessage";

export default function ResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id") || "";
  const { token } = React.use(params);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await resetPassword(userId, token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <ErrorMessage message={error} />
        {success ? (
          <div className="text-green-600">
            Password reset! Redirecting to login...
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Set New Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
