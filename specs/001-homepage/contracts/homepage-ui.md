# Contract: Homepage UI

What browser tests can rely on. Layout and styling are free to change within these rules.

## Sections

Each section is a landmark element with this `id`, in this order. Hidden sections are absent from the page, not visually hidden.

| Order | `id` | Can be hidden | Animated on scroll |
|---|---|---|---|
| 1 | `top-bar` | No | No |
| 2 | `hero` | No | Illustration only |
| 3 | `proof` | Yes | Yes |
| 4 | `services` | Yes | Yes |
| 5 | `work` | Yes | Yes |
| 6 | `how-i-work` | Yes | Yes |
| 7 | `tech-stack` | Yes | Yes |
| 8 | `about` | Yes | Yes |
| 9 | `testimonials` | Yes | Yes |
| 10 | `faq` | Yes | Yes |
| 11 | `closing` | No | Yes |
| 12 | `footer` | No | No |

## Hire button

Every Hire button is rendered by one component and has:

- the attribute `data-hire`
- an `href` equal to `upworkUrl` from `site.config.ts`
- `target="_blank"` and `rel="noopener noreferrer"`
- the text from `hireLabel`

It appears at least in `top-bar`, `hero` and `closing`. It is a link, so it works with scripts unavailable.

The accent colour may appear only on `[data-hire]` elements.

## Animation

- Animated sections sit inside a `[data-reveal]` element, rendered by the `Reveal` component. `Stagger` delays the items inside them.
- The built HTML never hides a `[data-reveal]` element. It's hidden only after hydration, and only while it's outside the viewport.
- It fades in once on entering the viewport, over 400 milliseconds with a 16 pixel rise. Only `opacity` and `transform` are animated.
- With scripts off, failing or late, with `prefers-reduced-motion: reduce`, and in print, every `[data-reveal]` element is fully visible and doesn't move.
- Reaching an element by link, keyboard or in-page search brings it into the viewport, which reveals it.
- A near-black line under the top bar shows scroll progress, and the current section is marked in the top bar.
- In `how-i-work`, a line draws along the steps as the visitor scrolls.
- Cards with a link lift on hover and focus. Cards without one don't. Hover effects apply only on devices that hover.
- The hero illustration draws itself once, in under 4 seconds. Nothing that moves on its own runs longer than 5 seconds.
- Client components live only in `src/components/motion/`. The progress line and how I work line are CSS scroll-driven animations, not client components.
- Components render the same HTML whatever the motion setting, so hydration never fails.
- The not-found page ships no scripts.

## Other interactions

| Element | Behaviour |
|---|---|
| See my work | Link to `#work`. Absent when `work` is absent. CSS smooth scroll only under `prefers-reduced-motion: no-preference` |
| Service card | Contains a link to `/<slug>` when `hasPage` is true. Otherwise no link |
| Case study card | Contains a link to `/work/<slug>` when `hasPage` is true. Otherwise no link |
| FAQ item | `details` element with a `summary` question |
| Top bar | Stays fixed at the top while scrolling. `scroll-padding-top` keeps link targets and keyboard focus clear of it |
| Top bar links | From `nav`, going to homepage sections until features 002 to 004 switch them to pages. A link to a hidden section is absent. Reachable at 375 pixels wide, through a native `details` menu on narrow screens, which closes when a link is selected |
| Not-found page | Top bar, footer, heading and text from content, a link to the homepage, and a Hire button |

## Viewports

| Size | Rule |
|---|---|
| 375 by 553 | `h1` and at least one `[data-hire]` are fully inside the viewport on load, on test and real content |
| 320 wide | No horizontal scrolling |

In the hero on narrow screens, the order is headline, subhead, Hire button, See my work, trust line, photo.

## Page rules

- Exactly one `h1`, holding the hero headline.
- No cookies are set, and no third-party scripts are loaded.
- No requests go to font services.
- Every interactive element is at least 44 by 44 pixels.
- The homepage states a canonical address with no query string. Canonicals are set per page, never in the root layout. Test builds leave them out, because Lighthouse fails a canonical on another domain.
- Every link and asset works under the `/portfolio/` base path and at the site root.
- Adding `?src=<anything>` changes nothing on the page.
- Every element is reachable and usable by keyboard, with a visible focus indicator.
