import Link from "next/link";
import { db } from "@/db";
import { ensureDb } from "@/db/init";
import { quotes, payments } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatCurrency, getService } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await ensureDb();
  const [allQuotes, allPayments] = await Promise.all([
    db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(50),
    db.select().from(payments).orderBy(desc(payments.createdAt)).limit(50),
  ]);

  const revenue = allPayments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalEstimate = allQuotes.reduce((sum, q) => sum + Number(q.estimatedAmount ?? 0), 0);

  const cards = [
    { label: "Quotes", value: String(allQuotes.length), accent: "text-accent" },
    { label: "Payments", value: String(allPayments.length), accent: "text-accent-2" },
    { label: "Revenue", value: formatCurrency(revenue), accent: "text-emerald-400" },
    { label: "Pipeline", value: formatCurrency(totalEstimate), accent: "text-white" },
  ];

  return (
    <main className="relative min-h-screen mesh-bg">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">BuildCraft Admin</h1>
            <p className="mt-1 text-sm text-slate-400">
              Live quotes & payments from the database.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl glass px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            ← View site
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl glass-strong p-5">
              <p className="text-sm text-slate-400">{c.label}</p>
              <p className={`mt-1 font-display text-2xl font-extrabold ${c.accent}`}>
                {c.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Quotes */}
          <div className="rounded-3xl glass-strong p-6">
            <h2 className="font-display text-xl font-semibold">Recent quotes</h2>
            <div className="mt-4 space-y-3">
              {allQuotes.length === 0 && <Empty text="No quotes yet." />}
              {allQuotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/quote/${q.id}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-accent/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{q.reference}</span>
                    <span className="text-sm font-medium text-accent">
                      {formatCurrency(q.estimatedAmount)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {getService(q.serviceType)?.label ?? q.serviceType} · {q.name}
                  </p>
                  <p className="text-xs text-slate-500">{q.email}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div className="rounded-3xl glass-strong p-6">
            <h2 className="font-display text-xl font-semibold">Recent payments</h2>
            <div className="mt-4 space-y-3">
              {allPayments.length === 0 && <Empty text="No payments yet." />}
              {allPayments.map((p) => (
                <div
                  key={p.id}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{p.reference}</span>
                    <span className="text-sm font-medium text-emerald-400">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.status} · {p.transactionId}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
