# Implementation Plan: Homepage

**Branch**: `001-homepage` (feature name; work is currently on `main`) | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-homepage/spec.md`, plus the stack and architecture set by the project owner

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build the 12-section homepage as a fully static, production-ready site on GitHub Pages, with rich but safe animation and automatically generated images. Content comes from files, so Ravi can change it without touching components. Every Hire me on Upwork button reads one configured URL. Empty sections disappear. Automated checks stop the build if contact details, placeholders or broken links get through.

This plan also sets up the foundation features 002 to 004 reuse: content loading, image generation, the Hire button, design tokens, motion components and the quality gates.

## Technical Context

**Language/Version**: TypeScript 5 in strict mode, Node.js 26 (current LTS)

**Primary Dependencies**: Next.js 16.4.5 (App Router, latest stable), React 19.3, Tailwind CSS 4, framer-motion 14. New: `yaml`, `zod`. New for development: `prettier`, `sharp`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `serve`

**Package Manager**: pnpm 12

**Storage**: Content files in the repo. No database

**Testing**: Playwright with axe for browser tests, Node's built-in test runner for build checks, Lighthouse CI for scores

**Target Platform**: Static files on GitHub Pages at `https://ravi-teja-t.github.io/portfolio/`, current browsers on phone and desktop

**Project Type**: Static website

**Performance Goals**: Lighthouse 95+ in every category, on phone and desktop settings, with scripts under 220 KB compressed

**Constraints**: No server code, no cookies, no analytics, no external font requests, all assets under the `/portfolio/` base path, headline and Hire button on the first screen at 375 by 553 pixels, WCAG 2.2 AA

**Scale/Scope**: One page with 12 sections. The foundation serves about 10 pages across four features

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against constitution v1.2.0.

| Principle | Before research | After design | How the design meets it |
|---|---|---|---|
| I. Upwork Compliance | Pass | Pass | One `HireButton`. The compliance scan fails on emails, phones, banned domains, forms and links outside upwork.com and github.com |
| II. Truthful Content | Pass | Pass | The loader removes unapproved items and rejects placeholders. Generated images are illustrations, never a fake portrait or screenshot |
| III. Content-Driven | Pass | Pass | All page text comes from `content/` and `site.config.ts`. Services and case studies are MDX files. Images generate from content |
| IV. Performance | Pass | Pass | Static export and generated images. Lighthouse CI enforces 95+ and a 220 KB script limit. Motion meets the animation conditions in Principle IV |
| V. Mobile and Accessible | Pass | Pass | Viewport tests at 375 by 553, axe on every page, headline and Hire button not animated in, content visible if scripts fail |
| VI. Design Consistency | Pass | Pass | Tailwind theme tokens. A browser test fails if the accent appears off the Hire button |
| VII. Simplicity | **Fail: repo has SQLite code** | Pass | The plan removes it as its first step |
| VIII. Privacy | Pass | Pass | No analytics in v1, so no cookies and no third-party scripts |
| IX. Quality Gates | Pass | Pass | ESLint, Prettier, strict TypeScript, Playwright and axe on every built page, and Lighthouse, run in GitHub Actions |

The Principle VII failure is existing code, not a design choice. It stays open until the removal step is done.

## Project Structure

### Documentation (this feature)

```text
specs/001-homepage/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── content-files.md # How content is edited
│   ├── build-checks.md  # Commands and scan rules
│   └── homepage-ui.md   # What browser tests rely on
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
site.config.ts                 # New: Upwork URL, site address, name, tagline, nav links

content/                       # New: see contracts/content-files.md
├── home/
├── services/
├── case-studies/
└── testimonials/

public/
├── .nojekyll                  # New: keeps `_next` from being filtered out
└── images/generated/          # New, gitignored: output of the image generator

scripts/                       # New
├── generate-images.mjs
├── check-built-output.mjs
└── banned-domains.mjs

src/
├── app/
│   ├── layout.tsx             # Changed: fonts, metadata, canonical, share image
│   ├── page.tsx               # Changed: composes the sections
│   └── globals.css            # Changed: design tokens, hover, print and FAQ styles
├── components/                # New
│   ├── HireButton.tsx
│   ├── ResponsiveImage.tsx
│   ├── HeroVisual.tsx         # Inline SVG with CSS animation
│   ├── TopBar.tsx
│   ├── Footer.tsx
│   ├── motion/                # The client components
│   │   ├── Reveal.tsx
│   │   ├── Stagger.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── ActiveNav.tsx
│   │   └── TimelineLine.tsx
│   └── sections/              # One file per homepage section
└── lib/
    ├── content/               # New: Zod schemas, loader, approval rules
    └── db.ts                  # Removed

src/app/api/health/            # Removed

tests/                         # New
├── e2e/
├── checks/
└── fixtures/                  # Full, empty and invalid content sets

.github/workflows/
├── quality.yml                # New: gates on pull requests
└── deploy.yml                 # New: GitHub Pages deploy from main
.node-version                  # New
.prettierrc, .prettierignore   # New
lighthouserc.json              # New
lighthouserc.desktop.json      # New
playwright.config.ts           # New
next.config.ts                 # Changed: static export, base path, trailing slash
package.json                   # Changed: scripts, dependencies, packageManager
pnpm-lock.yaml                 # New, replaces package-lock.json
README.md                      # Changed: remove SQLite mention
.gitignore                     # Changed: drop /data/, add generated files
```

**Structure Decision**: A single Next.js project at the repo root, with content in `content/` kept apart from code in `src/`. Components sit in `src/components` because features 002 to 004 reuse them.

## Implementation Order

1. **Clean up**: remove the SQLite code, move to pnpm, switch to static export with the base path. Principle VII passes after this step.
2. **Foundation**: tokens, fonts, `site.config.ts`, content schemas and loader, image generator, `HireButton`, motion components, top bar, footer.
3. **Gates**: compliance scan, fixtures, browser tests and Lighthouse, so later work is checked as it lands.
4. **Sections**: build the 12 sections, using the `ui-ux-pro-max` skill for component-level checks. The portfolio plan's design choices take priority over its suggestions.
5. **Deployment**: the GitHub Pages workflow and the manual checks.

## Dependencies and Open Items

| Item | Owner | Blocks |
|---|---|---|
| Turn on GitHub Pages: Settings, Pages, Source: GitHub Actions | Repo owner | Deployment |
| Required status check on `main` in GitHub | Repo owner | Merge blocking |
| Read the drafted FAQ answers, about text and tech list | Ravi | Going live, because these are claims in Ravi's name |
| Real photo, metrics, testimonials and more case studies | Ravi | Those parts appearing. The page is complete without them |
| Service, Work and About pages | Features 002 to 004 | Those links switching from sections to pages |
| Add each new page to `lighthouserc` | Features 002 to 004 | Principle IV on every page |

## Complexity Tracking

No violations. `framer-motion` adds about 36 KB gzipped for the measured set of effects, which constitution v1.2.0 allows under conditions. If the score falls under 95 or scripts exceed 220 KB, animation has to be reduced.
