"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

export function SkyBackground() {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted || theme !== "light") return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Soft gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8faff] via-[#f0f4ff] to-[#eef2ff]" />

      {/* Subtle gradient orbs - professional feel */}
      <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/5 via-accent/3 to-transparent blur-3xl animate-float" />
      <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-accent/4 via-nebula-3/3 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-nebula-1/3 via-nebula-2/2 to-nebula-3/3 blur-3xl animate-spin-slow opacity-50" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.50 0.20 275 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.50 0.20 275 / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative floating shapes */}
      <div className="absolute top-20 right-[15%] h-2 w-2 rounded-full bg-primary/20 animate-float" />
      <div className="absolute top-40 left-[10%] h-1.5 w-1.5 rounded-full bg-accent/25 animate-float-slow" />
      <div className="absolute top-60 right-[25%] h-1 w-1 rounded-full bg-nebula-2/20 animate-float-delayed" />
      <div className="absolute bottom-40 left-[20%] h-2.5 w-2.5 rounded-full bg-primary/15 animate-float" />
      <div className="absolute bottom-60 right-[12%] h-1.5 w-1.5 rounded-full bg-accent/20 animate-float-slow" />
    </div>
  );
}
