"use client";
import Link from "next/link";
import { useAuth } from "../lib/AuthProvider";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 mb-4">
      <Link href="/" className="font-bold">
        Auth Demo
      </Link>
      <div className="space-x-4">
        <Link href="/items">Items</Link>
        {user ? (
          <>
            <Link href="/profile">Profile</Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
