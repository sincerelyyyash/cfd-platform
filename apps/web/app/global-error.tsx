"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">App crashed</h1>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
            aria-label="Reload app"
          >
            Reload app
          </button>
        </div>
      </body>
    </html>
  );
}


