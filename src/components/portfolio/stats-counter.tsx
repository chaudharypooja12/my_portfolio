"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { end: 3, suffix: "+", label: "Years Experience" },
  { end: 10, suffix: "+", label: "Technical Skills" },
  { end: 2, suffix: "", label: "Academic Degrees" },
  { end: 4, suffix: "+", label: "Projects Completed" },
];

export function StatsSection() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const interval = duration / steps;

          stats.forEach((stat, i) => {
            const increment = stat.end / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.end) {
                setCounters((prev) => {
                  const next = [...prev];
                  next[i] = stat.end;
                  return next;
                });
                clearInterval(timer);
              } else {
                setCounters((prev) => {
                  const next = [...prev];
                  next[i] = Math.floor(current);
                  return next;
                });
              }
            }, interval);
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-nebula-2/5" />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-4xl font-bold gradient-text md:text-5xl">
                {counters[i]}{stat.suffix}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
