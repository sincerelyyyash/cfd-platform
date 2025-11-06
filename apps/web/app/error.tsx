"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
          aria-label="Try again"
        >
          Try again
        </button>
      </div>
    </div>
  );
}


