"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES, estimate, formatCurrency, getService } from "@/lib/pricing";

interface QuoteResponse {
  quote: {
    id: number;
    reference: string;
    estimatedAmount: string;
    serviceType: string;
    status: string;
  };
  estimate: {
    baseFee: number;
    areaCost: number;
    subtotal: number;
    contingency: number;
    total: number;
  };
}

const budgets = ["Under $10k", "$10k–$50k", "$50k–$150k", "$150k+", "Not sure yet"];
const timelines = ["ASAP", "1–3 months", "3–6 months", "Flexible"];

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    squareFootage: "",
    budget: "",
    timeline: "",
    address: "",
    projectDetails: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResponse | null>(null);

  const sqft = Number(form.squareFootage);
  const live = useMemo(() => {
    if (!form.serviceType || !Number.isFinite(sqft) || sqft <= 0) return null;
    return estimate({ serviceType: form.serviceType, squareFootage: sqft });
  }, [form.serviceType, sqft]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          squareFootage: sqft,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
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

  return (
    <section id="quote" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Get a quote
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Instant estimate, no pressure
          </h2>
          <p className="mt-4 text-slate-400">
            Answer a few quick questions and we&apos;ll generate a transparent ballpark
            estimate on the spot. A project lead follows up within one business day.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            {[
              "Transparent, itemized pricing",
              "No obligation or hidden fees",
              "Pay a deposit online to lock your dates",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 text-accent">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl glass-strong p-8 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-2xl text-black">
                  ✓
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">Quote created!</h3>
                <p className="mt-2 text-slate-400">
                  Your reference is{" "}
                  <span className="font-semibold text-accent">{result.quote.reference}</span>
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{getService(result.quote.serviceType)?.label}</span>
                    <span>Estimated total</span>
                  </div>
                  <div className="mt-2 font-display text-3xl font-extrabold text-white">
                    {formatCurrency(result.quote.estimatedAmount)}
                  </div>
                </div>
                <a
                  href={`/quote/${result.quote.id}`}
                  className="mt-6 inline-block rounded-xl bg-gradient-to-r from-accent to-amber-500 px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
                >
                  View quote & pay deposit →
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl glass-strong p-6 sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Full name</label>
                    <input required className={inputCls} value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                    <input required type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="jane@email.com" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Phone</label>
                    <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Service</label>
                    <select required className={inputCls} value={form.serviceType} onChange={set("serviceType")}>
                      <option value="">Select a service…</option>
                      {SERVICES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Approx. sq ft</label>
                    <input type="number" min={0} className={inputCls} value={form.squareFootage} onChange={set("squareFootage")} placeholder="1200" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Budget</label>
                    <select className={inputCls} value={form.budget} onChange={set("budget")}>
                      <option value="">Select…</option>
                      {budgets.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Timeline</label>
                    <select className={inputCls} value={form.timeline} onChange={set("timeline")}>
                      <option value="">Select…</option>
                      {timelines.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">Project address</label>
                    <input className={inputCls} value={form.address} onChange={set("address")} placeholder="City, State" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Project details</label>
                  <textarea required rows={3} className={inputCls} value={form.projectDetails} onChange={set("projectDetails")} placeholder="Tell us what you have in mind…" />
                </div>

                {live && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
                    <span className="text-sm text-slate-300">Live estimate</span>
                    <span className="font-display text-xl font-bold text-accent">
                      {formatCurrency(live.total)}
                    </span>
                  </div>
                )}

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
                  {loading ? "Generating quote…" : "Generate my free quote"}
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  By submitting you agree to be contacted about your project.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
