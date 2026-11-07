# Contract: Content Files

This is the interface for editing the site. Field rules are in [data-model.md](../data-model.md).

## Layout

```text
site.config.ts             # Upwork URL, site address, name, tagline, nav links

content/
├── home/
│   ├── hero.yaml
│   ├── metrics.yaml
│   ├── how-i-work.yaml
│   ├── tech-stack.yaml
│   ├── about.yaml
│   ├── faq.yaml
│   ├── closing.yaml
│   ├── not-found.yaml     # Text for the not-found page
│   └── sections.yaml      # Section headings
├── services/
│   └── <slug>.mdx         # One file per service
├── case-studies/
│   └── <slug>.mdx         # One file per case study
└── testimonials/
    └── <name>.yaml        # One file per testimonial

public/images/generated/   # Created by every build. Gitignored, never edited by hand
public/images/             # Optional real photos and logos, as AVIF and WebP
```

## Guarantees

1. Editing a content file and rebuilding changes the page, with no component changes.
2. Adding a file to `services/`, `case-studies/` or `testimonials/` adds it to the homepage, subject to the rules in the data model.
3. Removing an optional file, or leaving its list empty, hides that section and its heading.
4. A missing or invalid field fails the build with the file name, the field and the reason.
5. Unapproved items never reach the built output.
6. This repo is public, so real client names, quotes and metrics are committed only once approved.

`site.config.ts` is the one content source written as a TypeScript file. Changing a value there is a settings edit, not a code change.

## Content directory override

The `CONTENT_DIR` environment variable replaces `content/` for a build. Tests use it to build from fixtures. It is not set in production, and it doesn't affect `site.config.ts`.

## Example

Values below are illustrative, not real claims.

```yaml
# content/testimonials/example-client.yaml
quote: "Delivered on time and documented everything."
approved: true
role: "CTO"   # Name and company left out because the client hasn't approved them
```

```yaml
# content/services/ai-automation.mdx frontmatter
slug: ai-automation
title: AI agents and automation
order: 1
outcomeHeadline: Automate support and operations
oneLine: AI that takes repetitive work off your team.
deliverables:
  - AI chat on your docs
  - Ticket triage
  - Workflow agents wired into your CRM or helpdesk
```

## Initial state

The seeded content is written from facts in the project brief and the portfolio plan, so the page is complete without inventing anything. It covers the hero, services, an AikaIQ card, how I work, tech stack, about and FAQ. Metrics and testimonials are absent until real ones exist, so those sections stay hidden. `upworkUrl` is set to Ravi's profile: `https://www.upwork.com/freelancers/~01935144be55391b8e`.
