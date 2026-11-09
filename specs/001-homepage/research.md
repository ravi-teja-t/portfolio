# Research: Homepage

**Feature**: [spec.md](./spec.md) | **Date**: 2026-11-06

The stack was set by the project owner, who then delegated the remaining decisions. This file records what was verified and what was decided.

Findings marked **Tested** were confirmed with a throwaway build of this repo's Next.js 16.4.5. Findings marked **Docs** come from the Next.js docs bundled in `node_modules/next/dist/docs/` or from vendor documentation.

## R1. Rendering and hosting

**Decision**: Use `output: "export"` with `trailingSlash: true`, and publish `out/` to a `gh-pages` branch, which GitHub Pages serves using its Deploy from a branch setting. GitHub Actions doesn't deploy, at the project owner's direction. Turn off `cacheComponents` and `partialPrefetching`. The site address is `https://ravi-teja-t.github.io/portfolio/`.

**Rationale**:

- The project owner chose GitHub Pages. The repo is already public, which Pages needs on a free plan.
- **Tested**: the address already returns a page: the repo's old README, rendered by Jekyll. Its text matches `dev-branch`, so that's probably the current source, but the setting isn't readable without logging in.
- **Docs**: a branch can publish only from its root or `/docs`, so built files need their own branch. A dedicated `gh-pages` branch keeps build output out of `main` and leaves `dev-branch` untouched.
- Next.js 16.4.5, already installed, is the latest stable version.
- **Tested**: with `cacheComponents` on, the build failed: `Route segment config "dynamic" is not compatible with nextConfig.cacheComponents`. A static export needs `dynamic = "force-static"` on routes such as `sitemap.ts`, so the two settings conflict.
- **Tested**: with `PAGES_BASE_PATH=/portfolio`, every link, script and style came out under `/portfolio/`, and `/backend` became `backend/index.html`.
- `trailingSlash` matters here. Without it the export writes both `backend.html` and a `backend/` folder, and a static host can treat that address as a folder with no index page.

**Publishing**: `pnpm site:deploy` runs every gate on Ravi's machine, builds, then publishes with the `gh-pages` package. If any gate fails, nothing is published, so a direct push to `main` can't change the live site. `--nojekyll` is required, because Jekyll would otherwise remove the `_next` folder.

**Base path**: a project site lives under `/portfolio/`, so `next.config.ts` reads `basePath` from `PAGES_BASE_PATH`. `scripts/deploy.mjs` sets it to `/portfolio`. Local builds and tests leave it empty. If a custom domain is added later, remove it from that script.

**Docs**: `next/link` applies `basePath` automatically, but images don't. `ResponsiveImage` and any other asset path must add it by hand.

**Limits** (**Docs**): 1 GB site size and a soft 100 GB of bandwidth a month, far beyond this site's needs. GitHub also says Pages isn't meant as "a free web-hosting service to run your online business". A portfolio with no transactions is a common use, but it's worth knowing.

**What GitHub Pages can't do**:

- **Security headers**: community reports consistently say custom response headers aren't supported, and no official statement says otherwise. So `_headers` is dropped. `X-Frame-Options` can't be set from a page. The site has no forms, logins or user data, so the practical risk is low.
- **Preview deploys**: there are none for pull requests. All quality gates still run on every pull request.

**Consequences**: `next start` and default `next/image` optimisation are unavailable (**Docs**). `src/app/api/health/route.ts` calls `connection()`, which a static export can't support, so the SQLite code has to go.

## R2. Analytics

**Decision**: No analytics in v1, at the project owner's direction. No third-party script is added.

**Consequences**:

- Source tags such as `?src=upwork-chatbot` can stay in proposal links and do no harm, but nothing records them. FR-027 now requires only that a tag changes nothing on the page.
- With no third-party script, the site has no cookies and no data leaves the visitor's browser, which strengthens Principle VIII.
- Principle VIII stays in the constitution, so any analytics added later must be cookieless.

