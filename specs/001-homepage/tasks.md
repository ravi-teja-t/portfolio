# Tasks: Homepage

**Input**: Design documents from `/specs/001-homepage/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Included, because Constitution Principle IX and the project owner's stack brief require them.

**Organization**: Tasks are grouped by user story so each can be built and tested on its own.

**Read first**: `AGENTS.md` says this Next.js version differs from older ones. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US5)

## Changes Made During Implementation

The task text below is the original plan. These things were built differently, for reasons recorded in research R11:

- **T022 and T024**: `ScrollProgress` and `TimelineLine` use CSS scroll-driven animations, not framer-motion.
- **T016**: `HireButton` gained a `compact` option for the top bar.
- **T019 to T021**: animation features load lazily through `loadFeatures`.
- **T037**: Lighthouse audits `/` and forces normal motion. SEO is asserted on the homepage only, under constitution 1.3.0.
- **T066**: added a skip link, and `src/components/motion/useReveal.ts` is shared by `Reveal` and `Stagger`.
- **Added**: `scripts/strip-not-found-scripts.mjs`, `scripts/image-sizes.mjs`, a generated favicon, `"type": "module"` in `package.json`, and a hydration regression test.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove the SQLite code and put the toolchain in place

- [X] T001 Delete `src/lib/db.ts` and `src/app/api/health/route.ts`, delete the empty `src/app/api/` folder and the local `data/` folder, and remove the `# sqlite database` and `/data/` lines from `.gitignore`
- [X] T002 [P] In `README.md`, replace "Built with Next.js, Node.js, SQLite, and TypeScript." with "Built with Next.js and TypeScript."
- [X] T003 Install pnpm with `npm install -g pnpm@12.18.0`, run `pnpm import`, delete `package-lock.json`, add `"packageManager": "pnpm@12.18.0"` to `package.json`, then run `pnpm install` to create `pnpm-lock.yaml`. If pnpm blocks install scripts for `sharp` or Playwright, allow them explicitly in `pnpm-workspace.yaml`
- [X] T004 [P] Create `.node-version` containing `26`, and set `engines.node` to `">=26"` in `package.json`
- [X] T005 In `next.config.ts`, add `output: "export"`, `trailingSlash: true` and `basePath: process.env.PAGES_BASE_PATH ?? ""`, remove `cacheComponents` and `partialPrefetching`, and keep the existing `turbopack` CSS rule
- [X] T006 Run `pnpm add yaml zod` and `pnpm add -D prettier sharp gh-pages @playwright/test @axe-core/playwright @lhci/cli serve`, then `pnpm exec playwright install chromium`, updating `package.json`
- [X] T007 Add these scripts to `package.json`: `build` (`node scripts/generate-images.mjs && next build && node scripts/check-built-output.mjs`), `lint`, `format:check` (`prettier --check .`), `typecheck` (`tsc --noEmit`), `test:checks` (`node --test tests/checks/`), `test:e2e` (`node tests/build-fixtures.mjs && playwright test`), `test:lighthouse` (`node tests/run-lighthouse.mjs`), `images` (`node scripts/generate-images.mjs`), `site:deploy` (`node scripts/deploy.mjs`)
- [X] T008 [P] Create `.prettierrc` and `.prettierignore`, ignoring `out`, `.next`, `.fixture-out`, `.lighthouseci`, `specs`, `.specify`, `.claude` and `pnpm-lock.yaml`. Add `.fixture-out/`, `.lighthouseci/`, `playwright-report/`, `test-results/` and `public/images/generated/` to `.gitignore`

**Checkpoint**: `pnpm exec next build` produces `out/index.html`, and no SQLite code remains

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Everything the sections and gates depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Design system

