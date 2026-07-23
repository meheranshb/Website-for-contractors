import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { ensureDb } from "@/db/init";
import { quotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatCurrency, getService } from "@/lib/pricing";
import PaymentForm from "@/components/PaymentForm";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [quote] = await db.select().from(quotes).where(eq(quotes.id, numericId));
  if (!quote) notFound();

  const total = Number(quote.estimatedAmount ?? 0);
  const deposit = Math.round(total * 0.2 * 100) / 100;
  const service = getService(quote.serviceType);

  return (
    <main className="relative min-h-screen mesh-bg">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <Link href="/" className="text-sm text-slate-400 transition hover:text-white">
          ← Back to home
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Quote summary */}
          <div className="rounded-3xl glass-strong p-8">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Estimate
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold">
              Quote {quote.reference}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Status: <span className="text-emerald-400">{quote.status}</span>
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <Row label="Service" value={service ? `${service.icon} ${service.label}` : quote.serviceType} />
              <Row label="Name" value={quote.name} />
              <Row label="Email" value={quote.email} />
              {quote.phone && <Row label="Phone" value={quote.phone} />}
              {quote.squareFootage != null && (
                <Row label="Area" value={`${quote.squareFootage.toLocaleString()} sq ft`} />
              )}
              {quote.timeline && <Row label="Timeline" value={quote.timeline} />}
              {quote.address && <Row label="Location" value={quote.address} />}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Project details</p>
              <p className="mt-1 text-slate-200">{quote.projectDetails}</p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-accent/20 to-accent-2/10 p-5">
              <span className="text-sm text-slate-300">Estimated total</span>
              <span className="font-display text-3xl font-extrabold text-white">
                {formatCurrency(total)}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Includes a 12% contingency. Final price confirmed after on-site review.
            </p>
          </div>

          {/* Payment */}
          <div>
            <div className="mb-4 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-amber-100">
              A <strong>{formatCurrency(deposit)}</strong> deposit (20%) secures your
              build dates. You can adjust the amount below.
            </div>
            <PaymentForm
              quoteId={quote.id}
              defaultAmount={deposit}
              description={`Deposit for quote ${quote.reference}`}
              defaultName={quote.name}
              defaultEmail={quote.email}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
