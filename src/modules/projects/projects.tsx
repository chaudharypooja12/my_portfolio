"use client";

import { useState, type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  DollarSign,
  Gamepad2,
  Layout,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import portfolioData from "@/data/portfolio.json";
import { SnakeGame } from "@/modules/projects/games/snake";
import { SpaceshipGame } from "@/modules/projects/games/spaceship";
import { TicTacToeGame } from "@/modules/projects/games/tic-tac-toe";
import { cn } from "@/lib/utils";

type ProjectId =
  | "portfolio"
  | "attendance"
  | "banking"
  | "education"
  | "tic-tac-toe"
  | "snake"
  | "spaceship";

type GameProjectId = "tic-tac-toe" | "snake" | "spaceship";
type StandardProjectId = Exclude<ProjectId, GameProjectId>;

type PortfolioProject = {
  id: ProjectId;
  title: string;
  description: string;
  tags: string[];
};

type GameComponent = ComponentType<Record<string, never>>;

type ProjectBase = PortfolioProject & {
  icon: LucideIcon;
  gradient: string;
  eyebrow: string;
};

type StandardProject = Omit<ProjectBase, "id"> & {
  id: StandardProjectId;
  kind: "standard";
  highlights: readonly string[];
};

type GameProject = Omit<ProjectBase, "id"> & {
  id: GameProjectId;
  kind: "game";
  component: GameComponent;
  dialogDescription: string;
  rulesSummary: string;
  levels: readonly string[];
  controls: readonly string[];
};

type ProjectCard = StandardProject | GameProject;

const portfolioProjects = portfolioData.projects as readonly PortfolioProject[];

function assertNever(value: never): never {
  throw new Error(`Unhandled project id: ${value}`);
}

const projectCards = portfolioProjects.map<ProjectCard>((project) => {
  switch (project.id) {
    case "portfolio":
      return {
        ...project,
        id: "portfolio",
        kind: "standard",
        icon: Layout,
        gradient: "from-primary to-nebula-2",
        eyebrow: "Flagship build",
        highlights: [
          "Cosmic glassmorphism interface with animated effects.",
          "Accessible light and dark themes with responsive layouts.",
        ],
      };
    case "attendance":
      return {
        ...project,
        id: "attendance",
        kind: "standard",
        icon: Users,
        gradient: "from-accent to-nebula-3",
        eyebrow: "Operations workflow",
        highlights: [
          "Employee attendance tracking designed for daily usage.",
          "Reporting-focused experience for quick review and follow-up.",
        ],
      };
    case "banking":
      return {
        ...project,
        id: "banking",
        kind: "standard",
        icon: DollarSign,
        gradient: "from-nebula-1 to-primary",
        eyebrow: "Core application",
        highlights: [
          "Supports account opening and balance enquiry journeys.",
          "Built around clear data entry and account visibility flows.",
        ],
      };
    case "education":
      return {
        ...project,
        id: "education",
        kind: "standard",
        icon: BookOpen,
        gradient: "from-nebula-2 to-accent",
        eyebrow: "Teaching practice",
        highlights: [
          "Hands-on curriculum design for practical computer science learning.",
          "Regular assessments and mentoring to reinforce problem solving.",
        ],
      };
    case "tic-tac-toe":
      return {
        ...project,
        id: "tic-tac-toe",
        kind: "game",
        icon: Brain,
        gradient: "from-primary to-accent",
        eyebrow: "Interactive game",
        component: TicTacToeGame,
        dialogDescription:
          "Strategy duel against the computer with persistent score tracking and accessible play.",
        rulesSummary:
          "Place three marks in a row before the computer does, and keep the match score climbing.",
        levels: [
          "Easy: random legal moves for a relaxed round.",
          "Medium: tactical responses mixed with unpredictability.",
          "Hard: optimal minimax play for a serious challenge.",
        ],
        controls: [
          "Mouse, touch, or keyboard-friendly board interaction.",
          "New round preserves match score until you restart the match.",
        ],
      };
    case "snake":
      return {
        ...project,
        id: "snake",
        kind: "game",
        icon: Gamepad2,
        gradient: "from-accent to-nebula-1",
        eyebrow: "Interactive game",
        component: SnakeGame,
        dialogDescription:
          "Responsive arcade run with local high-score tracking, touch support, and escalating pace.",
        rulesSummary:
          "Collect food, grow longer, avoid walls and your own tail, and survive the speed increase.",
        levels: [
          "Level increases every 4 food pickups.",
          "Game speed accelerates as levels rise.",
          "Score gains scale with the current level.",
        ],
        controls: [
          "Arrow keys or WASD for keyboard play.",
          "On-screen touch pad for phones and tablets.",
          "Pause and resume without losing the current run.",
        ],
      };
    case "spaceship":
      return {
        ...project,
        id: "spaceship",
        kind: "game",
        icon: Rocket,
        gradient: "from-nebula-2 to-primary",
        eyebrow: "Interactive game",
        component: SpaceshipGame,
        dialogDescription:
          "Asteroid-dodging survival challenge with persistent best results and responsive controls.",
        rulesSummary:
          "Dodge incoming asteroids, protect your three lives, and stay alive long enough to reach higher levels.",
        levels: [
          "Advance one level every 15 seconds survived.",
          "Asteroid speed and spawn pressure intensify up to level 10.",
          "Short post-hit shield windows create recovery opportunities.",
        ],
        controls: [
          "Arrow keys or WASD to move the ship.",
          "Touch pad controls work for mobile play.",
          "Pause and resume to manage longer survival attempts.",
        ],
      };
    default:
      return assertNever(project.id);
  }
});

const featuredProjects = projectCards.filter(
  (project): project is StandardProject => project.kind === "standard",
);

const gameProjects = projectCards.filter(
  (project): project is GameProject => project.kind === "game",
);

function renderTagGroup(tags: readonly string[]) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="glass border border-glass-border/50 px-3 py-1 text-[0.72rem] tracking-wide text-muted-foreground"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

export function ProjectsSection() {
  const [selectedGameId, setSelectedGameId] = useState<GameProjectId | null>(null);

  const selectedGame =
    selectedGameId === null
      ? null
      : gameProjects.find((project) => project.id === selectedGameId) ?? null;

  const SelectedGameComponent = selectedGame?.component;

  return (
    <section id="projects" className="relative section-padding">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-nebula-3/3 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          title="Projects & Work"
          description="Responsive product builds, teaching work, and playable experiments presented in one polished showcase"
        />

        <div className="space-y-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-nebula-2 shadow-lg">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                  Featured builds
                </h3>
                <p className="text-sm text-muted-foreground">
                  The four original portfolio entries remain visible as polished glass cards.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {featuredProjects.map((project, index) => {
                const Icon = project.icon;

                return (
                  <article
                    key={project.id}
                    className="gradient-border hover-lift reveal h-full"
                    style={{ transitionDelay: `${index * 0.08}s` }}
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] bg-card/80 p-6">
                      <div
                        className={cn(
                          "absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
                          project.gradient,
                        )}
                      />
                      <div
                        className={cn(
                          "absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-gradient-to-br opacity-15 blur-2xl",
                          project.gradient,
                        )}
                      />

                      <div className="relative flex h-full flex-col gap-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                              {project.eyebrow}
                            </p>
                            <h4 className="mt-2 font-heading text-xl font-bold text-foreground">
                              {project.title}
                            </h4>
                          </div>
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                              project.gradient,
                            )}
                          >
                            <Icon className="h-5 w-5 text-primary-foreground" />
                          </div>
                        </div>

                        <p className="relative text-sm leading-7 text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="grid gap-3 text-sm text-muted-foreground">
                          {project.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="glass flex items-start gap-3 rounded-2xl px-4 py-3"
                            >
                              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto pt-2">{renderTagGroup(project.tags)}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-nebula-1 shadow-lg">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                  Playable project demos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Open each game in a focused dialog so only the selected experience mounts and runs.
                </p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              {gameProjects.map((project, index) => {
                const Icon = project.icon;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedGameId(project.id)}
                    aria-haspopup="dialog"
                    aria-label={`Play ${project.title}`}
                    className="group gradient-border hover-lift reveal h-full rounded-[calc(var(--radius-xl)+2px)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                    style={{ transitionDelay: `${index * 0.08}s` }}
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] bg-card/80 p-6">
                      <div
                        className={cn(
                          "absolute -right-14 -top-14 h-32 w-32 rounded-full bg-gradient-to-br opacity-25 blur-3xl transition-transform duration-500 group-hover:scale-110",
                          project.gradient,
                        )}
                      />

                      <div className="relative flex h-full flex-col gap-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                              {project.eyebrow}
                            </p>
                            <h4 className="mt-2 font-heading text-2xl font-bold text-foreground">
                              {project.title}
                            </h4>
                          </div>
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                              project.gradient,
                            )}
                          >
                            <Icon className="h-5 w-5 text-primary-foreground" />
                          </div>
                        </div>

                        <p className="text-sm leading-7 text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="glass rounded-2xl p-4">
                          <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                            Rules summary
                          </p>
                          <p className="mt-2 text-sm leading-6 text-foreground/90">
                            {project.rulesSummary}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="glass rounded-2xl p-4">
                            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                              Levels
                            </p>
                            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                              {project.levels.map((level) => (
                                <li key={level} className="flex gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                                  <span>{level}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="glass rounded-2xl p-4">
                            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                              Controls
                            </p>
                            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                              {project.controls.map((control) => (
                                <li key={control} className="flex gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                                  <span>{control}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground">
                          <span className="inline-flex items-center gap-2">
                            <Gamepad2 className="h-4 w-4" />
                            Play Game
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </div>

                        <div>{renderTagGroup(project.tags)}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={selectedGame !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGameId(null);
          }
        }}
      >
        <DialogContent className="max-h-[92dvh] max-w-5xl border-glass-border/70 bg-background/95 p-0 backdrop-blur-xl">
          {selectedGame && SelectedGameComponent ? (
            <>
              <DialogHeader className="bg-gradient-to-r from-background via-background/95 to-background/90">
                <DialogTitle>{selectedGame.title}</DialogTitle>
                <DialogDescription>{selectedGame.dialogDescription}</DialogDescription>
              </DialogHeader>

              <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                <SelectedGameComponent />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
