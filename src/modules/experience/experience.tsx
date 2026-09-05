import {
  Calendar,
  Building2,
  BookOpen,
  Users,
  ClipboardCheck,
  Lightbulb,
  RefreshCw,
  Handshake,
  Briefcase,
  Code2,
  Laptop,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/sections/section-header";

const experiences = [
  {
    role: "Coding Teacher",
    company: "Codingal",
    date: "April 2024 – Present",
    current: true,
    responsibilities: [
      "Teaching C++, Python, and JavaScript to students",
      "Developing engaging coding curriculum",
      "Mentoring students in problem-solving",
      "Conducting interactive coding sessions",
    ],
  },
  {
    role: "Technical Consultant (Freelancer)",
    company: "Self-Employed",
    date: "March 2024 – Present",
    current: true,
    responsibilities: [
      "Built multiple projects in Python and Next.js",
      "Provided technical consulting to clients",
      "Developed full-stack web applications",
      "Implemented RESTful APIs and database solutions",
    ],
  },
  {
    role: "Teacher — Computer Science",
    company: "GD Goenka Public School, Jhajjar",
    date: "April 2023 – March 2024",
    current: false,
    responsibilities: [
      "Developed and delivered Computer Science lessons",
      "Implemented innovative teaching methodologies",
      "Facilitated hands-on learning",
      "Conducted regular assessments",
      "Adjusted teaching strategies per student understanding",
      "Collaborated with colleagues on extracurricular activities",
    ],
  },
];

const roleIcons = [
  { icon: Code2, label: "Coding Teacher" },
  { icon: Laptop, label: "Technical Consultant" },
  { icon: Briefcase, label: "Teacher" },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          title="Experience"
          description="Professional teaching and consulting experience"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-primary/50 hidden md:block" />

          {experiences.map((exp, i) => {
            const RoleIcon = roleIcons[i]?.icon || Briefcase;
            return (
              <div key={exp.role + exp.company} className="relative md:ml-16 mb-8 last:mb-0 reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                {/* Timeline dot */}
                <div className={`absolute -left-[calc(1.5rem+3px)] top-8 hidden h-3 w-3 rounded-full md:block ${
                  exp.current
                    ? "bg-primary shadow-[0_0_15px_oklch(0.7_0.22_280/60%)]"
                    : "bg-accent shadow-[0_0_15px_oklch(0.72_0.2_180/50%)]"
                }`} />

                <div className="gradient-border hover-lift">
                  <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-6 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                            exp.current ? "from-primary to-nebula-2" : "from-accent to-nebula-3"
                          }`}>
                            <RoleIcon className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-heading text-xl font-bold">{exp.role}</h3>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary" className={`${
                            exp.current ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                          }`}>
                            {exp.date}
                          </Badge>
                          {exp.current && (
                            <Badge variant="secondary" className="bg-success/10 text-success">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                        Key Responsibilities
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {exp.responsibilities.map((r, j) => (
                          <div
                            key={r}
                            className="glass flex items-start gap-3 rounded-xl p-3 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                            style={{ transitionDelay: `${j * 0.08}s` }}
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <Lightbulb className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground leading-relaxed">
                              {r}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