- [X] T009 [P] In `src/app/globals.css`, define tokens in Tailwind v4 `@theme`: clear default colours with `--color-*: initial`; set `--spacing: 0.5rem` so utilities step in 8 px; add neutral colours for a light background and near-black text; add `--color-accent: #1D4ED8` and a darker accent hover value; add a type scale and radius tokens. Add smooth scrolling only inside `@media (prefers-reduced-motion: no-preference)`, `scroll-padding-top` matching the fixed top bar's height, a near-black focus ring that never uses the accent, a print rule forcing `[data-reveal]` to `opacity: 1` and `transform: none` with `!important`, lift styles for cards that have a link, on hover and `:focus-within`, with hover inside `@media (hover: hover)`, and smooth FAQ opening using `interpolate-size` and `::details-content` where supported. Turn off every transition under `prefers-reduced-motion: reduce`. Content width is about 1,100 px
- [X] T010 In `src/app/layout.tsx`, load Inter and JetBrains Mono through `next/font/google` as CSS variables, with `preload: false` on JetBrains Mono, set `lang="en"`, and take page title and description from `site.config.ts`, replacing "Create Next App". Set `metadataBase` from `siteUrl` and the generated share image. Don't set a canonical here, because a root layout passes it to every page
- [X] T011 Create `src/lib/metadata.ts` with `pageMetadata(path)`, returning that page's canonical address with no query string (FR-033), or none when `SITE_CANONICAL=off`. Use it in `src/app/page.tsx`

### Site config

- [X] T012 Create `site.config.ts` with `upworkUrl` ("https://www.upwork.com/freelancers/~01935144be55391b8e"), `siteUrl` ("https://ravi-teja-t.github.io/portfolio"), `name` ("Ravi Teja"), `tagline` ("Backend and AI Automation Engineer · Founder, Ango Digital Tech"), `nav` (Work to `/#work`, Services to `/#services`, About to `/#about`), `hireLabel` ("Hire me on Upwork") and `footerLine` ("Founder of Ango Digital Tech")

### Content system

- [X] T013 Create Zod schemas in `src/lib/content/schemas.ts`, using these rules from `data-model.md`:
  - Site config: `upworkUrl` must be "`https`, host `www.upwork.com` or `upwork.com`, path starting `/freelancers/~`"; `nav` is a list of label and href
  - Metric: `value`, `label`, `approved` all required
  - Testimonial: `quote` and `approved` required; `name`, `role`, `company` and `order` optional
  - FAQ item: `question` and `answer` required
  - Tech group: `group` is one of "AI, Backend, Cloud and DevOps, or Healthcare"; `items[].name` required; `items[].logo` optional
  - Real image: `src`, `alt`, `width`, `height` all required
  - Service: `slug` is "unique" and "must not clash with `work`, `about` or `services`"; `title`, `order`, `outcomeHeadline`, `oneLine` required; `deliverables` has "exactly 3" items; `hasPage` optional, defaulting to false
  - Case study: `slug` is unique; `title`, `order`, `listed`, `clientType`, `result` required; `stack` has "at least 1" item; `image` (Real image) optional; `hasPage` optional, defaulting to false
  - Home files: `hero.yaml` needs `headline`, `subhead`, `seeWorkLabel`, `trustLine` and optional `photo`; `about.yaml` needs `sentences` ("exactly 3"), with optional `photo` and `linkLabel`; `closing.yaml` needs `headline`; `not-found.yaml` needs `heading`, `text` and `homeLabel`; `sections.yaml` needs a heading for each section; `how-i-work.yaml` is a list of steps, each with `title` and `text`
- [X] T014 Create the loader in `src/lib/content/load.ts`:
  - Read from `process.env.CONTENT_DIR`, falling back to `content/`
  - Parse YAML and MDX frontmatter with `yaml`, and validate `site.config.ts` plus every file against T013
  - A missing or invalid field on an existing item throws an error naming the file, field and reason. `hero.yaml`, `closing.yaml`, `not-found.yaml` and `sections.yaml` are required. Other files and lists may be absent or empty
  - Check that every real image `src` has AVIF and WebP files under `public/images/`, and every set `logo` exists
  - In production builds, walk every parsed string, and throw on any bracketed value that isn't a Markdown link, and on `TODO`, `TBD` and "lorem ipsum"
