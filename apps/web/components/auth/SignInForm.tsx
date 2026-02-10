"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { ArrowRight, Loader2 } from "lucide-react";

export function SignInForm() {
  const { requestSignIn, verifyWithToken } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) verifyWithToken(token);
  }, [verifyWithToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await requestSignIn(email);
    setSubmitting(false);
    if (result) {
      setSuccess(true);
      setEmail("");
    }
  };

  if (success) {
    return (
      <div className="border border-[#B19EEF]/30 bg-[#B19EEF]/5 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-[#B19EEF] animate-pulse" />
          <span className="text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase">
            Check Your Inbox
          </span>
        </div>
        <h3 className="text-white text-[18px] font-semibold font-space mb-2">
          Magic link sent
        </h3>
        <p className="text-neutral-500 text-[14px] font-ibm-plex-sans leading-relaxed">
          We&apos;ve sent a secure login link to your email. Click the link to access your trading terminal.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.06] bg-white/[0.02] p-5 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] text-[#B19EEF] font-space tracking-[0.2em] uppercase mb-3"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full h-12 px-4 bg-[#08080a] border border-white/[0.1] text-white text-[14px] font-ibm-plex-sans placeholder:text-neutral-600 focus:outline-none focus:border-[#B19EEF]/50 focus:bg-[#B19EEF]/[0.02] transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !email}
          className="group w-full h-12 bg-white text-[#08080a] text-[13px] font-medium font-space tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Sending link...</span>
            </>
          ) : (
            <>
              <span>Send Magic Link</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/[0.06]">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-neutral-600 text-[11px] font-ibm-plex-sans uppercase tracking-wider">
            Secure
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-1.5 h-1.5 bg-[#B19EEF] mx-auto mb-2" />
            <span className="text-neutral-500 text-[10px] font-ibm-plex-sans">
              No passwords
            </span>
          </div>
          <div className="text-center">
            <div className="w-1.5 h-1.5 bg-[#B19EEF] mx-auto mb-2" />
            <span className="text-neutral-500 text-[10px] font-ibm-plex-sans">
              One-time links
            </span>
          </div>
          <div className="text-center">
            <div className="w-1.5 h-1.5 bg-[#B19EEF] mx-auto mb-2" />
            <span className="text-neutral-500 text-[10px] font-ibm-plex-sans">
              Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
