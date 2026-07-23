"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";

const stats = [
  { value: 1240, suffix: "+", label: "Projects completed" },
  { value: 20, suffix: " yrs", label: "Average crew experience" },
  { value: 98, suffix: "%", label: "On-time delivery" },
  { value: 4.9, suffix: "★", label: "Average client rating" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const isFloat = value % 1 !== 0;
  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-white sm:text-5xl">
      {isFloat ? display.toFixed(1) : Math.round(display).toLocaleString()}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent-2/20 blur-3xl" />
          <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-2 text-sm text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
