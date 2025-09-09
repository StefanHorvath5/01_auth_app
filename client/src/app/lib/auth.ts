"use client";
import { useState, useEffect } from "react";
import { getProfile, logout as apiLogout } from "./api";
import { User } from "./types";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await apiLogout();
    setAccessToken(null);
    setUser(null);
    window.location.href = "/";
  }

  return { user, loading, logout, setUser };
}

export function getAccessToken() {
  return accessToken;
}
