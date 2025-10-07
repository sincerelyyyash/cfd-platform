import { SignInForm } from "@/components/auth/SignInForm";

export default function SigninPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left column: marketing text / illustration */}
      <section className="hidden md:flex flex-col justify-center px-8 lg:px-16 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-neutral-200/60 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
            Secure. Fast. Intuitive
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 dark:text-white md:text-5xl">
            Trade smarter with PrimeTrade
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            Access real-time markets, manage positions, and execute with confidence. Sign in with your email to receive a magic link.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />Zero passwords, magic-link security</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />Advanced charting and analytics</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-rose-500" />Institutional-grade infrastructure</li>
          </ul>
        </div>
      </section>

      {/* Right column: sign-in card aligned right */}
      <section className="flex items-center justify-end p-4 md:p-8 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
        <div className="w-full max-w-lg">
          <SignInForm />
        </div>
      </section>
    </div>
  )
}
