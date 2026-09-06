"use client";

import Image from "next/image";
import { ArrowDown, Sparkles, Code2, GraduationCap, Globe } from "lucide-react";
import { Typewriter } from "@/components/portfolio/typewriter";
import { useMounted } from "@/hooks/use-mounted";

export function HeroSection() {
  const mounted = useMounted();

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden section-padding"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 via-nebula-2/15 to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-accent/20 via-nebula-3/15 to-transparent blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-nebula-1/10 via-nebula-2/10 to-nebula-3/10 blur-3xl animate-spin-slow" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Profile Image */}
        <div
          className={`mx-auto mb-8 transition-all duration-1000 ${
            mounted
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90"
          }`}
        >
          <div className="relative mx-auto h-40 w-40 md:h-48 md:w-48">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-nebula-2 to-accent animate-spin-slow opacity-60 blur-md" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-nebula-2 to-accent animate-spin-slow" />
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-background">
              <Image
                src="/images/Pooja-without-bg.png"
                alt="Pooja - Computer Science Teacher"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`glass-strong mx-auto mb-10 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-1000 delay-200 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="text-muted-foreground">Available for opportunities</span>
        </div>

        {/* Main heading */}
        <h1
          className={`font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-1000 delay-300 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-foreground">Hi, I&apos;m </span>
          <span className="gradient-text text-glow">Pooja</span>
        </h1>

        {/* Typewriter subtitle */}
        <div
          className={`mt-6 flex items-center justify-center gap-3 transition-all duration-1000 delay-500 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <p className="text-xl md:text-2xl font-medium">
            <Typewriter />
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Description */}
        <p
          className={`mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg transition-all duration-1000 delay-[600ms] ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          M.Sc. Computer Science post-graduate passionate about teaching and
          technology. Skilled in Next.js, JavaScript, Tailwind CSS, PostgreSQL,
          and modern web development. Dedicated to delivering engaging CS
          education and building practical software solutions.
        </p>

        {/* Feature tags */}
        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-1000 delay-700 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { icon: GraduationCap, label: "M.Sc. Computer Science" },
            { icon: Code2, label: "Next.js & JavaScript" },
            { icon: Globe, label: "Full Stack Development" },
          ].map((tag) => (
            <div
              key={tag.label}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground hover-lift"
            >
              <tag.icon className="h-4 w-4 text-primary" />
              {tag.label}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          className={`mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-1000 delay-[800ms] ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#projects"
            className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.7_0.22_280/40%)] hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-nebula-2 to-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Sparkles className="relative h-4 w-4" />
            <span className="relative">View My Work</span>
          </a>
          <a
            href="#contact"
            className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl border border-border bg-background/50 px-7 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_oklch(0.7_0.22_280/15%)] hover:scale-105"
          >
            <span className="relative">Contact Me</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-20 transition-all duration-1000 delay-1000 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="group inline-flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
