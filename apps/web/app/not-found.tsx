"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <a
          href="/"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
          aria-label="Go home"
        >
          Go home
        </a>
      </div>
    </div>
  );
}


