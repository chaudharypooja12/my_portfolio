"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#certificates", label: "Certificates" },
  { href: "#achievements", label: "Achievements" },
  { href: "#resume", label: "Resume" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-nebula-2 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold"
          aria-label="Pooja - Home"
        >
          <Sparkles className="h-5 w-5 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="gradient-text">Pooja</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border/50 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg font-bold">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="gradient-text">Pooja</span>
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link, i) => {
                    const isActive = activeSection === link.href.replace("#", "");
                    return (
                      <li
                        key={link.href}
                        className="animate-[slideUp_0.3s_ease-out_forwards] opacity-0"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
