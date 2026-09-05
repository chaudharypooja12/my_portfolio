"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  tags?: string[];
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: number;
}

export function Carousel({ items, autoPlay = 4000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || autoPlay <= 0) return;
    timerRef.current = setInterval(next, autoPlay);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoPlay, next]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full shrink-0 px-2 md:px-4"
            >
              <div className={`gradient-border group`}>
                <div className="relative overflow-hidden rounded-2xl bg-card/80 p-8 md:p-10">
                  {/* Background decoration */}
                  <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${item.gradient} opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-30`} />
                  <div className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr ${item.gradient} opacity-15 blur-2xl`} />

                  <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                    <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-bold md:text-3xl">{item.title}</h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      {item.tags && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full glass border border-border/50 text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_20px_oklch(0.7_0.22_280/20%)]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full glass border border-border/50 text-muted-foreground transition-all duration-300 hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_20px_oklch(0.7_0.22_280/20%)]"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current
                ? "w-8 bg-gradient-to-r from-primary to-accent"
                : "w-2 bg-muted hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
