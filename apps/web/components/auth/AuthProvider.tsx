"use client";

import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sonar } from "@/components/ui/sonar";
import { useRouter } from "next/navigation";

type AuthContextType = {
  signedIn: boolean;
  setSignedIn: (v: boolean) => void;
  requestSignIn: (email: string) => Promise<boolean>;
  verifyWithToken: (token: string) => Promise<void>;
  loading: boolean;
};

const defaultAuthValue: AuthContextType = {
  signedIn: false,
  setSignedIn: () => {},
  requestSignIn: async () => false,
  verifyWithToken: async () => {},
  loading: true,
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const requestSignIn = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sonar.error("Invalid email", "Please enter a valid email address.");
      return false;
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
        return false;
      }
      sonar.success("Check your email", data?.message || "We sent you a login link.");
      return true;
    } catch (e) {
      sonar.error("Network error", (e as Error).message);
      return false;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/v1/auth/verify", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      } catch (e) {
        setSignedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = useMemo<AuthContextType>(() => ({ signedIn, setSignedIn, requestSignIn, verifyWithToken, loading }), [signedIn, requestSignIn, verifyWithToken, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}


