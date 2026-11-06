# Quickstart: Validate the Homepage

Proves the homepage meets its spec. Commands are defined in [contracts/build-checks.md](./contracts/build-checks.md).

## Prerequisites

- Node.js 26, matching `.node-version`
- pnpm, matching `packageManager` in `package.json`
- `pnpm install`
- `pnpm exec playwright install chromium`
- `upworkUrl` set in `site.config.ts`

## Automated gates

Run these from the repo root. All must pass.

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:checks
pnpm test:e2e
pnpm test:lighthouse
```

## Scenario checks

| # | Scenario | How to check | Expected | Covers |
|---|---|---|---|---|
| 1 | First screen on a phone | `test:e2e` at 375 by 553 | Headline and a Hire button fully visible | SC-001 |
| 2 | Hire buttons | `test:e2e` | All match `upworkUrl`, open a new tab, and have `rel="noopener noreferrer"` | SC-002 |
| 3 | No approved testimonials | `test:e2e` with a fixture holding one unapproved testimonial | `testimonials` section absent, and the quote is nowhere in the output | SC-003, FR-022 |
| 4 | No featured work | `test:e2e` with the empty fixture | `work` section and See my work absent | Edge case |
| 5 | Invalid content | `test:checks` | Build fails and names the file and field | FR-020 |
| 6 | Compliance scan | `test:checks` with bad HTML for each rule | Each case fails. Each "must not fail" case passes | FR-019, FR-023, SC-007 |
| 7 | Accent colour | `test:e2e` | Only on Hire buttons | FR-017 |
| 8 | Accessibility | `test:e2e`, axe with WCAG 2.2 AA tags, reduced motion emulated | Zero violations | SC-006 |
| 9 | Quality score | `test:lighthouse` | 95 or higher in each category, phone and desktop | SC-005 |
| 10 | Source tag | `test:e2e` with `?src=upwork-chatbot` | Page and Hire URL unchanged | FR-027 |
| 11 | No cookies | `test:e2e` | No cookies set, no third-party scripts | FR-028 |
| 12 | Scripts off or failing | `test:e2e` with JavaScript disabled, and with script files blocked | Every section visible, and Hire, navigation and FAQ work | FR-031 |
| 13 | Reduced motion | `test:e2e` with reduced motion emulated | Every section visible without scrolling into view | Edge case |
| 14 | No external fonts | `test:e2e`, watching network requests | No requests to font services | Stack rule |
| 15 | No dead ends | `test:checks`, and every build | Broken links fail the scan | FR-035 |
| 16 | Generated images | `test:e2e` | Every image has loaded, and none uses the accent colour | FR-034 |
| 17 | Base path | `test:e2e`, with a build using `PAGES_BASE_PATH=/portfolio` | Links, styles and images all resolve | FR-036 |

## Manual checks

Automation can't cover these.

1. **Drafted content.** Read the about sentences, FAQ answers and tech list, because they state things in Ravi's name. Change anything that isn't true.
2. **Hosted site.** At `https://ravi-teja-t.github.io/portfolio/`, confirm styles and images appear, and a missing address shows the 404 page.
3. **Keyboard.** Tab through the page and confirm focus is always visible and the FAQ opens with Enter or Space.
4. **Screen reader.** Read the page once with a screen reader (SC-006).
5. **Images and video.** Look through each one for contact details or client data, because scans can't read them (FR-032).
6. **Clarity test.** Ask five non-technical people to view the page for 60 seconds (SC-004).
7. **Lighthouse on the live site.** Run the audit against the live homepage with real content, on phone and desktop settings (SC-005).
8. **Upwork link.** Open a Hire button and confirm it reaches the right profile. An automated request to Upwork returns 403, so this needs a real browser.
9. **Canonical address.** Confirm a page opened with `?src=test-tag` states a canonical address with no query string (FR-033).
