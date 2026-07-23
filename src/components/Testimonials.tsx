"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const items = [
  {
    name: "Marcus Bell",
    role: "Homeowner, Austin TX",
    text: "BuildCraft remodeled our kitchen and the finish is flawless. The online quote matched the final invoice to the dollar.",
    rating: 5,
  },
  {
    name: "Sofia Reyes",
    role: "Property Manager",
    text: "We run 40 units and their crew is the only one we trust for roofing and plumbing. Deposits and invoices are painless.",
    rating: 5,
  },
  {
    name: "David Okafor",
    role: "Commercial Tenant",
    text: "From 3D walkthrough to handover, the communication was unreal. Paid milestones online and tracked everything.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">
          Client love
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Trusted by homeowners & businesses
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -6 }}
              className="h-full rounded-2xl glass p-6"
            >
              <div className="text-amber-400">{"★".repeat(t.rating)}</div>
              <p className="mt-4 text-slate-300">“{t.text}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-bold text-black">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