**If tracking is wanted later**: Cloudflare's FAQ says its Web Analytics "do not log query strings", so it can't record `src`. A tool that collects URL search parameters would be needed. Adding one is a one-line change in `layout.tsx`.

## R3. Content and validation

**Decision**:

- `content/home/`, `content/testimonials/`, and frontmatter in `content/services/` and `content/case-studies/`, parsed with `yaml` and validated with `zod`.
- Pages import the loader during the build, so a validation error fails the build directly. No separate validator is needed.
- `site.config.ts` holds the Upwork URL, site address, name, tagline and navigation, and is validated by the same loader.

**How "missing fails" and "empty hides" fit together**: a missing or invalid field on an item that exists fails the build. An optional file or list that's absent or empty hides its section. Required files such as `hero.yaml` fail the build if absent.

**Additions to the stated file list**:

- `content/home/tech-stack.yaml` and `about.yaml`, because spec sections 7 and 8 need content.
- `content/home/sections.yaml` for section headings, because FR-020 keeps them out of code.
- `order` on services, because the spec needs a set display order.
- `approved` on metrics, because FR-022 and Principle II require it.
- `hasPage` on services and case studies, so a card links to a page only once that page exists.

**Testimonial attribution**: one `approved` flag per testimonial. A name, role or company the client hasn't approved is left out of the file.

**For features 002 and 003**: **Docs** `@next/mdx` doesn't support frontmatter by default, and under Turbopack its plugins need serialisable options. Choose how to render MDX bodies when planning those features.

## R4. Images

**Decision**: Every image is generated automatically from content. `scripts/generate-images.mjs` runs at the start of `pnpm build`, writes to `public/images/generated/` (gitignored), and needs no external service.

| Image | Generated from | Format |
|---|---|---|
| Case study cover | Title and stack tags, with a pattern seeded by the slug | AVIF and WebP at 640 and 1280 wide |
| About illustration | Initials from `name` | AVIF and WebP |
| Tech tile | Item name | SVG |
| Share image | `name` and hero headline | PNG, 1200 by 630 |

The hero illustration is a build-time inline SVG component, not an image file, so it can animate without JavaScript.

**Rationale**:

- **Tested**: `sharp` converted an SVG to both formats in about 2 seconds, at under 4 KB each.
- **Docs**: the default optimiser doesn't work with a static export.
- The generator reads colours from the `@theme` block in `src/app/globals.css`, so tokens have one source (Principle VI). It skips the accent, and a test checks its SVG output for the accent value.
- Generated images use empty `alt` text, because the title or name always sits next to them as real text.
- Generated tiles avoid brand logo licensing questions. A real `logo` file can still be set per item.

**What's deliberately not generated: a portrait of Ravi.** A fabricated face presented as Ravi would break Principle II, and the portfolio plan asks for a real face. The hero and About use generated illustrations until a real photo is supplied. Setting `photo` in content replaces them with no code change. Likewise, generated covers are illustrations, and must not look like product screenshots.

## R5. Animation and interaction

**Decision**: A rich, professional motion layer, within the conditions in constitution Principle IV, using `framer-motion` through `LazyMotion`, `domAnimation` and `m`.

| Effect | Approach | Needs JavaScript |
|---|---|---|
| Sections reveal on scroll, children staggered | `Reveal` and `Stagger` | Yes |
| Scroll progress line under the top bar | CSS scroll-driven animation | No |
| Current section marked in the top bar | `ActiveNav` | Yes |
| How I work line draws as you scroll | CSS scroll-driven animation | No |
| Hero illustration draws itself once, under 4 seconds | CSS on inline SVG | No |
| Cards with a link lift on hover and focus | CSS | No |
| FAQ answers expand smoothly | CSS on `details`, where supported | No |
| See my work smooth scroll | CSS | No |

