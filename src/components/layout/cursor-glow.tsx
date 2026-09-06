"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

export function CursorGlow() {
  const { theme } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || theme !== "dark") return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotEl = dot;
    const ringEl = ring;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotEl.style.left = `${mouseX - 4}px`;
      dotEl.style.top = `${mouseY - 4}px`;
      setVisible(true);
    }

    function onMouseEnter() {
      setVisible(true);
    }

    function onMouseLeave() {
      setVisible(false);
    }

    let rafId: number;
    function animate() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ringEl.style.left = `${ringX - 20}px`;
      ringEl.style.top = `${ringY - 20}px`;
      rafId = requestAnimationFrame(animate);
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']")
      ) {
        ringEl.classList.add("hovering");
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']")
      ) {
        ringEl.classList.remove("hovering");
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, [mounted, theme]);

  if (!mounted || theme !== "dark") return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot hidden md:block"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className="cursor-ring hidden md:block"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
}
