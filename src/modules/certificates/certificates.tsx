import { Award, Shield } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";

const certificates = [
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
            <div
              key={cert.title}
              className="gradient-border hover-lift reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="relative flex items-start gap-4 rounded-[var(--radius-xl)] bg-card/80 p-6">
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
          ))}
        </div>
      </div>
    </section>
  );
}
