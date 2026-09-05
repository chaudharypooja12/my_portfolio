"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function NebulaBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || theme !== "dark") return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Large purple nebula */}
      <div
        className="nebula-blob"
        style={{
          width: "600px",
          height: "600px",
          top: "-10%",
          right: "-10%",
          background: "radial-gradient(circle, oklch(0.5 0.25 280 / 40%), transparent 70%)",
          "--drift-duration": "25s",
          "--drift-delay": "0s",
        } as React.CSSProperties}
      />

      {/* Pink nebula */}
      <div
        className="nebula-blob"
        style={{
          width: "500px",
          height: "500px",
          bottom: "10%",
          left: "-5%",
          background: "radial-gradient(circle, oklch(0.55 0.25 330 / 35%), transparent 70%)",
          "--drift-duration": "30s",
          "--drift-delay": "5s",
        } as React.CSSProperties}
      />

      {/* Teal nebula */}
      <div
        className="nebula-blob"
        style={{
          width: "400px",
          height: "400px",
          top: "40%",
          left: "50%",
          background: "radial-gradient(circle, oklch(0.5 0.2 180 / 30%), transparent 70%)",
          "--drift-duration": "20s",
          "--drift-delay": "10s",
        } as React.CSSProperties}
      />

      {/* Small accent blob */}
      <div
        className="nebula-blob"
        style={{
          width: "300px",
          height: "300px",
          top: "20%",
          left: "20%",
          background: "radial-gradient(circle, oklch(0.6 0.2 145 / 25%), transparent 70%)",
          "--drift-duration": "22s",
          "--drift-delay": "3s",
        } as React.CSSProperties}
      />

      {/* Aurora wave overlay */}
      <div className="aurora-wave" />
    </div>
  );
}
