"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/pricing";

interface PaymentResult {
  payment: {
    id: number;
    reference: string;
    amount: string;
    status: string;
    transactionId: string;
    description: string | null;
  };
}

interface Props {
  quoteId?: number;
  defaultAmount?: number;
  description?: string;
  defaultName?: string;
  defaultEmail?: string;
  compact?: boolean;
}

function formatCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

export default function PaymentForm({
  quoteId,
  defaultAmount = 500,
  description,
  defaultName = "",
  defaultEmail = "",
  compact = false,
}: Props) {
  const [form, setForm] = useState({
    name: defaultName,
    email: defaultEmail,
    amount: defaultAmount ? String(defaultAmount) : "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          amount: Number(form.amount),
          cardNumber: form.cardNumber,
          expiry: form.expiry,
          cvc: form.cvc,
          quoteId,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Payment failed.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-accent focus:bg-white/10";

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl glass-strong p-8 text-center"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl text-black">
          ✓
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold">Payment successful</h3>
        <p className="mt-2 text-slate-400">
          Transaction <span className="font-semibold text-emerald-300">{result.payment.reference}</span>{" "}
          is confirmed.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm">
          <Row label="Amount" value={formatCurrency(result.payment.amount)} />
          <Row label="Status" value={<span className="text-emerald-400">Succeeded</span>} />
          <Row label="Txn ID" value={<span className="text-slate-300">{result.payment.transactionId}</span>} />
          {result.payment.description && (
            <Row label="For" value={<span className="text-slate-300">{result.payment.description}</span>} />
          )}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          A receipt has been sent to your email (demo).
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-3xl glass-strong p-6 sm:p-8 ${compact ? "" : ""}`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className={`font-display font-bold ${compact ? "text-xl" : "text-2xl"}`}>
          Secure payment
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          🔒 Encrypted
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Name on card</label>
          <input required className={inputCls} value={form.name} onChange={set("name")} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
          <input required type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="jane@email.com" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Amount (USD)</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              required
              type="number"
              min={1}
              step="0.01"
              className={`${inputCls} pl-8`}
              value={form.amount}
              onChange={set("amount")}
              placeholder="500.00"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Card number</label>
          <input
            required
            inputMode="numeric"
            className={inputCls}
            value={form.cardNumber}
            onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
            placeholder="4242 4242 4242 4242"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Expiry</label>
          <input
            required
            inputMode="numeric"
            className={inputCls}
            value={form.expiry}
            onChange={(e) => setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
            placeholder="MM/YY"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">CVC</label>
          <input
            required
            inputMode="numeric"
            className={inputCls}
            value={form.cvc}
            onChange={(e) => setForm((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
            placeholder="123"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-amber-500 px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Processing…" : `Pay ${form.amount ? formatCurrency(Number(form.amount)) : ""}`}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        Demo gateway — use card <span className="text-slate-400">4242 4242 4242 4242</span>, any future date & CVC.
      </p>
    </form>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
