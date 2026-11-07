# Contract: Commands and Build Checks

## Commands

| Command | Does | Fails when |
|---|---|---|
| `pnpm build` | Generates images, builds to `out/`, removes scripts from the not-found page, then runs the compliance scan | Content is invalid, or the scan finds anything |
| `pnpm lint` | ESLint | Any lint error |
| `pnpm format:check` | Prettier | Any unformatted file |
| `pnpm typecheck` | `tsc --noEmit` in strict mode | Any type error |
| `pnpm test:checks` | Proves the scan and content validation catch bad input | A bad input gets through |
| `pnpm test:e2e` | Builds the test and real content, runs Playwright and axe | Any test or violation |
| `pnpm test:lighthouse` | Audits the homepage and not-found page on test and real content, on phone and desktop settings, using the median of 3 runs. Run `test:e2e` first, because it uses those builds | Performance, accessibility, best practices or SEO is under 95, or scripts exceed 220 KB compressed |
| `pnpm site:deploy` | Runs every gate, builds with the `/portfolio` base path, then publishes `out/` to the `gh-pages` branch | Any gate fails, or there are uncommitted changes |
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

`.github/workflows/quality.yml` runs on every pull request to `main` and every push to `main`: ESLint, Prettier, typecheck, `test:checks`, `test:e2e`, `test:lighthouse`. It doesn't deploy.

A required status check on `main` must be turned on in GitHub for this to block merges. Direct pushes to `main` are checked after the fact, but they can't change the live site.

## Deployment

GitHub Actions doesn't deploy. `pnpm site:deploy` runs `scripts/deploy.mjs` on Ravi's machine:

1. Stop if there are uncommitted changes.
2. Run lint, format, typecheck, `test:checks`, `test:e2e` and `test:lighthouse`, stopping at the first failure.
3. Run `pnpm build` with `PAGES_BASE_PATH=/portfolio`.
4. Publish `out/` with `gh-pages -d out -b gh-pages --nojekyll`, using the source commit in the message.

The script is `site:deploy` because `pnpm deploy` is a built-in pnpm command.

| Setting | Value |
|---|---|
| Site address | `https://ravi-teja-t.github.io/portfolio/` |
| Repo setting | Settings, Pages, Source: Deploy from a branch, `gh-pages`, root folder |
| Node version | `.node-version` in the repo |
| pnpm version | `packageManager` in `package.json` |

`--nojekyll` is required, because Jekyll would otherwise remove the `_next` folder.

GitHub Pages can't set custom security headers and has no preview deploys.
