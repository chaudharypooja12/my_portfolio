# Module: Resume Download

## Overview

The resume flow is fully implemented and no longer depends on a manually added
`resume.pdf`. The site ships a generated file named `Pooja_Resume.pdf` and the
download section links directly to it.

## Download Experience

**UI source:** `src/modules/resume/resume-download.tsx`

- Section id: `resume`
- Section header: **Download Resume**
- Description: **Get a copy of my ATS-friendly resume**
- CTA href: `/Pooja_Resume.pdf`
- Download filename: `Pooja_Resume.pdf`
- UI badges: **2-page PDF**, **ATS-friendly**, **Updated portfolio details**
- The main page renders this section after Achievements, and navigation includes
  a `Resume` anchor link

## Authoritative Structured Source

**Source of truth:** `src/data/portfolio.json`

The generator reads:

- `profile`
- `experience`
- `education`
- `skills`
- `projects`
- `certificates`
- `achievement`

Update the JSON first whenever resume content changes.

## Exact ATS Resume Workflow

1. Edit `src/data/portfolio.json`.
2. Run `npm run resume:generate`.
3. `scripts/generate-resume.mjs` uses `pdf-lib` plus Helvetica/HelveticaBold to
   lay out the resume.
4. The script writes `public/Pooja_Resume.pdf`.
5. The script throws if the output is not **exactly 2 pages**, making the
   generated file the enforced ATS-ready artifact served by the portfolio.

## Generated Output Details

- Output file: `public/Pooja_Resume.pdf`
- PDF title: `${data.profile.name} Resume`
- Fixed page size: US Letter (`612 × 792`)
- Sections rendered across the PDF:
  - Professional Summary
  - Professional Experience
  - Technical Skills
  - Selected Projects
  - Education
  - Certificates & Achievement

## Regeneration Command

```bash
npm run resume:generate
```

This command maps to `node scripts/generate-resume.mjs`.

## Status

Generated ATS resume workflow completed on 2026-09-06.