- [X] T015 Add derived rules in `src/lib/content/select.ts`, per `data-model.md`: remove unapproved metrics and testimonials before pages see them; throw if more than 4 approved metrics or 3 approved testimonials remain; sort listed case studies by `order` and keep the first three; sort services by `order`; expose whether See my work should appear; expose the visible nav, removing any link to a homepage section that is hidden; and add `cardHref(item)` in `src/lib/content/links.ts`, returning a path only when `hasPage` is true. Unapproved values must never reach a component

### Shared components

- [X] T016 [P] Create `src/components/HireButton.tsx` as a server component: an `a` element with `data-hire`, `href` from `upworkUrl`, `target="_blank"`, `rel="noopener noreferrer"` and text from `hireLabel`. This is the only component that may use the accent colour tokens
- [X] T017 Create `scripts/generate-images.mjs` per research R4, reading content with the same `CONTENT_DIR` rule and writing to `public/images/generated/`: case study covers (AVIF and WebP at 640 and 1280 wide, a geometric pattern seeded by the slug, with title and stack as text), an about illustration from the initials in `name`, an SVG tile per tech item, and a 1200 by 630 PNG share image. Build each as SVG and convert with `sharp`, keeping the SVG sources in the output folder. Read every colour from the `--color-*` tokens in the `@theme` block of `src/app/globals.css`, skipping the accent. Clear the folder first, and export the sizes for `ResponsiveImage`. Never draw a face or anything resembling a product screenshot
- [X] T018 [P] Create `src/components/ResponsiveImage.tsx`: a `picture` element with AVIF and WebP sources and an `img` with explicit `width`, `height` and `alt`, adding `process.env.PAGES_BASE_PATH` to every path, because `basePath` isn't applied to plain assets. Accept either a generated image name, which uses empty `alt` because its title or name sits beside it as text, or a real image with its own `alt`. Lazy-load by default
- [X] T019 [P] Create `src/components/HeroVisual.tsx` as a server component: an inline SVG diagram of an AI agent connecting systems, with colours set through the `--color-*` CSS variables, never the accent, marked decorative with `aria-hidden`. A CSS stroke animation draws it once, in under 4 seconds, and leaves it complete under `prefers-reduced-motion: reduce`. With no animation it shows the finished drawing
- [X] T020 [P] Create `src/components/motion/Reveal.tsx` as a client component, using `LazyMotion`, `domAnimation` and `m` from `framer-motion`, wrapping server-rendered `children`, with `data-reveal` on its element. The built HTML must contain no `opacity:0` for this element. Render visible first with `initial={false}`, and after hydration hide the element only if it's outside the viewport, then fade it in once on entering the viewport, over 400 milliseconds with a 16 pixel rise. Animate only `opacity` and `transform`. Do nothing when `useReducedMotion` is true. If JavaScript never runs, content simply stays visible
- [X] T021 [P] Create `src/components/motion/Stagger.tsx`: a client component delaying each child's reveal by 60 milliseconds, following the same visible-by-default rules as `Reveal`
- [X] T022 [P] Create `src/components/motion/ScrollProgress.tsx`: a near-black 2 pixel line under the top bar, using `useScroll` and `useSpring` with `m.div`, animating only `scaleX`, and absent under reduced motion
- [X] T023 [P] Create `src/components/motion/ActiveNav.tsx`: wraps the top bar links and marks the link for the section on screen with `aria-current="true"` and a near-black underline, using `IntersectionObserver`. It also closes the phone menu when a link in it is selected (FR-029). With no JavaScript the links simply have no marker
- [X] T024 [P] Create `src/components/motion/TimelineLine.tsx`: a near-black line along the how I work steps that grows with scroll, using `useScroll` and `scaleY`. Under reduced motion or with no JavaScript it shows at full length
- [X] T025 [P] Create `src/components/SectionHeading.tsx`, which takes heading text from `sections.yaml` so no section hard-codes a heading

### Compliance scan

