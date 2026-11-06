# Contract: Commands and Build Checks

## Commands

| Command | Does | Fails when |
|---|---|---|
| `pnpm build` | Generates images, builds to `out/`, then runs the compliance scan | Content is invalid, or the scan finds anything |
| `pnpm lint` | ESLint | Any lint error |
| `pnpm format:check` | Prettier | Any unformatted file |
| `pnpm typecheck` | `tsc --noEmit` in strict mode | Any type error |
| `pnpm test:checks` | Proves the scan and content validation catch bad input | A bad input gets through |
| `pnpm test:e2e` | Builds fixtures, runs Playwright and axe | Any test or violation |
| `pnpm test:lighthouse` | Audits the homepage on phone and desktop settings, using the median of 3 runs | Performance, accessibility, best practices or SEO is under 95, or scripts exceed 220 KB compressed |
| `pnpm images` | Generates images on their own, for use with `next dev` | The generator can't write an image |

All checks exit non-zero on failure and print the file, the rule and the match.

## Compliance scan

`scripts/check-built-output.mjs` scans every `.html` file in `out/`.

| Rule | Must fail on | Must not fail on |
|---|---|---|
| Email | `name@example.com`, including in inline payloads | Image names such as `photo@2x.webp` |
| Phone | `+1 415 555 0100`, `(415) 555-0100` in visible text | Year ranges, metric values, asset hashes |
| Contact link | Any `mailto:`, `tel:` or `sms:` | |
| Banned domain | Any domain in the list below, in links or text | |
| Outbound link | Any `a` link to a host other than the allowed domains | Internal links |
| Broken link | Any internal `a` link, `#` target, `img` or `source` path with no matching file or `id` in `out/` | Links that include the base path |
| Third-party script | Any `script` with an external `src` | |
| Form | Any `form` element | |
| Placeholder | `[X]`, `[client quote]`, `TODO`, `TBD`, "lorem ipsum" in visible text or `alt`, `title` and `content` attributes | Text inside `code` and `pre` |

**Allowed outbound domains**: `upwork.com`, `github.com`.

**Banned domains** (`scripts/banned-domains.mjs`):

- `wa.me`, `whatsapp.com`, `t.me`, `telegram.org`
- `calendly.com`, `cal.com`
- `skype.com`, `discord.com`, `discord.gg`, `signal.me`
- `linkedin.com`, `x.com`, `twitter.com`, `instagram.com`, `facebook.com`

Matching includes subdomains. A domain is matched as a whole, so `netflix.com` does not match `x.com`.

## Build validation

Content validation runs in the loader during the build. It also rejects placeholders in raw content, including items that aren't displayed. See [data-model.md](../data-model.md).

`pnpm build` is always a production build, so these checks and the scan run every time. Only `next dev` skips them.

## Continuous integration

`.github/workflows/quality.yml` runs on every pull request to `main`: ESLint, Prettier, typecheck, `test:checks`, `test:e2e`, `test:lighthouse`.

A required status check on `main` must be turned on in GitHub for this to block merges.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: it sets `PAGES_BASE_PATH` from `actions/configure-pages`, runs `pnpm build`, and publishes `out/` with `actions/upload-pages-artifact` and `actions/deploy-pages`. A failed scan stops the deploy.

| Setting | Value |
|---|---|
| Site address | `https://ravi-teja-t.github.io/portfolio/` |
| Repo setting | Settings, Pages, Source: GitHub Actions |
| Node version | `.node-version` in the repo |
| pnpm version | `packageManager` in `package.json` |

GitHub Pages can't set custom security headers and has no preview deploys.
