import {
  GraduationCap,
  Lightbulb,
  Users,
  BookOpen,
  Target,
  Handshake,
  Zap,
  Brain,
  Code2,
  Globe,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";

const strengths = [
  { icon: Lightbulb, label: "Problem Solving", color: "from-primary/20 to-nebula-2/20" },
  { icon: Target, label: "Analytical Thinking", color: "from-accent/20 to-nebula-3/20" },
  { icon: Users, label: "Communication", color: "from-nebula-1/20 to-primary/20" },
  { icon: Handshake, label: "Adaptability", color: "from-nebula-2/20 to-accent/20" },
  { icon: BookOpen, label: "Teaching Methods", color: "from-nebula-3/20 to-nebula-1/20" },
  { icon: GraduationCap, label: "CS Curriculum", color: "from-primary/20 to-accent/20" },
  { icon: Brain, label: "Critical Thinking", color: "from-accent/20 to-nebula-1/20" },
  { icon: Zap, label: "Quick Learner", color: "from-nebula-1/20 to-nebula-2/20" },
  { icon: Code2, label: "Full Stack Dev", color: "from-primary/20 to-nebula-3/20" },
  { icon: Globe, label: "Web Technologies", color: "from-nebula-2/20 to-primary/20" },
];

const techHighlights = [
  "Next.js", "JavaScript", "Tailwind CSS", "shadcn/ui",
  "PostgreSQL", "Supabase", "REST API", "Resend", "Vercel",
];

export function AboutSection() {
  return (
    <section id="about" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          title="About Me"
          description="A dedicated Computer Science educator with strong full-stack development skills"
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Main card */}
          <div className="lg:col-span-3 gradient-border hover-lift">
            <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-nebula-2">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold">Professional Summary</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                M.Sc. Computer Science post-graduate with hands-on teaching experience
                and modern web development skills. Proficient in Next.js, JavaScript,
                Tailwind CSS, shadcn/ui, PostgreSQL, Supabase, REST APIs, and
                Resend for email services. Experienced in deploying applications
                on Vercel with Git-based workflows. Passionate about delivering
                engaging Computer Science education and building practical,
                production-ready software solutions.
              </p>

              <div className="mt-8">
                <h4 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  Education
                </h4>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">M.Sc. Computer Science</p>
                      <p className="text-sm text-muted-foreground">
                        Maharshi Dayanand University, Rohtak — August 2022
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech highlights */}
              <div className="mt-6">
                <h4 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techHighlights.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Strengths grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {strengths.map((s, i) => (
              <div
                key={s.label}
                className="gradient-border hover-lift reveal"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="relative flex flex-col items-center gap-2 rounded-[var(--radius-xl)] bg-card/60 p-3 text-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${s.color}`}>
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium leading-tight text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
