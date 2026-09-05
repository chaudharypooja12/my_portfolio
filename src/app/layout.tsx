import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Starfield } from "@/components/layout/starfield";
import { NebulaBackground } from "@/components/layout/nebula";
import { SkyBackground } from "@/components/layout/sky-background";
import { CursorGlow } from "@/components/layout/cursor-glow";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pooja | Computer Science Teacher & Developer",
  description:
    "Personal portfolio of Pooja — M.Sc. Computer Science post-graduate and CS teacher with experience in Python, C/C++, SQL, and web technologies.",
  keywords: [
    "Pooja",
    "Computer Science Teacher",
    "Portfolio",
    "Python",
    "C++",
    "SQL",
    "Web Development",
  ],
  authors: [{ name: "Pooja" }],
  openGraph: {
    title: "Pooja | Computer Science Teacher & Developer",
    description:
      "Personal portfolio of Pooja — M.Sc. Computer Science post-graduate and CS teacher.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col cursor-glow">
        <ThemeProvider>
          <Starfield />
          <NebulaBackground />
          <SkyBackground />
          <CursorGlow />
          <ScrollReveal />
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
