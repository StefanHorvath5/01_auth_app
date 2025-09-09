/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../lib/api";
import { useAuth } from "../lib/auth";
import ErrorMessage from "../components/ErrorMessage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password });
      console.log(res);
      setUser(res.user);

      router.push("/profile");
    } catch (err: any) {
      console.log(err);
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8 space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <ErrorMessage message={error} />
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Login
      </button>
    </form>
  );
}
