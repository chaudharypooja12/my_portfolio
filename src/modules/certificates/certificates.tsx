"use client";

import Image from "next/image";
import { Award, ZoomIn } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Certificate {
  title: string;
  description: string;
  gradient: string;
  imageSrc?: string;
  imageAlt?: string;
}

const certificates: Certificate[] = [
  {
    title: "NSS Certificate",
    description:
      "National Service Scheme certification for community service and social responsibility.",
    gradient: "from-primary to-nebula-2",
  },
  {
    title: "Data Analysis and Visualization",
    description:
      "Certification in data analysis and visualization techniques.",
    gradient: "from-accent to-nebula-3",
  },
  {
    title: "Python for Data Science",
    description:
      "Certification in Python programming fundamentals for data science.",
    gradient: "from-nebula-3 to-primary",
    imageSrc: "/images/certificates/python-for-data-science-certificate.jpg",
    imageAlt: "Python for Data Science certificate",
  },
  {
    title: "SQL for Data Science",
    description: "Certification in SQL for querying and analyzing data.",
    gradient: "from-nebula-2 to-accent",
    imageSrc: "/images/certificates/sql-for-data-science-certificate.jpg",
    imageAlt: "SQL for Data Science certificate",
  },
];

export function CertificatesSection() {
  return (
    <section id="certificates" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          title="Certificates"
          description="Professional certifications and recognitions"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((cert, i) => (
            <Dialog key={cert.title}>
              <div
                className="group gradient-border hover-lift reveal overflow-hidden"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className="relative flex flex-col rounded-[var(--radius-xl)] bg-card/80">
                  {cert.imageSrc && (
                    <DialogTrigger
                      aria-label={`View ${cert.title} certificate`}
                      className="relative aspect-video w-full overflow-hidden border-b border-glass-border/60 bg-muted"
                    >
                      <Image
                        src={cert.imageSrc}
                        alt={cert.imageAlt ?? cert.title}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 2rem), 50vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                        <span className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold">
                          <ZoomIn className="h-4 w-4" />
                          View Certificate
                        </span>
                      </div>
                    </DialogTrigger>
                  )}

                  <div className="relative flex items-start gap-4 p-6">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cert.gradient}`}>
                      <Award className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold">{cert.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {cert.imageSrc && (
                <DialogContent className="max-w-3xl border-glass-border/70 bg-background/98 p-0 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>{cert.title}</DialogTitle>
                    <DialogDescription>{cert.description}</DialogDescription>
                  </DialogHeader>
                  <div className="relative aspect-[4/3] w-full sm:aspect-video">
                    <Image
                      src={cert.imageSrc}
                      alt={cert.imageAlt ?? cert.title}
                      fill
                      sizes="(max-width: 1023px) calc(100vw - 2rem), 48rem"
                      className="object-contain p-4"
                    />
                  </div>
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