- [X] T026 [P] Create `scripts/banned-domains.mjs` exporting the banned list (`wa.me`, `whatsapp.com`, `t.me`, `telegram.org`, `calendly.com`, `cal.com`, `skype.com`, `discord.com`, `discord.gg`, `signal.me`, `linkedin.com`, `x.com`, `twitter.com`, `instagram.com`, `facebook.com`) and allowed outbound domains (`upwork.com`, `github.com`)
- [X] T027 Create `scripts/check-built-output.mjs`, scanning every `.html` file under the folder given as an argument, defaulting to `out/`, and implementing every rule in the table in `contracts/build-checks.md`: email, phone, contact link, banned domain, outbound link, broken link, third-party script, form and placeholder, with all "must not fail" cases. Strip `PAGES_BASE_PATH` before resolving internal paths. Match domains whole, including subdomains. Exit non-zero and print the file, rule and match
- [X] T028 Create `tests/checks/scan.test.mjs` with `node:test`. For each rule, write bad HTML to a temp folder and assert the scan fails. For each "must not fail" case, assert it passes, including `netflix.com` against `x.com` and `photo@2x.webp`

### Test infrastructure

- [X] T029 Create `tests/checks/tokens.test.mjs` with `node:test`: run the generator on the seeded content, and assert no SVG in `public/images/generated/` contains the `--color-accent` value from `src/app/globals.css`
- [X] T030 [P] Create `tests/fixtures/full/`, a complete content set following `contracts/content-files.md`, with obviously fictional text, 4 approved metrics, one unapproved metric, 3 approved testimonials, 4 services and 4 listed case studies plus one unlisted, all with `hasPage` false
- [X] T031 [P] Create `tests/fixtures/empty/`, holding only `hero.yaml`, `closing.yaml`, `not-found.yaml` and `sections.yaml` plus one testimonial with `approved: false`
- [X] T032 [P] Create invalid sets in `tests/fixtures/invalid/`: `missing-field/` (a service with no `oneLine`), `too-many-metrics/` (5 approved), `placeholder-hidden/` (`[X]` inside an unapproved testimonial) and `slug-clash/` (a service with slug `work`)
- [X] T033 Create `tests/build-fixtures.mjs`: for `full`, `empty` and `real` (the seeded `content/`), run the image generator and `next build` with `SITE_CANONICAL=off`, setting `CONTENT_DIR` for the two fixtures, run the scan, and copy `out/` to `.fixture-out/<name>/`. Also build `full` with `PAGES_BASE_PATH=/portfolio` and canonicals on, into `.fixture-out/base/portfolio/`, for the base path and canonical tests
- [X] T034 Create `tests/checks/content.test.mjs` with `node:test`: for each set in `tests/fixtures/invalid/`, run `next build` with `CONTENT_DIR` and `NODE_ENV=production`, and assert a non-zero exit and an error naming the file
- [X] T035 Create `playwright.config.ts` with four `webServer` entries running `serve` on `.fixture-out/full` (port 4101), `.fixture-out/empty` (port 4102), `.fixture-out/base` (port 4103) and `.fixture-out/real` (port 4104), using Chromium
- [X] T036 [P] Create `tests/e2e/helpers/pages.ts`, listing every `index.html` page under `.fixture-out/full/`, plus `404.html` as the not-found page. Skip the `404/` and `_not-found/` folders, because they're the same page, so new pages are tested automatically
- [X] T037 [P] Create `lighthouserc.json` (mobile) and `lighthouserc.desktop.json` (desktop preset), and `tests/run-lighthouse.mjs`, which runs both configs on `.fixture-out/full` and `.fixture-out/real`, setting `staticDistDir` for each run. Audit the homepage and `404.html`, with 3 runs, `aggregationMethod: "median-run"`, `minScore: 0.95` on `performance`, `accessibility`, `best-practices` and `seo`, and `resource-summary:script:size` limited to 225280 bytes (220 KB compressed)
- [X] T038 Create `.github/workflows/quality.yml`, running on pull requests to `main` and pushes to `main`, with no deploy step: set up pnpm from `packageManager` and Node from `.node-version`, then run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test:checks`, `pnpm test:e2e` and `pnpm test:lighthouse`, installing Chromium with its dependencies first
- [X] T039 Create `scripts/deploy.mjs`, per the Deployment section of `contracts/build-checks.md`: stop if `git status --porcelain` shows changes; run lint, format check, typecheck, `test:checks`, `test:e2e` and `test:lighthouse`, stopping at the first failure; run `pnpm build` with `PAGES_BASE_PATH=/portfolio`; publish with `gh-pages -d out -b gh-pages --nojekyll`, putting the source commit in the message. Set environment variables in Node, so this works on Windows

### Seed content

- [X] T040 [P] Create `content/home/hero.yaml` with the headline "I build AI agents that actually run in production.", the subhead "Backend engineer with 5+ years in Java, Spring Boot and AWS. I turn repetitive support and operations work into reliable AI automation.", `seeWorkLabel` "See my work", and the trust line "Founder, Ango Digital Tech · 5+ years production backend · Healthcare/HL7 experience"
- [X] T041 [P] Create `content/home/how-i-work.yaml` (Scoping chat on Upwork; Fixed milestones with clear deliverables; A weekly demo and written update; Handover: code, docs and a walkthrough video), `content/home/closing.yaml` ("Have a process that eats your team's time? Let's automate it."), `content/home/sections.yaml`, and `content/home/not-found.yaml` (heading "This page doesn't exist", text "The link may be old. Everything else is still here.", `homeLabel` "Back to the homepage")
- [X] T042 [P] Create `content/services/ai-automation.mdx`, `backend.mdx`, `healthcare.mdx` and `web-apps.mdx`, with outcome headlines and deliverables from the Services section of the portfolio plan, in that order. `oneLine` isn't in the plan, so write one plain line for each that makes no factual claims
- [X] T043 [P] Create `content/home/tech-stack.yaml` using only tools named in the brief and portfolio plan. AI: AI agents, RAG, LLM integration. Backend: Java, Spring Boot, Microservices, REST APIs, PostgreSQL. Cloud and DevOps: AWS, Docker, Kubernetes, CI/CD. Healthcare: HL7, EHR data pipelines, integration engines
- [X] T044 [P] Create `content/home/about.yaml` with these three `sentences`: "I'm Ravi Teja, a backend engineer with 5+ years in Java, Spring Boot, microservices and AWS."; "I build production-grade AI automation, including AikaIQ, an agentic AI framework and automation API for support and operations."; "I founded Ango Digital Tech." Leave out `linkLabel`
- [X] T045 [P] Create `content/home/faq.yaml` with five items, in plain language, claiming no certification:
  - Fixed price or hourly: fixed price by milestone is the default, so the cost is clear before work starts, and hourly suits open-ended work
  - Who owns the code: the client owns the code they pay for, and handover includes code, docs and a walkthrough video
  - Will you sign an NDA: yes, a reasonable NDA is fine
  - How do we communicate: on Upwork, with a weekly demo and written update
  - How do you handle patient data: real patient data stays out of development and testing, using test data instead, and the client's security and compliance requirements are followed
- [X] T046 [P] Create `content/case-studies/aikaiq.mdx` with `slug` "aikaiq", `title` "AikaIQ: an agentic AI framework for support and operations", `order` 1, `listed` true, `clientType` "Own product", `result` "An agentic AI framework and automation API for support and operations.", and `stack` [AI agents, Automation API]
- [X] T047 Leave `metrics.yaml` and `content/testimonials/` absent, keeping that folder with `.gitkeep`. Never invent metrics, clients or quotes

**Checkpoint**: `pnpm test:checks` passes and the homepage builds. All stories can now start

---

## Phase 3: User Story 1 - Understand, see proof, hire (Priority: P1) 🎯 MVP

**Goal**: A client reads the headline, sees proof and reaches the Upwork profile.

**Independent Test**: Open the homepage, follow See my work to the featured work, select any Hire button, and confirm the configured Upwork profile opens in a new tab.

### Tests for User Story 1

- [X] T048 [P] [US1] Create `tests/e2e/hire.spec.ts` on the full fixture: every `[data-hire]` has `href` equal to `upworkUrl` from `site.config.ts`, `target="_blank"` and `rel="noopener noreferrer"`; a Hire button exists in `#top-bar`, `#hero` and `#closing`
- [X] T049 [P] [US1] Create `tests/e2e/homepage.spec.ts` on the full fixture: sections appear in the order in `contracts/homepage-ui.md`; exactly one `h1`, holding the headline; See my work links to `#work`; the FAQ uses `details` and `summary`; the unlisted case study and unapproved metric appear nowhere; the first case study card is the lowest `order`
- [X] T050 [P] [US1] Create `tests/e2e/smoke.spec.ts`, running on every page from `tests/e2e/helpers/pages.ts`: the page returns 200, has no console errors, sets no cookies, makes no third-party requests, and every image has loaded. Repeat on the real build, port 4104. On port 4103, confirm the page at `/portfolio/` loads its styles, scripts and images. Opening a missing address shows the not-found page, with a route home and a Hire button
- [X] T051 [P] [US1] Create `tests/e2e/accessibility.spec.ts`, with reduced motion emulated, running axe on every page, on the full and real builds, with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, and asserting zero violations
- [X] T052 [P] [US1] Create `tests/e2e/accent.spec.ts`, with reduced motion emulated: read computed `color`, `background-color` and `border-color` for every element, and fail if the accent appears outside `[data-hire]`

