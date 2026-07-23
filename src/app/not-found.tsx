import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center mesh-bg px-4 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-400">That page may have been moved or never built.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-accent to-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
