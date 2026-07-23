"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
    </div>
  ),
});

const badges = ["Licensed & Insured", "20+ Years", "5-Star Rated", "Fixed Pricing"];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0">
        <Hero3D />
      </div>
      {/* readability gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-amber-200">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-accent" />
            Now booking projects for {new Date().getFullYear()}
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            We build spaces
            <br />
            that <span className="text-gradient">last a lifetime</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg">
            BuildCraft is a premium contracting studio for residential and commercial
            construction, remodeling, and renovations. Get an instant estimate and
            secure your project with an online deposit.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#quote"
              className="rounded-xl bg-gradient-to-r from-accent to-amber-500 px-6 py-3.5 text-sm font-semibold text-black shadow-xl shadow-amber-500/25 transition hover:scale-105"
            >
              Get an Instant Quote
            </a>
            <a
              href="#services"
              className="rounded-xl glass px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-float-y text-slate-400">
        <span className="text-xs">Scroll to explore</span>
        <div className="mx-auto mt-2 h-9 w-5 rounded-full border border-white/20 p-1">
          <div className="h-2 w-full rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
