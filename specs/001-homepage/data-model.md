# Data Model: Homepage

**Feature**: [spec.md](./spec.md) | **Date**: 2026-11-06

All data lives in files and is read at build time. There is no database and no runtime data. File locations are in [contracts/content-files.md](./contracts/content-files.md).

**Validation**: a missing or invalid field on an item that exists fails the build and names the file and field. An optional file or list that's absent or empty hides its section (FR-021).

## Site config

`site.config.ts`. One record, used across the whole site.

| Field | Type | Required | Rules |
|---|---|---|---|
| `upworkUrl` | URL | yes | `https`, host `www.upwork.com` or `upwork.com`, path starting `/freelancers/~`. The only place this value is set (FR-016) |
| `siteUrl` | URL | yes | The live address, `https://ravi-teja-t.github.io/portfolio`. Used for canonical addresses (FR-033) |
| `name` | text | yes | Wordmark and footer name |
| `tagline` | text | yes | Identity line, also the default page description |
| `nav` | list of label and href | yes | Work to `#work`, Services to `#services`, About to `#about`, until features 002 to 004 switch them to pages |
| `hireLabel` | text | yes | "Hire me on Upwork" |
| `footerLine` | text | yes | "Founder of Ango Digital Tech", rendered as plain text |

## Homepage content

One YAML file per block in `content/home/`.

| File | Required | Fields |
|---|---|---|
| `hero.yaml` | yes | `headline`, `subhead`, `seeWorkLabel`, `trustLine`, optional `photo` (Real image) |
| `metrics.yaml` | no | List of Metric. Up to 4 approved, more fails the build |
| `how-i-work.yaml` | no | List of steps, each with `title` and `text`. Reused by feature 004 |
| `tech-stack.yaml` | no | List of Tech group |
| `about.yaml` | no | `sentences` (exactly 3), optional `photo` (Real image), optional `linkLabel`, shown once the About page exists |
| `faq.yaml` | no | List of FAQ item |
| `closing.yaml` | yes | `headline` |
| `sections.yaml` | yes | Heading text for each section (FR-020) |

## Metric

| Field | Type | Required | Rules |
|---|---|---|---|
| `value` | text | yes | For example "40%" |
| `label` | text | yes | |
| `approved` | true or false | yes | Shown only when true (FR-022) |

## Testimonial

One YAML file each in `content/testimonials/`.

| Field | Type | Required | Rules |
|---|---|---|---|
| `quote` | text | yes | |
| `approved` | true or false | yes | Shown only when true |
| `name`, `role`, `company` | text | no | Left out of the file when the client hasn't approved showing it |
| `order` | number | no | Display order |

Up to 3 approved testimonials. More fails the build.

## FAQ item

| Field | Type | Required |
|---|---|---|
| `question` | text | yes |
| `answer` | text | yes |

## Tech group

| Field | Type | Required | Rules |
|---|---|---|---|
| `group` | text | yes | AI, Backend, Cloud and DevOps, or Healthcare |
| `items[].name` | text | yes | Text name for every logo (FR-009) |
| `items[].logo` | file path | no | Must exist if set. Otherwise a tile is generated from the name |

A group with no items is hidden.

## Generated images

Every image is generated at build time, so content needs no image fields. Names and sizes follow a fixed convention in `scripts/generate-images.mjs`, which is also how `ResponsiveImage` gets explicit `width` and `height`. See research R4.

## Real image

Optional, and replaces a generated image.

| Field | Type | Required | Rules |
|---|---|---|---|
| `src` | file path | yes | Under `public/images/`, with AVIF and WebP versions present |
| `alt` | text | yes | |
| `width`, `height` | number | yes | Explicit, to prevent layout shift |

## Service

One MDX file per service. Feature 001 reads the frontmatter only.

| Field | Type | Required | Rules |
|---|---|---|---|
| `slug` | text | yes | Page address, unique. Must not clash with `work`, `about` or `services` |
| `title` | text | yes | |
| `order` | number | yes | AI agents and automation first |
| `outcomeHeadline` | text | yes | |
| `oneLine` | text | yes | |
| `deliverables` | list of text | yes | Exactly 3 |
| `hasPage` | true or false | no | Defaults to false. When true, the card links to `/<slug>` |

Feature 002 adds its fields to this record.

## Case study

One MDX file per case study. Feature 001 reads only the card fields.

| Field | Type | Required | Rules |
|---|---|---|---|
| `slug` | text | yes | Unique. Must not contain an unapproved client name |
| `title` | text | yes | Stated as a result |
| `order` | number | yes | AikaIQ first |
| `listed` | true or false | yes | Unlisted items never appear on the homepage |
| `clientType` | text | yes | |
| `result` | text | yes | The one-line result |
| `stack` | list of text | yes | At least 1 |
| `image` | Real image | no | Otherwise a cover is generated from the title and stack |
| `hasPage` | true or false | no | Defaults to false. When true, the card links to `/work/<slug>` |

Feature 003 adds its fields to this record.

## Derived rules

These run in the loader, before any page sees the data.

| Rule | Result |
|---|---|
| Approval filter | Unapproved metrics and testimonials are removed, so they can't reach the built output |
| Featured work | Listed case studies sorted by `order`, first three kept |
| See my work | Shown only if featured work has at least 1 item |
| Section visibility | A section displays only when it has at least 1 item to show |

Placeholders are caught twice: in raw content by the loader, so one in an item that isn't displayed still fails, and in built pages by the compliance scan. See [contracts/build-checks.md](./contracts/build-checks.md).

## Relationships

- **Site config** supplies the Upwork URL to every Hire button.
- **Homepage content** reads service and case study cards from their own files, so nothing is entered twice.
- **Service** and **Case study** are extended by features 002 and 003, and linked to each other there.

There are no state transitions. A change is a file edit followed by a rebuild.
