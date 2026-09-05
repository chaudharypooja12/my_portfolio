"use client";

import { Download, FileText } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";

export function ResumeDownload() {
  return (
    <section id="resume" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-2xl">
        <SectionHeader
          title="Download Resume"
          description="Get a copy of my ATS-friendly resume"
        />

        <div className="gradient-border hover-lift">
          <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-nebula-2 animate-float">
                <FileText className="h-8 w-8 text-primary-foreground" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold">
                  Pooja&apos;s Resume
                </h3>
                <p className="mt-2 text-muted-foreground">
                  M.Sc. Computer Science | CS Teacher & Developer
                </p>
              </div>

              <a
                href="/Pooja_Resume.pdf"
                download="Pooja_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-primary px-8 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_20px_oklch(0.7_0.22_280/40%)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-nebula-2 to-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Download className="relative h-5 w-5" />
                <span className="relative">Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
