"use client";

import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Request a Quote",
    desc: "Tell us about your project and get an instant, transparent estimate online.",
  },
  {
    n: "02",
    title: "On-Site Review",
    desc: "A project lead visits, confirms scope, and locks your fixed price.",
  },
  {
    n: "03",
    title: "Secure Your Slot",
    desc: "Pay a deposit online to reserve your build dates on our calendar.",
  },
  {
    n: "04",
    title: "Build & Handover",
    desc: "We execute with daily updates and a spotless, photo-documented finish.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent-2">
          How it works
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          A simple, stress-free path to built
        </h2>
      </Reveal>

      <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="relative rounded-2xl glass p-6">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 font-display text-lg font-bold text-black">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
