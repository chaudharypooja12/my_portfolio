import { Trophy, Star, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";

export function AchievementsSection() {
  return (
    <section id="achievements" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-nebula-1/3 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-3xl">
        <SectionHeader
          title="Achievements"
          description="Academic and professional recognitions"
        />

        <div className="gradient-border hover-lift animate-pulse-glow reveal">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-card/80 p-8 md:p-10">
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-nebula-2/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-accent/20 to-nebula-3/20 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-nebula-2 to-accent">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <h3 className="font-heading text-2xl font-bold">Dean&apos;s List</h3>
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  Recognized for outstanding academic performance in M.Sc.
                  Computer Science at Maharshi Dayanand University, Rohtak.
                  Demonstrated exceptional dedication to academic excellence
                  and technical mastery.
                </p>
                <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Academic Excellence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
