"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <div>Email: {user?.email}</div>
        <div>Role: {user?.role}</div>
      </div>
    </ProtectedRoute>
  );
}