### Implementation for User Story 1

Use the `ui-ux-pro-max` skill for component-level checks. The portfolio plan's look and feel takes priority over its suggestions. Wrap each section marked "Animated on scroll" in `contracts/homepage-ui.md` in `Reveal`. Every section returns `null` when it has nothing to show.

- [X] T053 [P] [US1] Create `src/components/TopBar.tsx` with `id="top-bar"`, fixed with CSS `position: sticky`: wordmark from `name`, the visible nav links inside `ActiveNav`, `HireButton`, and `ScrollProgress`
- [X] T054 [P] [US1] Create `src/components/sections/Hero.tsx` with `id="hero"`, not wrapped in `Reveal`: `h1`, subhead, See my work link to `#work` (only when featured work exists), `HireButton`, trust line as plain text, and `HeroVisual`, or the real `photo` if one is set
- [X] T055 [P] [US1] Create `src/components/sections/Proof.tsx` with `id="proof"`, showing each metric's value and label
- [X] T056 [P] [US1] Create `src/components/sections/Services.tsx` with `id="services"`, showing one card in `Stagger` for every service in content, linking through `cardHref`, with lift styles only on cards that have a link
- [X] T057 [P] [US1] Create `src/components/sections/FeaturedWork.tsx` with `id="work"`: up to 3 cards in `Stagger`, with generated cover or real image, client type, one-line result and stack tags. A card links through `cardHref`, with lift styles only when it has a link
- [X] T058 [P] [US1] Create `src/components/sections/HowIWork.tsx` with `id="how-i-work"`, showing the steps in order with `TimelineLine`
- [X] T059 [P] [US1] Create `src/components/sections/TechStack.tsx` with `id="tech-stack"`, grouping generated tiles or real logos in `Stagger`, with a text name for each, and hiding groups with no items
- [X] T060 [P] [US1] Create `src/components/sections/AboutSnippet.tsx` with `id="about"`: generated illustration or real photo, three sentences, and a link to `/about` only when `linkLabel` is set
- [X] T061 [P] [US1] Create `src/components/sections/Testimonials.tsx` with `id="testimonials"`, showing each quote with whichever of name, role and company are present
- [X] T062 [P] [US1] Create `src/components/sections/Faq.tsx` with `id="faq"`, using native `details` and `summary` with no JavaScript
- [X] T063 [P] [US1] Create `src/components/sections/Closing.tsx` with `id="closing"`, showing the headline and `HireButton`
- [X] T064 [P] [US1] Create `src/components/Footer.tsx` with `id="footer"`: name, year from the build, `footerLine` as plain text, and the visible nav links
- [X] T065 [P] [US1] Create `src/app/not-found.tsx` with text from `content/home/not-found.yaml`, a link to the homepage and `HireButton` (FR-037)
- [X] T066 [US1] Compose all sections in `src/app/page.tsx` in the order in FR-001, and render `TopBar` and `Footer` in `src/app/layout.tsx`, so every page has them, including not-found

