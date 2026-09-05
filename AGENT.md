# Agent Instructions

## Context Continuity

Always check `memory-bank/` folder before making any changes. This ensures project context persists across chat switches.

## Memory Bank Updates

**Mandatory**: After every edit or update task, update the relevant file(s) in `memory-bank/`:

- `memory-bank/DESIGN.md` - Design decisions, UI changes
- `memory-bank/TECH_STACK.md` - Tech stack updates
- `memory-bank/RECENT_CHANGES.md` - Log all changes made
- `memory-bank/INDEX.md` - Project structure overview
- `memory-bank/PRD.md` - Product requirements
- `memory-bank/modules/<module-name>.md` - Module-specific changes

## Git Workflow

- **Always** commit and push to `main` branch only
- Never create separate feature branches
- Update `.gitignore` when adding new dependencies or build artifacts
- Commit as: Pooja Chaudhary (chaudharypooja12)

## Before Starting Work

1. Read `memory-bank/INDEX.md` for project structure
2. Read `memory-bank/RECENT_CHANGES.md` for latest state
3. Read relevant module file from `memory-bank/modules/`

## After Completing Work

1. Update `memory-bank/RECENT_CHANGES.md` with what was done
2. Update relevant module file if applicable
3. Commit and push to `main`
