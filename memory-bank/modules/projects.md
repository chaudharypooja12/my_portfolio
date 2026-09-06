# Module: Projects

## Overview

`src/modules/projects/projects.tsx` reads `portfolioData.projects` from
`src/data/portfolio.json`, maps each entry to a project card model, and splits
the section into:

1. **Featured builds** — four glass cards for the non-game portfolio entries
2. **Playable project demos** — three game cards that open focused dialogs

## Featured Builds

The featured grid renders these four original work items as standard cards:

| ID | Title | Eyebrow | Highlights | Tags |
|---|---|---|---|---|
| `portfolio` | Portfolio Website | Flagship build | Cosmic glassmorphism, responsive light/dark themes | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| `attendance` | Attendance Management System | Operations workflow | Daily attendance tracking, reporting-focused review flow | Employee Tracking, Management System, Reporting |
| `banking` | Banking Application | Core application | Account opening, balance enquiry | Account Opening, Balance Enquiry, Financial |
| `education` | CS Education & Teaching | Teaching practice | Curriculum design, assessments, mentoring | Curriculum Design, Teaching, Student Engagement |

## Playable Demo Card + Dialog Behavior

- Each playable card uses a compact layout with title, icon, level pills, and
  separate **Rules** and **Play Game** actions.
- The Rules action opens a small dialog containing the full rules, levels, and
  controls, keeping cards free of text-heavy detail.
- Play Game opens the shared game dialog from `src/components/ui/dialog.tsx`.
- The game dialog is viewport-clamped, internally scrollable only when required,
  and uses a compact title bar plus Rules shortcut.
- Only the selected game component mounts in the dialog body, so inactive games
  do not run in the background.
- Closing the dialog resets `selectedGameId` to `null`.
- The shared dialog supplies a blurred overlay, bordered popup shell, and an
  explicit red close button with a white X labeled **Close game**.

## Playable Demo 1 — Tic-tac-toe

**Source:** `src/modules/projects/games/tic-tac-toe/tic-tac-toe-game.tsx`

- Human (`X`) vs computer (`O`)
- Player always moves first
- Status text is announced through a live region
- Board uses `role="grid"` with labeled squares for accessible play
- High-contrast colored grid lines and cells keep the 3×3 board clearly visible
- Difficulty controls and round actions are centered in the compact modal layout

### Difficulty

- **Easy:** random legal moves
- **Medium:** immediate tactical move if available most of the time, otherwise random
- **Hard:** optimal minimax play

### Match Flow

- **New round** clears the board but keeps match scores
- **Restart match** clears board plus scores
- Tracks player wins, computer wins, draws, and best saved result

### Persistence

- localStorage key: `portfolio:projects:games:tic-tac-toe:best-player-wins`
- Saves the best number of player wins reached in the current browser

## Playable Demo 2 — Snake

**Source:** `src/modules/projects/games/snake/snake-game.tsx`

- 16×16 grid-based board
- Start, Pause, Resume, and Restart controls
- Status text explains idle, paused, running, and game-over states

### Rules

- Stay inside the grid
- Eat food to grow and score
- Avoid walls and your own body
- Filling the full board ends the run as `boardFull`

### Levels and Scoring

- Level starts at 1
- Every 4 food pickups increases the level
- Tick speed starts at 220 ms and accelerates by 18 ms per level down to 90 ms minimum
- Each food awards `10 × current level`

### Controls

- Keyboard: arrow keys or WASD
- Touch: on-screen four-direction pad
- Window blur or a hidden tab auto-pauses the game
- Snake body uses green gradients and food uses an apple emoticon
- Touch controls and game actions are centered below the compact board

### Persistence

- localStorage key: `portfolio-snake-stats`
- Saves `highScore` and `highestLevel` on the current device

## Playable Demo 3 — Spaceship Survival

**Source:** `src/modules/projects/games/spaceship/spaceship-game.tsx`

- Survival game inside a responsive 16:10 play field
- Start Game / Pause / Resume / Restart / Play Again flow
- Overlay states for Ready, Paused, and Game Over

### Rules

- Dodge falling asteroids
- Survive as long as possible
- Start with 3 lives
- After each hit, the ship gets a short invulnerability shield window

### Levels and Difficulty

- Level starts at 1
- Advances every 15 seconds survived
- Difficulty caps at level 10
- Asteroid spawn interval speeds up as levels rise
- Asteroid count scales upward, capped at 12 concurrent asteroids

### Controls

- Keyboard: arrow keys or WASD
- Touch: hold the on-screen direction pad to strafe
- Window blur or hidden tab auto-pauses the game
- Pausing freezes any remaining post-hit shield time until play resumes
- The focused playfield captures movement keys so arrow presses do not scroll
  the page
- Playfield height is viewport-clamped with centered touch controls and actions

### Persistence

- localStorage key: `portfolio-spaceship-survival:v1`
- Saves best survival time and best level on the current device

## Status

Projects section upgraded and documented for featured builds + playable demos on
2026-09-06.
