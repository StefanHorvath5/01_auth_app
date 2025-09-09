"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getProfile,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from "./api";
import { User } from "./types";

const TOKEN_KEY = "accessToken";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
  );

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProfile(accessToken, setAccessToken)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await apiLogin({ email, password }, setAccessToken);
    setUser(result.user);
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    const result = await apiRegister({ email, password }, setAccessToken);
    setUser(result.user);
    setLoading(false);
  };

  const logout = async () => {
    await apiLogout(accessToken, setAccessToken);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
