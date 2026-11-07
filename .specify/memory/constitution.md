<!--
Sync Impact Report
- Version change: 1.0.0 → 1.3.0, through 1.1.0 and 1.2.0 (MINOR: guidance expanded)
- Modified principles:
  - I. Upwork Compliance: defines a call to action and allowed outbound domains
  - IV. Performance: allows animation under conditions, exempts noindex pages from SEO
  - IX. Quality Gates: adds formatting, accessibility and Lighthouse checks
- Added sections: Amendment history, under Governance
- Removed sections: none
- Templates: not modified. Dependent templates read this constitution at runtime.
- Deferred placeholders: none
- Follow-up TODOs (existing repo state that does not yet comply):
  - Principle VII: src/lib/db.ts, src/app/api/health/route.ts and the SQLite reference in
    README.md still exist. Tasks T001 and T002 remove them.
  - Principles I, II, IX: the build checks and tests do not exist yet.
-->

# Ravi Teja Portfolio Constitution

## Core Principles

### I. Upwork Compliance (NON-NEGOTIABLE)

- The site MUST NOT contain an email address, phone number, WhatsApp or Telegram link, contact
  form, booking link, or link to a social profile that allows direct messages. This applies
  everywhere on the site.
- Every call to action MUST link to the Upwork profile. A call to action is a Hire me on Upwork
  button. Links that move a visitor around the site, such as See my work, are navigation.
- Outbound links MUST go only to upwork.com or github.com. A GitHub link is allowed only if that
  GitHub profile shows no email address.
- An automated check MUST scan the built HTML for email addresses, phone numbers and banned
  domains, and MUST fail the build if it finds any.

**Rationale**: Visitors arrive from Upwork proposals. Offering contact outside Upwork puts the
account at risk, and the site exists to serve that account.

### II. Truthful Content

- Every metric, client name and testimonial MUST be real and approved.
- Placeholder values such as `[X]` MUST fail the production build.

**Rationale**: One invented or unfilled claim discredits the whole site in front of a client
deciding whether to invite Ravi Teja to an interview.

### III. Content-Driven

- Case studies and service pages MUST live as MDX content files.
- Adding a case study or service page MUST NOT require code changes.

**Rationale**: New work has to reach the site quickly, without engineering effort for each entry.

### IV. Performance

- Every page MUST score 95 or higher in every Lighthouse category. Pages deliberately kept out
  of search, such as the not-found page, are exempt from the SEO category only.
- Pages MUST render statically by default.
- Client-side JavaScript MUST be kept to the minimum a page needs to function, plus animation
  and interaction that meet all of these conditions:
  - The hero headline and the Hire me on Upwork button do not animate in.
  - All content stays visible if scripts are off, fail or arrive late, and when a visitor
    prefers reduced motion.
  - Nothing that moves on its own runs longer than 5 seconds.
  - The page still scores 95 or higher and stays within its script size limit.

**Rationale**: A client who clicks through from a proposal gives the site only a few seconds.

### V. Mobile-First and Accessible

- Every page MUST conform to WCAG 2.2 AA.
- The hero headline and the Hire me on Upwork button MUST both fit on the first screen at 375px
  wide.

**Rationale**: The headline and the button are what convert a visitor, so both must be visible
and usable without scrolling, on small screens and with assistive technology.

### VI. Design Consistency

- The design MUST use exactly one accent colour, and that colour MUST be used only for the Hire
  me on Upwork button.
- Spacing, colour and type values MUST come from shared design tokens.

**Rationale**: Reserving the accent colour makes the button the most prominent thing on any page.

### VII. Simplicity

- v1 MUST NOT include a database, authentication or server-side user data.
- Any AI demo added later MUST NOT ask for contact details.

**Rationale**: The site's job is to present fixed content. Each of these adds cost and risk
without helping a visitor decide to send an invite.

### VIII. Privacy

- Analytics MUST be cookieless.
- The site MUST NOT need a cookie banner.

**Rationale**: A consent banner would compete with the headline and the Hire me on Upwork button
on the first screen.

### IX. Quality Gates

- TypeScript strict mode MUST stay enabled.
- Linting and formatting checks MUST pass.
- Playwright smoke tests and automated accessibility checks MUST cover every page.
- Lighthouse checks MUST pass.
- All gates MUST pass before any change is merged.

**Rationale**: Automated gates keep the rules above true as content and code change.

## Project Goal

The site's only goal is to turn Upwork proposal clicks into interview invites. A page, section or
feature that does not serve this goal MUST NOT be added.

## Development Workflow

- The production build MUST fail on any Principle I scan finding or Principle II placeholder.
- Merging MUST be blocked until every Principle IX gate passes.
- Every spec and plan MUST pass a constitution check before work proceeds.

## Governance

This constitution takes precedence over other project practices and documents.

- **Amendments**: every amendment MUST include a written rationale and a version bump.
- **Versioning**: versions follow semantic versioning.
  - MAJOR: a principle or governance rule is removed or redefined incompatibly.
  - MINOR: a principle or section is added, or guidance is materially expanded.
  - PATCH: clarifications and wording changes that do not alter meaning.
- **Compliance**: every spec and plan MUST pass a constitution check against the current version.

**Amendment history**:

- **1.3.0 (2026-11-06)**: Principle IV exempts pages deliberately kept out of search from the
  SEO category. Rationale: Next.js marks the not-found page noindex, which is correct, and
  Lighthouse scores any noindex page below 95, so the rule could not be met as written. Unlisted
  case studies in feature 003 are in the same position.
- **1.2.0 (2026-11-06)**: Principle IV widens "light animation" to animation and interaction,
  and adds a 5 second limit on anything that moves on its own. Rationale: the owner wants a
  more animated, interactive site. The conditions that protect first paint, visibility and
  the score stay in place.
- **1.1.0 (2026-11-06)**: Principle I defines a call to action and allowed outbound domains.
  Principle IV allows light animation under conditions. Principle IX adds formatting,
  accessibility and Lighthouse checks. Rationale: See my work is navigation and had no clear
  basis under Principle I; the owner chose framer-motion, which isn't needed for a page to
  function, and governance has no exception process; and Principle IV's score had no gate.

**Version**: 1.3.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
