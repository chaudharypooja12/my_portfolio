import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/modules/home/hero";
import { AboutSection } from "@/modules/about/about";
import { ExperienceSection } from "@/modules/experience/experience";
import { SkillsSection } from "@/modules/skills/skills";
import { EducationSection } from "@/modules/education/education";
import { ProjectsSection } from "@/modules/projects/projects";
import { CertificatesSection } from "@/modules/certificates/certificates";
import { AchievementsSection } from "@/modules/achievements/achievements";
import { ResumeDownload } from "@/modules/resume/resume-download";
import { StatsSection } from "@/components/portfolio/stats-counter";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsSection />
        <CertificatesSection />
        <AchievementsSection />
        <ResumeDownload />
      </main>
      <Footer />
    </>
  );
}