**Checkpoint**: T048 to T052 pass on the full fixture. US1 is the MVP

---

## Phase 4: User Story 2 - First screen on a phone (Priority: P1)

**Goal**: The headline and a Hire button are visible without scrolling on a phone.

**Independent Test**: Load the homepage at 375 by 553 and confirm the headline and a Hire button are fully visible before scrolling.

### Tests for User Story 2

- [X] T067 [P] [US2] Create `tests/e2e/first-screen.spec.ts`: at 375 by 553, `h1` and at least one `[data-hire]` are fully inside the viewport on load, on the full, empty and real builds; at 375 wide on the full build, Work, Services and About can be reached from `#top-bar`, and selecting one closes the menu; at 320 wide, the page doesn't scroll sideways; every `a`, `button` and `summary` is at least 44 by 44 pixels; with `#top-bar` fixed, following See my work leaves the top of `#work` visible below it

### Implementation for User Story 2

- [X] T068 [US2] Update `src/components/TopBar.tsx`: below the desktop breakpoint, collapse the links into a native `details` and `summary` menu with no JavaScript, closed by default, with a labelled `summary`, keeping the wordmark and `HireButton` visible (FR-029)
- [X] T069 [US2] Update `src/components/sections/Hero.tsx` for mobile-first layout: at narrow widths the order is headline, subhead, `HireButton`, See my work, trust line, photo, with the photo beside the text on desktop (FR-003)

