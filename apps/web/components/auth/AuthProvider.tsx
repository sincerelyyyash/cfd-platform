"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { sonar } from "@/components/ui/sonar";
import { useRouter } from "next/navigation";

type AuthContextType = {
  signedIn: boolean;
  setSignedIn: (v: boolean) => void;
  requestSignIn: (email: string) => Promise<void>;
  verifyWithToken: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();

  const requestSignIn = useCallback(async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sonar.error("Invalid email", "Please enter a valid email address.");
      return;
    }
    try {
      const res = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        sonar.error("Sign in failed", data?.message || "Unable to start sign in.");
        return;
      }
      sonar.success("Check your email", data?.message || "We sent you a login link.");
    } catch (e) {
      sonar.error("Network error", (e as Error).message);
    }
  }, []);

  const verifyWithToken = useCallback(async (token: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/signin/verify?token=${encodeURIComponent(token)}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        sonar.error("Sign in failed", data?.message || "Invalid or expired link.");
        return;
      }
      setSignedIn(true);
      sonar.success("Signed in", "You're now signed in.");
      setTimeout(() => router.push("/trading"), 800);
    } catch (e) {
      sonar.error("Network error", (e as Error).message);
    }
  }, [router]);

  const value = useMemo<AuthContextType>(() => ({ signedIn, setSignedIn, requestSignIn, verifyWithToken }), [signedIn, requestSignIn, verifyWithToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


