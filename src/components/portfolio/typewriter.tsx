"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  "Computer Science Teacher",
  "Next.js Developer",
  "Full Stack Developer",
  "JavaScript Developer",
  "React & Tailwind Expert",
  "PostgreSQL Developer",
  "Vercel Deployment Pro",
];

export function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (!isDeleting && text === currentWord) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && text === "") {
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 200);
    } else {
      const speed = isDeleting ? 40 : 80;

      timeoutRef.current = setTimeout(() => {
        setText(
          isDeleting
            ? currentWord.substring(0, text.length - 1)
            : currentWord.substring(0, text.length + 1)
        );
      }, speed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isDeleting, wordIndex]);

  return (
    <span className="gradient-text">
      {text}
      <span className="ml-0.5 inline-block h-[1.1em] w-[3px] animate-pulse bg-primary align-middle" />
    </span>
  );
}
