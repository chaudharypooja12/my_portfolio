import {
  Code2,
  Globe,
  Database,
  AppWindow,
  Server,
  Cloud,
  Layout,
  Terminal,
  Sparkles,
  Bot,
  FileCode,
  Palette,
  Blocks,
  Globe2,
  Mail,
  Shield,
  Cpu,
  Brain,
  MessageSquare,
  Video,
  Workflow,
  Monitor,
  FileText,
  Presentation,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/sections/section-header";

const categories = [
  {
    icon: Layout,
    name: "Frontend Development",
    skills: [
      { name: "Next.js", level: 85, icon: Blocks },
      { name: "JavaScript", level: 82, icon: FileCode },
      { name: "Tailwind CSS", level: 88, icon: Palette },
      { name: "shadcn/ui", level: 80, icon: AppWindow },
      { name: "HTML", level: 90, icon: Globe },
    ],
    gradient: "from-primary to-nebula-2",
  },
  {
    icon: Server,
    name: "Backend & APIs",
    skills: [
      { name: "REST API", level: 80, icon: Server },
      { name: "Resend", level: 75, icon: Mail },
      { name: "Supabase", level: 78, icon: Database },
    ],
    gradient: "from-accent to-nebula-3",
  },
  {
    icon: Database,
    name: "Database",
    skills: [
      { name: "PostgreSQL", level: 78, icon: Database },
      { name: "SQL", level: 82, icon: Database },
      { name: "MySQL", level: 75, icon: Database },
    ],
    gradient: "from-nebula-1 to-primary",
  },
  {
    icon: Cloud,
    name: "Deployment & Cloud",
    skills: [
      { name: "Vercel", level: 85, icon: Cloud },
      { name: "GitHub", level: 80, icon: Globe2 },
    ],
    gradient: "from-nebula-2 to-accent",
  },
  {
    icon: Code2,
    name: "Programming Languages",
    skills: [
      { name: "Python", level: 85, icon: Code2 },
      { name: "C", level: 80, icon: Terminal },
      { name: "C++", level: 75, icon: Terminal },
      { name: "Visual Basic", level: 70, icon: Code2 },
    ],
    gradient: "from-nebula-3 to-nebula-1",
  },
  {
    icon: Sparkles,
    name: "AI & Automation",
    skills: [
      { name: "ChatGPT", level: 88, icon: MessageSquare },
      { name: "Claude Code", level: 85, icon: Brain },
      { name: "Gemini", level: 82, icon: Sparkles },
      { name: "Meta AI", level: 80, icon: Bot },
      { name: "AI Automation", level: 85, icon: Workflow },
    ],
    gradient: "from-primary to-nebula-3",
  },
  {
    icon: Bot,
    name: "AI Tools & IDEs",
    skills: [
      { name: "Cursor IDE", level: 88, icon: Monitor },
      { name: "OpenCode", level: 85, icon: Code2 },
      { name: "OpenAI", level: 82, icon: Cpu },
      { name: "Google Flow", level: 78, icon: Video },
    ],
    gradient: "from-accent to-primary",
  },
  {
    icon: AppWindow,
    name: "Applications & Tools",
    skills: [
      { name: "MS Office", level: 90, icon: FileText },
      { name: "VS Code", level: 88, icon: Code2 },
      { name: "Gamma (PPT)", level: 85, icon: Presentation },
      { name: "Chatbots", level: 80, icon: MessageCircle },
    ],
    gradient: "from-nebula-1 to-accent",
  },
];

const allTech = [
  "Next.js", "JavaScript", "Tailwind CSS", "shadcn/ui", "HTML",
  "REST API", "Resend", "Supabase", "PostgreSQL", "SQL", "MySQL",
  "Vercel", "GitHub", "Python", "C", "C++", "MS Office",
  "ChatGPT", "Claude Code", "Gemini", "Meta AI", "AI Automation",
  "Cursor IDE", "OpenCode", "OpenAI", "Google Flow", "Gamma", "Chatbots",
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nebula-1/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          title="Technical Skills"
          description="Technologies, tools, and frameworks I work with"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, ci) => (
            <div
              key={cat.name}
              className="gradient-border hover-lift reveal"
              style={{ transitionDelay: `${ci * 0.08}s` }}
            >
              <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient}`}
                  >
                    <cat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-base font-bold">{cat.name}</h3>
                </div>

                <div className="space-y-2.5">
                  {cat.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <skill.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">{skill.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="mt-10">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Full tech stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {allTech.map((tech, i) => (
              <Badge
                key={tech}
                variant="secondary"
                className="glass hover-lift cursor-default px-4 py-1.5 text-sm reveal"
                style={{ transitionDelay: `${i * 0.03}s` }}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
