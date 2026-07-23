"use client";

import Reveal from "./Reveal";
import PaymentForm from "./PaymentForm";

export default function PaySection() {
  return (
    <section id="pay" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-widest text-accent-2">
            Pay online
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            Reserve your project in minutes
          </h2>
          <p className="mt-4 text-slate-400">
            Already have a quote? Enter your reference and pay your deposit to lock
            your build dates. No quote yet? Pay a flexible hold-deposit and our team
            will reach out.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { t: "Fixed deposits", d: "Typically 20% to secure your slot." },
              { t: "Milestone billing", d: "Pay as progress is made, never upfront in full." },
              { t: "Receipts & records", d: "Every payment is stored and emailed automatically." },
            ].map((f) => (
              <div key={f.t} className="flex gap-4 rounded-2xl glass p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-white">{f.t}</p>
                  <p className="text-sm text-slate-400">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <PaymentForm defaultAmount={500} description="Project hold-deposit" />
        </Reveal>
      </div>
    </section>
  );
}
