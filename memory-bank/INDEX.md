# Index — Pooja Portfolio Memory Bank

Entry point for all agent tasks. Read this first.

## Files

| File | Purpose |
|---|---|
| [PRD.md](./PRD.md) | Requirements, features, resume content, acceptance criteria |
| [DESIGN.md](./DESIGN.md) | Colors, typography, glassmorphism, animations, responsive |
| [TECH_STACK.md](./TECH_STACK.md) | Architecture, dependencies, project structure, deployment |
| [AGENT.md](./AGENT.md) | Agent workflow and rules |
| [RECENT_CHANGES.md](./RECENT_CHANGES.md) | Change log |

## Modules

| Module | File | Source |
|---|---|---|
| Home/Hero | [modules/home.md](./modules/home.md) | `src/modules/home/hero.tsx` |
| About | [modules/about.md](./modules/about.md) | `src/modules/about/about.tsx` |
| Experience | [modules/experience.md](./modules/experience.md) | `src/modules/experience/experience.tsx` |
| Skills | [modules/skills.md](./modules/skills.md) | `src/modules/skills/skills.tsx` |
| Education | [modules/education.md](./modules/education.md) | `src/modules/education/education.tsx` |
| Projects | [modules/projects.md](./modules/projects.md) | `src/modules/projects/projects.tsx` |
| Certificates | [modules/certificates.md](./modules/certificates.md) | `src/modules/certificates/certificates.tsx` |
| Achievements | [modules/achievements.md](./modules/achievements.md) | `src/modules/achievements/achievements.tsx` |
| Resume | [modules/resume.md](./modules/resume.md) | `src/modules/resume/resume-download.tsx` |
| Contact | [modules/contact.md](./modules/contact.md) | `src/app/api/contact/route.ts` (hidden from page) |

## Current State

All portfolio sections are implemented with light/dark theme support. Projects
now includes four professional work cards and three playable game demos in
accessible dialogs. The repository ships a generated two-page ATS resume at
`public/Pooja_Resume.pdf`; regenerate it with `npm run resume:generate` after
editing `src/data/portfolio.json`.

## Shared Sources

| Source | Purpose |
|---|---|
| `src/data/portfolio.json` | Structured profile, resume, and project content |
| `scripts/generate-resume.mjs` | Deterministic two-page PDF generation |
| `src/components/ui/dialog.tsx` | Accessible game dialog primitive |
| `src/modules/projects/games/` | Tic-tac-toe, Snake, and Spaceship Survival |
