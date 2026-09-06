# Tech Stack — Pooja Portfolio

## Core

- Next.js 16 (Turbopack)
- TypeScript 5
- React 19

## Styling

- Tailwind CSS v4
- oklch color tokens (CSS custom properties)
- CSS keyframe animations (20+)
- Canvas API (starfield)

## UI

- shadcn/ui v4 (@base-ui/react primitives)
- Lucide React (icons, no emojis)
- Custom components: Starfield, NebulaBackground, SkyBackground, CursorGlow,
  ScrollReveal, ThemeProvider, ThemeToggle, Dialog, Typewriter, StatsCounter
- Playable React games: Tic-tac-toe, Snake, Spaceship Survival
- SSR-safe localStorage subscriptions through `useSyncExternalStore`

## Documents and Content

- `pdf-lib` for deterministic ATS resume generation
- Standard embedded Helvetica fonts for portable PDF rendering
- `src/data/portfolio.json` as the shared resume and project content source
- `npm run resume:generate` writes `public/Pooja_Resume.pdf`

## AI & Automation Tools

- ChatGPT (OpenAI)
- Claude Code (Anthropic)
- Gemini (Google)
- Meta AI
- Cursor IDE
- OpenCode
- Google Flow (video generation)
- AI Automation
- Gamma (PPT creation)
- Chatbots

## Theme

- next-themes (SSR-safe)
- `attribute="class"` on `<html>`
- Default: light mode

## API & Email

- REST API via Next.js API Route (`/api/contact`)
- Resend (email service)

## Project Structure

```
my_portfolio/src/
├── app/
│   ├── api/contact/        # Contact form API
│   ├── layout.tsx          # Root layout + providers
│   ├── page.tsx            # Main page (all sections)
│   ├── not-found.tsx       # 404 page
│   ├── global-error.tsx    # Error boundary
│   └── globals.css         # Design system + animations
├── components/
│   ├── layout/             # Nav, Starfield, Nebula, Sky, Theme
│   ├── portfolio/          # Carousel, Stats, Typewriter
│   ├── sections/           # Section headers
│   └── ui/                 # shadcn/ui + accessible dialog
├── data/
│   └── portfolio.json      # Resume and project content source
└── modules/
    ├── home/               # Hero section
    ├── about/              # About section
    ├── experience/         # Experience timeline
    ├── skills/             # Skills grid
    ├── education/          # Education timeline
    ├── projects/           # Project grids and playable game dialogs
    │   └── games/          # Tic-tac-toe, Snake, Spaceship Survival
    ├── certificates/       # Certificates
    └── achievements/       # Achievements
```

Repository-level resume files:

```text
scripts/generate-resume.mjs  # Two-page PDF generator
public/Pooja_Resume.pdf      # Generated downloadable resume
```

## Theme System

**Light Mode:** Soft gradient mesh, subtle orbs, white frosted glass
**Dark Mode:** Deep space purple, starfield canvas, nebula blobs, aurora wave, cursor glow, neon glass

## CI/CD

```
Push to main → Vercel auto-deploy → Build (Turbopack) → TypeScript check → Static generation → Production
```

## Environment Variables

```
EMAIL_SERVICE_API_KEY    # Resend API key
EMAIL_FROM              # Sender email
EMAIL_TO                # Recipient email
```

`.env.local` not committed. `.env.example` documents required vars.

## Deployment

- GitHub repo connected to Vercel
- Auto-deploys on push to `main`
- Environment variables in Vercel dashboard
