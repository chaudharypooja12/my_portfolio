"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0618] px-4 text-center text-white">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/80"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
