# Recent Changes — Pooja Portfolio

## Log

### 2026-09-06 — Refined responsive playable game experience
- Replaced text-heavy game cards with minimalist cards and level pills
- Added dedicated Rules dialogs for rules, level details, and controls
- Made game dialogs and playfields responsive to dynamic viewport height
- Changed dialog close controls to red with a white X
- Improved Tic-tac-toe board contrast and centered its controls/actions
- Made Snake green and colorful with apple bait plus centered controls/actions
- Fixed Spaceship arrow/WASD capture and prevented arrow-key page scrolling
- Centered Spaceship controls/actions and reduced duplicate in-game text

### 2026-09-06 — Addressed game persistence and pause feedback
- Replaced render-time localStorage reads with an SSR-safe
  `useSyncExternalStore` adapter
- Kept same-tab saved-result displays synchronized after writes
- Applied the persistence flow to Tic-tac-toe, Snake, and Spaceship Survival
- Confirmed Spaceship pause/resume freezes the remaining post-hit shield time

### 2026-09-06 — Rebuilt resume and added playable project demos
- Added `src/data/portfolio.json` as structured resume and project content
- Added `pdf-lib` generator and `npm run resume:generate`
- Replaced the broken PDF with generated two-page `public/Pooja_Resume.pdf`
- Updated resume download UI with accurate format badges and direct download
- Removed obsolete manual resume instructions
- Replaced the Projects carousel presentation with responsive project grids
- Added accessible game dialogs that mount only the selected game
- Added playable Tic-tac-toe with Easy, Medium, and Hard AI
- Added playable Snake with growth, levels, keyboard/touch controls, and records
- Added Spaceship Survival with asteroid collisions, lives, levels, and records
- Added local best-result persistence for all three games
- Added blur/hidden-tab pausing for real-time games and lifecycle cleanup
- Updated PRD, design, tech stack, index, resume, and projects memory-bank files

### 2026-09-06 — Fixed resume download build error
- Removed asChild prop from Button component
- Used styled anchor tag instead
- Build passes locally

### 2026-09-06 — Added Resume Download section
- Created resume-download.tsx component
- Added to page.tsx and navigation
- This initial manual-file workflow was superseded by the generated
  `Pooja_Resume.pdf` workflow documented above

### 2026-09-06 — Updated portfolio context (PRD, TECH_STACK)
- Updated TECH_STACK.md with AI & Automation tools section
- Updated PRD.md technical skills with new categories

### 2026-09-06 — Skills section updated with AI & Automation tools
- Added AI & Automation category: ChatGPT, Claude Code, Gemini, Meta AI
- Added AI Tools & IDEs category: Cursor IDE, OpenCode, OpenAI, Google Flow
- Added MySQL to Database
- Added Gamma, Chatbots to Applications & Tools
- Updated tech badges list

### 2026-09-06 — Updated all "graduate" to "post-graduate"
- Changed in hero.tsx, about.tsx, layout.tsx, PRD.md
- Updated PRD.md with full experience and education entries

### 2026-09-06 — Stats counter updated
- Changed "1+ Year Teaching Experience" to "3+ Years Experience"
- Reflects total experience from April 2023 to present

### 2026-09-06 — Experience section updated
- Added Codingal Coding Teacher role (Current)
- Added Technical Consultant Freelancer role (Current)
- Added GD Goenka Public School teaching role
- No career gaps after GD Goenka
- Updated memory-bank/experience.md

### 2026-09-06 — Education section updated
- Added 4 education entries with full details
- MSc Computer Science (2020-2022), BSc General (2016-2019)
- 12th Computer Science (2015-2016), 10th (2013-2014)
- Added grades, skills, and descriptions
- Updated memory-bank/education.md

### 2026-09-06 — Memory Bank reorganized
- Flattened nested folder structure into flat files
- Created: INDEX.md, PRD.md, DESIGN.md, TECH_STACK.md, AGENT.md, RECENT_CHANGES.md
- Moved modules to flat `modules/` folder
- Removed: context/, PRD/, TRD/, agents/ nested folders
- Merged duplicate agent.md files

### 2026-09-06 — Memory Bank update with chat context
- Updated all files to reflect actual implementation
- Added user-confirmed skills beyond resume
- Updated acceptance criteria to completed

### 2026-09-05 — Vercel deployment
- GitHub repo connected to Vercel
- Auto-deploys on push to main
- Deployment protection note documented

### 2026-09-05 — Contact section removed
- Removed contact form from page per user request
- API route (`/api/contact`) kept in codebase

### 2026-09-05 — Light/dark mode
- Added next-themes with class attribute
- ThemeToggle in navigation (Sun/Moon)
- Light: gradient mesh background
- Dark: starfield, nebula, aurora, cursor glow
- Glass effects for both modes

### 2026-09-05 — Cosmic galaxy design system
- oklch color tokens (light + dark)
- 20+ CSS keyframe animations
- Glassmorphism cards
- Gradient text headings
- Scroll-reveal animations

### 2026-09-05 — Full project implementation
- Next.js 16 + TypeScript 5 + React 19
- Tailwind CSS v4 + shadcn/ui v4 + Lucide React
- 8 portfolio modules
- Fonts: Space Grotesk, Outfit
- Custom error pages (not-found, global-error)
- README with badges and docs
