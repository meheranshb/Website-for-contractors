"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { SERVICES } from "@/lib/pricing";

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">
          What we do
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Full-service contracting, end to end
        </h2>
        <p className="mt-4 text-slate-400">
          From a single room refresh to ground-up construction, our crews deliver
          craftsmanship with transparent, fixed pricing.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="group relative h-full overflow-hidden rounded-2xl glass p-6"
            >
              <div className="gradient-border absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100" />
              <div className="text-4xl">{s.icon}</div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.label}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.blurb}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                <span>From</span>
                <span className="font-semibold text-accent">
                  ${s.baseFee.toLocaleString()}
                </span>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
