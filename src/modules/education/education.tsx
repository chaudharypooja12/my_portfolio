import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/sections/section-header";

const education = [
  {
    degree: "M.Sc. Computer Science",
    institution: "Maharshi Dayanand University, Rohtak",
    date: "Aug 2020 – Aug 2022",
    grade: "First Division",
    description: "Advanced topics in computer science like programming languages and databases.",
    skills: ["SQL", "Python", "C/C++", "Java", "Visual Basic"],
    extraSkills: 2,
    highlight: true,
  },
  {
    degree: "B.Sc. (General)",
    institution: "Maharshi Dayanand University, Rohtak",
    date: "Aug 2016 – Jun 2019",
    grade: "First Division",
    description: "Foundational knowledge across various science subjects rather than specializing in a single field.",
    skills: ["Analytical Skills", "Problem Solving"],
    extraSkills: 3,
    highlight: false,
  },
  {
    degree: "12th, Computer Science",
    institution: "Ganga International School",
    date: "Jun 2015 – Mar 2016",
    grade: "First Division",
    description: "Higher secondary education with Computer Science specialization.",
    skills: ["Physics", "Chemistry", "Maths", "Computer Science"],
    highlight: false,
  },
  {
    degree: "10th",
    institution: "Ganga International School",
    date: "Jun 2013 – Mar 2014",
    grade: "First Division",
    description: "Secondary education with comprehensive curriculum.",
    skills: ["Hindi", "English", "Maths", "Social Science", "Science"],
    highlight: false,
  },
];

export function EducationSection() {
  return (
    <section id="education" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nebula-2/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-3xl">
        <SectionHeader
          title="Education"
          description="Academic qualifications and certifications"
        />

        <div className="relative space-y-8">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-primary/50" />

          {education.map((edu, i) => (
            <div key={edu.degree + edu.institution} className="relative md:ml-16 reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
              {/* Timeline dot */}
              <div
                className={`absolute -left-[calc(1.5rem+3px)] top-8 hidden h-3 w-3 rounded-full md:block ${
                  edu.highlight
                    ? "bg-primary shadow-[0_0_20px_oklch(0.7_0.22_280/70%)]"
                    : "bg-accent shadow-[0_0_15px_oklch(0.72_0.2_180/50%)]"
                }`}
              />

              <div className="gradient-border hover-lift">
                <div className="relative rounded-[var(--radius-xl)] bg-card/80 p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                      edu.highlight ? "from-primary to-nebula-2" : "from-accent to-nebula-3"
                    }`}>
                      {edu.highlight ? (
                        <GraduationCap className="h-6 w-6 text-primary-foreground" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.description && (
                        <p className="mt-2 text-sm text-muted-foreground/80">{edu.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className={`${
                          edu.highlight ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                        }`}>
                          {edu.date}
                        </Badge>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          <Award className="mr-1 h-3 w-3" />
                          {edu.grade}
                        </Badge>
                      </div>
                      {edu.skills && edu.skills.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Skills:</span>{" "}
                            {edu.skills.join(", ")}
                            {edu.extraSkills ? `, +${edu.extraSkills} skills` : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
