import {
  Users,
  DollarSign,
  BookOpen,
  Award,
  Globe,
  Layout,
  Mail,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import { Carousel } from "@/components/portfolio/carousel";

const projectItems = [
  {
    title: "Portfolio Website",
    description:
      "A cosmic galaxy-themed personal portfolio built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui. Features animated starfield canvas, glassmorphism UI, typewriter effects, auto-scrolling carousel, and scroll-triggered animations. Deployed on Vercel.",
    icon: <Layout className="h-8 w-8 text-primary-foreground" />,
    gradient: "from-primary to-nebula-2",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Vercel"],
  },
  {
    title: "Attendance Management System",
    description:
      "An attendance management system developed to efficiently manage employee attendance. Streamlines tracking and reporting for organizational use.",
    icon: <Users className="h-8 w-8 text-primary-foreground" />,
    gradient: "from-accent to-nebula-3",
    tags: ["Employee Tracking", "Management System", "Reporting"],
  },
  {
    title: "Banking Application",
    description:
      "A banking application implementing core financial features for account management including account opening and balance enquiry.",
    icon: <DollarSign className="h-8 w-8 text-primary-foreground" />,
    gradient: "from-nebula-1 to-primary",
    tags: ["Account Opening", "Balance Enquiry", "Financial"],
  },
  {
    title: "CS Education & Teaching",
    description:
      "Developed and delivered comprehensive Computer Science curriculum with innovative teaching methodologies, hands-on learning, and regular assessments for students.",
    icon: <BookOpen className="h-8 w-8 text-primary-foreground" />,
    gradient: "from-nebula-2 to-accent",
    tags: ["Curriculum Design", "Teaching", "Student Engagement"],
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nebula-3/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeader
          title="Projects & Work"
          description="Web development projects, academic work, and teaching contributions"
        />

        <Carousel items={projectItems} autoPlay={5000} />
      </div>
    </section>
  );
}