**Tested** (homepage scripts, gzipped):

| Setup | Total | Added |
|---|---|---|
| No framer-motion | 170.7 KB | None |
| `LazyMotion`, reveal only | 199.3 KB | 28.6 KB |
| `LazyMotion`, reveal, scroll progress, hover and spring | 206.7 KB | 36.0 KB |
| Standard `motion` import, reveal only | 213.2 KB | 42.5 KB |

**Tested**: the usual `initial` and `whileInView` pattern puts `style="opacity:0;transform:translateY(16px)"` in the built HTML, so content stays invisible if JavaScript fails. The visible-by-default pattern below left no inline `opacity:0` at all.

**Rules**:

1. **The hero headline and Hire button don't animate in.** They must paint immediately, for the first-screen rule and the Largest Contentful Paint score.
2. **Visible by default**: `Reveal` renders visible, using `initial={false}`. After hydration it hides an element only if it's outside the viewport, then fades it in once on entry. If JavaScript is off, fails or arrives late, content simply stays visible.
3. **Reduced motion**: every effect stops under `prefers-reduced-motion: reduce`. Components must render the same HTML either way, and hide with CSS or act in an effect. Rendering differently breaks hydration (see R11).
4. **Print**: a print style forces `[data-reveal]` visible.
5. **Server rendering stays**: motion components wrap server-rendered sections as `children`, so section text stays in the HTML.
6. **Animate only `opacity` and `transform`**, so there's no layout shift.
7. **Nothing loops**: anything that moves on its own stops within 5 seconds, which meets WCAG 2.2.2 without a pause control.
8. **Hover needs a hover device**: hover effects sit inside `@media (hover: hover)`, and focus gets the same treatment.
9. **Prefer CSS** where it can do the job, because it adds no JavaScript.

**Testing**: axe and colour tests run with reduced motion emulated, so no content is mid-fade when measured.

## R6. Design tokens and fonts

**Decision**: Define tokens as CSS variables in Tailwind v4's `@theme` in `src/app/globals.css`.

- Clear Tailwind's default colours, so only project tokens exist.
- Set `--spacing` to `0.5rem`, so spacing utilities step in 8 px.
- Accent: deep blue `#1D4ED8`, used only by `HireButton`. White on it has a contrast ratio of 6.70:1, calculated, which passes AA.
- Focus rings, the scroll progress line and the active nav marker use near-black, so the accent stays exclusive.
- Fonts: Bricolage Grotesque, IBM Plex Sans and JetBrains Mono through `next/font/google`. **Docs** fonts are served from the site's own domain, with no requests to Google at page load. The build itself does need network access. JetBrains Mono uses `preload: false`, because the homepage shows no code.

**Enforcement**: a browser test reads computed colours on every element and fails if the accent appears outside `[data-hire]`.

## R7. Quality gates

**Decision**: all run in GitHub Actions on every pull request and push to `main`, and again in `pnpm site:deploy` before anything is published: ESLint, Prettier, `tsc --noEmit`, the compliance scan, Playwright with axe, and Lighthouse CI on phone and desktop settings.

**Rationale**:

- The scan runs as the last step of `pnpm build`, so a failure also stops a deploy.
- Tests run on both test content and the real `content/` folder, because fictional text can't prove the real headline fits the first screen.
- **Docs**: Lighthouse's canonical audit fails when the link "points to a different domain". Test builds run on `localhost`, so `SITE_CANONICAL=off` leaves canonicals out of them. The base path build keeps them, and tests them there.
- Placeholders are checked twice. The loader walks raw content, so one in an item that isn't displayed still fails, as spec User Story 4 requires. The scan reads visible text and the `alt`, `title` and `content` attributes, and skips `code` and `pre`.
- The scan's outbound allowlist (upwork.com and github.com) catches links a banned list can't anticipate, including any Ango Digital Tech website.
- A broken internal link fails the scan, so the site can't publish a link to a page that doesn't exist.
- Fixture content lets gates run independently of real content, and tests "no approved testimonials". `CONTENT_DIR` selects it.
- Axe automates only part of WCAG, so `quickstart.md` keeps manual keyboard and screen reader checks.

