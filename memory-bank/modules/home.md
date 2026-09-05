# Module: Home / Hero

## Purpose

Immediately communicate Pooja's professional identity, based on the
resume's positioning as a Computer Science professional and teacher.

## Content Source

PRD.md — Resume Content section.

## Implementation

### Hero Section (`src/modules/home/hero.tsx`)

- Full-screen hero with gradient background
- Profile image with animated glowing ring
- Typewriter effect cycling through roles:
  - "Computer Science Teacher"
  - "Web Developer"
  - "Problem Solver"
- Name: Pooja
- Professional title and description
- Two CTA buttons:
  - "View My Work" → scrolls to projects
  - "Contact Me" → scrolls to contact
- Scroll-down indicator with bouncing animation
- Glassmorphism card styling

### Effects

- Typewriter component cycles through role strings
- Profile image has animated ring (primary, accent, nebula-2 colors)
- ScrollReveal for entrance animations
- Background: gradient mesh (light) or starfield (dark)

### Responsive

- Full-screen on all devices
- Adjusted typography for mobile
- CTA buttons stack on mobile

Status: Implemented (2026-09-05)
