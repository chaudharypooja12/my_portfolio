# PRD — Pooja Portfolio

## Project Identity

- **Product Name:** Pooja
- **Product Type:** Personal portfolio website
- **Architecture:** Next.js 16 + React 19 + TypeScript 5
- **Design System:** Cosmic galaxy theme with glassmorphism
- **Themes:** Light default + dark mode
- **Deployment:** Vercel
- **Repository:** https://github.com/chaudharypooja12/my_portfolio

## Purpose

Present Pooja Chaudhary as a Computer Science teacher and full-stack developer
through a polished portfolio, a downloadable ATS-friendly resume, and a projects
section that now includes playable demos alongside professional work.

## Authoritative Sources

- Structured profile and resume data: `src/data/portfolio.json`
- Projects section shell and dialog launcher: `src/modules/projects/projects.tsx`
- Playable games:
  - `src/modules/projects/games/tic-tac-toe/tic-tac-toe-game.tsx`
  - `src/modules/projects/games/snake/snake-game.tsx`
  - `src/modules/projects/games/spaceship/spaceship-game.tsx`
- Resume download UI: `src/modules/resume/resume-download.tsx`
- Resume generator: `scripts/generate-resume.mjs`

## Content Rules

1. Resume and project facts must match `src/data/portfolio.json` or the cited source file.
2. Do not invent technologies for the non-portfolio resume projects.
3. `Pooja_Resume.pdf` is generated and present; do not document a manual `resume.pdf` step.
4. Playable game behavior must match the in-repo implementations, including dialog, rules, controls, and persistence.
5. No emojis/emoticons in UI; use Lucide React icons.

## Authoritative Projects

| ID | Title | Surface | Authoritative Description |
|---|---|---|---|
| `portfolio` | Portfolio Website | Featured build card | Cosmic galaxy-themed responsive portfolio with animated visual effects, accessible UI, light and dark themes, and Vercel deployment. |
| `attendance` | Attendance Management System | Featured build card | Application for efficiently tracking and reporting employee attendance. |
| `banking` | Banking Application | Featured build card | Account management application with account opening and balance enquiry features. |
| `education` | CS Education & Teaching | Featured build card | Computer Science curriculum and hands-on learning experiences with regular assessments and student mentoring. |
| `tic-tac-toe` | Tic-tac-toe | Playable dialog demo | Human-versus-computer strategy game with three AI difficulty levels, round scoring, and accessible keyboard play. |
| `snake` | Snake | Playable dialog demo | Responsive arcade game with food collection, snake growth, progressive speed levels, keyboard and touch controls. |
| `spaceship` | Spaceship Survival | Playable dialog demo | Asteroid-dodging survival game with lives, escalating levels, responsive controls, and persistent best results. |

## Features

| Surface | Status | Notes |
|---|---|---|
| Home/Hero | Implemented | Intro, typewriter copy, primary CTAs |
| Stats | Implemented | Experience and achievement counters |
| About | Implemented | Strengths grid and summary |
| Experience | Implemented | Professional timeline reflected in structured resume data |
| Skills | Implemented | Skill categories reflected in structured resume data |
| Education | Implemented | Education timeline reflected in structured resume data |
| Projects & Work | Implemented | Four featured cards plus three playable demos |
| Certificates | Implemented | Card-based showcase |
| Achievements | Implemented | Highlighted academic achievement |
| Resume Download | Implemented | Downloads generated `Pooja_Resume.pdf` |
| Contact | API retained | Hidden from the page by request |

## Requirements

### Functional

| ID | Requirement | Status |
|---|---|---|
| FR-01 | Render the public portfolio homepage with all current visible sections | Implemented |
| FR-02 | Generate the resume and render project cards from `src/data/portfolio.json` | Implemented |
| FR-03 | Show four featured project/work cards for portfolio, attendance, banking, and teaching | Implemented |
| FR-04 | Show three playable project demo cards that open focused dialogs | Implemented |
| FR-05 | Tic-tac-toe must support easy, medium, and hard computer difficulty plus score tracking | Implemented |
| FR-06 | Snake must support keyboard and touch controls, leveling, pause/resume, and saved best stats | Implemented |
| FR-07 | Spaceship Survival must support keyboard and touch controls, 3 lives, escalating levels, pause/resume, and saved best stats | Implemented |
| FR-08 | Resume section must download the generated ATS-friendly PDF named `Pooja_Resume.pdf` | Implemented |
| FR-09 | Resume regeneration must run from `npm run resume:generate` and write the public PDF asset | Implemented |
| FR-10 | Preserve contact API route while keeping the section off the homepage | Implemented |
| FR-11 | Support responsive layouts across mobile, tablet, and desktop | Implemented |
| FR-12 | Support light/dark theming across the portfolio | Implemented |
| FR-13 | Remain deployed through the GitHub + Vercel workflow | Implemented |

### Non-Functional

- Accessibility: semantic structure, keyboard-friendly controls, dialog semantics, live-status text
- Performance: only the selected game mounts when its dialog opens
- Maintainability: modular sections, structured JSON content, standalone resume generator
- Persistence: browser localStorage stores best game results
- Design consistency: cosmic/glass UI across standard cards, dialogs, and resume section

## Acceptance Criteria

- [x] Homepage includes the resume section and current navigation link
- [x] Resume download points to `/Pooja_Resume.pdf`
- [x] Resume generator enforces exactly 2 pages before writing output
- [x] Resume content source is the structured `src/data/portfolio.json` file
- [x] Projects section includes four featured build cards
- [x] Projects section includes three playable demo cards
- [x] Each playable demo opens inside a dialog with title and description
- [x] Tic-tac-toe exposes three difficulty levels and match persistence for best player wins
- [x] Snake exposes rules, touch controls, level progression, and saved best stats
- [x] Spaceship Survival exposes rules, touch controls, level progression, shield window, and saved best stats
- [x] Contact form remains removed from the page while the API route still exists
