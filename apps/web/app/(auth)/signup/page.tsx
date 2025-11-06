"use client";
import { SignUpForm } from "@/components/auth/SignupForm";
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="p-4 flex justify-center items-center h-screen">
      <SignUpForm />
    </div>
  )
}
