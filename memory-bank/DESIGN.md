# Design System — Pooja Portfolio

## Direction: Cosmic Galaxy + Glassmorphism

Modern, professional, elegant, technical, cosmic, immersive.

## Colors (oklch tokens in globals.css)

### Light Mode

```
Background:   oklch(0.98 0.003 260)   # White-blue
Foreground:   oklch(0.18 0.02 280)    # Dark navy
Primary:      oklch(0.50 0.20 275)    # Rich purple
Accent:       oklch(0.55 0.16 190)    # Teal
Glass:        oklch(1 0 0 / 65%)      # White frosted
```

### Dark Mode

```
Background:   oklch(0.10 0.025 275)   # Deep space
Foreground:   oklch(0.95 0.005 260)   # Light white
Primary:      oklch(0.72 0.22 275)    # Bright purple
Accent:       oklch(0.70 0.18 190)    # Bright teal
Glass:        oklch(0.14 0.03 275 / 60%)
```

### Semantic

```
Success: oklch(0.55 0.18 145)  Error: oklch(0.58 0.22 25)
Warning: oklch(0.65 0.20 80)   Info:   oklch(0.55 0.16 190)
```

## Typography

- **Headings:** Space Grotesk (600, 700)
- **Body:** Outfit (300-600)
- **Scale:** Display 64px → H1 40px → H2 32px → H3 24px → Body 16px → Small 14px

## Glassmorphism

```css
/* Light */
background: var(--glass);
backdrop-filter: blur(20px) saturate(1.5);
border: 1px solid var(--glass-border);
box-shadow: 0 4px 20px oklch(0 0 0 / 5%);

/* Dark — adds neon glow */
box-shadow: 0 0 30px oklch(0.55 0.25 275 / 5%);
```

## Animations

`float` (6s), `float-slow` (8s), `spin-slow` (30s), `pulse-glow` (3s), `slide-in-*` (0.7s), `fade-in` (0.5s), `gradient-shift` (8s), `nebula-drift` (20s), `twinkle` (4s), `shooting-star` (2.5s), `typewriter-cursor` (1s), `count-up` (2s)

Scroll-reveal: IntersectionObserver adds `revealed` class.

## Backgrounds

**Light:** Gradient mesh, subtle orbs, grid pattern (0.015 opacity), floating dots
**Dark:** Deep space gradient, starfield canvas, shooting stars, nebula blobs, aurora wave, cursor glow

## Responsive

- Mobile (<640px): Single column, compact nav, reduced complexity
- Tablet (640-1024px): Adaptive cards, two-column layouts
- Desktop (>1024px): Full nav, multi-column, full animations

## Projects and Game Dialogs

- Featured work uses a responsive two-column glass-card grid.
- Playable demos use one card per column on small screens and three columns on
  wide screens.
- Each game card uses a minimalist title/icon treatment, level pills, and Rules
  plus Play Game actions.
- Rules, detailed levels, and controls live in a separate compact dialog.
- Games open in a centered dialog sized against `dvh`; game boards are
  independently viewport-clamped so controls remain visible on mobile and
  desktop.
- The overlay uses a dark translucent backdrop and blur while the popup retains
  the current light/dark theme tokens.
- Only the selected game mounts, preventing hidden animation loops and input
  listeners.
- Dialog close controls use a red background and white X for immediate visual
  recognition.

## Accessibility

Semantic HTML, keyboard nav, focus states, ARIA labels, dialog focus management,
contrast ratios, alt text, live game status, and reduced motion support.