**Lighthouse scope**: the gate covers the homepage and the not-found page. Principle IV covers every page, so each later feature must add its pages to `lighthouserc`.

**Note**: blocking merges also needs a required status check on `main`, which only the repo owner can set.

## R8. Package manager and Node

**Decision**: pnpm 12, pinned with `packageManager` in `package.json`, and Node 26 pinned with `.node-version`. Replace `package-lock.json` with `pnpm-lock.yaml`.

**Rationale**: Node 26.13.0 is what winget installed as LTS. `pnpm` isn't installed, and `corepack` isn't available on this machine, so pnpm has to be installed directly. In GitHub Actions, the pnpm setup action reads `packageManager`. The publish script is named `site:deploy` because `pnpm deploy` is a built-in pnpm command. Recent pnpm versions can block dependency install scripts, so if that affects `sharp` or Playwright, allow them explicitly.

## R9. Production-ready content

**Decision**: The page never shows an empty state, "coming soon" text or a dead link.

- Seed content is written from facts in the project brief and portfolio plan, so the page is complete without inventing anything: services, how I work, tech stack, about, FAQ and an AikaIQ card.
- Metrics and testimonials stay absent until real ones exist. Those sections hide, and the page still reads as finished.
- Until features 002 to 004 exist, Work, Services and About point to sections on the homepage, and cards have no link. A nav link disappears if its section is hidden. Each later feature switches its link on. This lets the homepage go live on its own.
- A styled not-found page ships with the homepage, because the homepage can go live before feature 003.

## R10. Forward note for feature 003

Unlisted case studies must be marked noindex (003 FR-015). GitHub Pages can't send a noindex header, so this has to be a page meta tag. **Tested**: noindex scores 0.6 in Lighthouse's SEO category. Constitution 1.3.0 exempts such pages from that category only.

## R11. Findings from implementation

**Final script size**: 190.0 KB gzipped at page load, and 210.5 KB for every chunk, against the 220 KB limit. The not-found page ships no scripts.

**Hydration failure with reduced motion**: `ScrollProgress` returned `null` under reduced motion, so the first client render didn't match the server HTML. React then threw the page away and rebuilt it, which cost about 300 ms of blocking time and pushed largest paint from 0.8 s to 3.3 s. Fixing it took the phone score from about 0.85 to 0.97. It only appeared in Lighthouse, because this machine's Chrome runs with reduced motion and Playwright doesn't. A regression test now covers both settings.

**Lighthouse now forces normal motion** with `--force-prefers-no-reduced-motion`. Without it, the score depended on the machine's setting and animations went unmeasured.

**Scroll effects moved to CSS**: the progress line and how I work line use scroll-driven animations instead of framer-motion, which removes their JavaScript and hydration risk. Browsers without support show no progress line, and show the how I work line at full length.

**Animation features load lazily**: `LazyMotion` loads `domAnimation` after hydration, which is safe because content is visible by default.

**Not-found page**: it scored 0.92 on phones from framework startup alone, so `scripts/strip-not-found-scripts.mjs` removes its scripts. Its links are plain anchors, so nothing is lost.

**Lighthouse must audit `/`**, not `/index.html`.

**Not tested**: publishing itself, because that changes the live site. `scripts/deploy.mjs` was run only as far as refusing uncommitted changes.

## Sources

- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Lighthouse canonical audit](https://developer.chrome.com/docs/lighthouse/seo/canonical)
- [GitHub community: HTTP headers on Pages](https://github.com/orgs/community/discussions/54257)
- [GitHub community: custom response headers](https://github.com/orgs/community/discussions/199121)
- [Cloudflare Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/)