**Checkpoint**: T067 passes

---

## Phase 5: User Story 3 - Go to a matching service (Priority: P2)

**Goal**: A client reads the service cards. Links appear with feature 002.

**Independent Test**: Confirm each card shows its fields. Links appear once feature 002 sets `hasPage`.

### Tests for User Story 3

- [X] T070 [P] [US3] Create `tests/e2e/services.spec.ts` on the full fixture: one card per service in `order`, each with an outcome headline, one line and exactly 3 deliverables, no link while `hasPage` is false, and no lift styles on cards without a link. Create `tests/checks/links.test.mjs`, importing `cardHref` from `src/lib/content/links.ts`, asserting it returns `/<slug>` when `hasPage` is true and nothing when it's false

No implementation task is needed, because the `Services` section is built in US1.

**Checkpoint**: T070 passes

---

## Phase 6: User Story 4 - Edit the page through content only (Priority: P2)

**Goal**: Content changes need no component changes, and empty sections disappear.

**Independent Test**: Build the empty fixture and confirm hidden sections leave no heading or gap.

### Tests for User Story 4

- [X] T071 [P] [US4] Create `tests/e2e/empty-states.spec.ts` on the empty fixture: `#proof`, `#services`, `#work`, `#how-i-work`, `#tech-stack`, `#about`, `#testimonials` and `#faq` are absent; See my work is absent; no nav link points to a hidden section; the unapproved testimonial's quote is nowhere in the page; `#top-bar`, `#hero`, `#closing` and `#footer` are present
- [X] T072 [P] [US4] Create `tests/e2e/resilience.spec.ts` on the full fixture: with JavaScript disabled, and separately with reduced motion emulated, every section is visible with no scrolling, and Hire links and FAQ work; with all `/_next/static/**/*.js` requests blocked, every section is still visible; with scripts running, tabbing to a link in a section outside the viewport makes that section visible; with print media emulated, every section is visible. Also read the built `index.html` and assert no `[data-reveal]` element has an inline `opacity:0`. With scripts running: the scroll progress line grows on scrolling; the top bar marks the section on screen with `aria-current`; the how I work line grows on scrolling; every `document.getAnimations()` entry that runs on its own ends within 5 seconds; and tabbing to any link leaves it clear of the fixed top bar

