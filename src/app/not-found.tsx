import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/80"
      >
        Go Home
      </Link>
    </div>
  );
}