### Implementation for User Story 4

- [X] T073 [US4] Review every component under `src/components/` and `src/app/page.tsx`, and move any remaining visible text into content or `site.config.ts` (FR-020)
- [X] T074 [US4] Fix anything in `src/components/sections/` needed to pass T071 and T072, so a hidden section leaves no wrapper, heading or gap

**Checkpoint**: T071 and T072 pass, and `pnpm test:checks` fails correctly on every invalid fixture

---

## Phase 7: User Story 5 - Tagged proposal links stay safe (Priority: P3)

**Goal**: A source tag changes nothing on the page.

**Independent Test**: Visit with a source tag and confirm nothing changes.

### Tests for User Story 5

- [X] T075 [P] [US5] Create `tests/e2e/source-tag.spec.ts` on the full fixture: the page at `/?src=upwork-chatbot` has the same text and Hire URLs as `/`, and a very long or unusual `src` value never appears in the page. On port 4103, the canonical address has no query string

No implementation task is needed, because no code reads `src`.

**Checkpoint**: T075 passes

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Deployment and final validation

- [X] T076 Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test:checks`, `pnpm test:e2e`, `pnpm test:lighthouse` and `pnpm build`, in that order, and fix every failure
- [X] T077 If `test:lighthouse` scores under 95 or scripts exceed 220 KB, cut effects in this order: `ActiveNav`, `TimelineLine`, `ScrollProgress`, then `Stagger`, keeping `Reveal` last. Record the final homepage script size in `specs/001-homepage/research.md`
- [ ] T078 Ravi: read the drafted content, commit, and run `pnpm site:deploy`. In GitHub, set Settings, Pages, Source to Deploy from a branch, `gh-pages`, root folder, and turn on a required status check on `main`. Then run the manual checks in `specs/001-homepage/quickstart.md`, including a Lighthouse run on the live site

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. T001 first, because `output: "export"` in T005 can't build with the health route
- **Foundational (Phase 2)**: Depends on Setup
- **User stories (Phases 3 to 7)**: All depend on Foundational
- **Polish (Phase 8)**: Depends on the stories being complete

### User Story Dependencies

| Story | Depends on | Notes |
|---|---|---|
| US1 (P1) | Foundational | MVP |
| US2 (P1) | US1 | Refines `TopBar` and `Hero` from US1 |
| US3 (P2) | US1 | Test only. Card links appear with feature 002 |
| US4 (P2) | US1 | Needs every section in place to prove hiding |
| US5 (P3) | US1 | Test only, and needs the page in place |

### Within Each Story

- Write tests first and see them fail
- Section components before composing them in `page.tsx`

## Parallel Opportunities

- **Phase 1**: T002, T004 and T008 together
- **Phase 2**: T009, T016 to T026, T030 to T032, T036, T037 and T040 to T042, once their inputs exist
- **User Story 1**: T048 to T052 together, then T053 to T064 together, because each is its own file
- **After US1**: US2, US3 and US5 can run alongside each other, apart from shared files

### Parallel Example: User Story 1

```bash
# All tests for User Story 1 together
T048 tests/e2e/hire.spec.ts
T049 tests/e2e/homepage.spec.ts
T050 tests/e2e/smoke.spec.ts
T051 tests/e2e/accessibility.spec.ts
T052 tests/e2e/accent.spec.ts

# Then all section components together
T053 to T064, one file each
```

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2
2. Complete Phase 3 (US1) and Phase 4 (US2), the two P1 stories
3. Stop and validate with the full fixture

### Incremental Delivery

1. Add US3, then US4, then US5, running the gates after each
2. Finish with Phase 8
3. The homepage can go live on its own, because its links go to its own sections until features 002 to 004 ship

## Notes

- `[P]` tasks touch different files and have no dependencies on incomplete tasks
- Never invent metrics, client names or quotes. Leave them out, and the section stays hidden
- Commit only when the project owner asks
