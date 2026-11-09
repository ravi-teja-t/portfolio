# Feature Specification: Homepage

**Feature Branch**: `main` (no feature branch created)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Build the homepage of Ravi Teja's portfolio site. Ravi is a backend engineer (4+ years Java, Spring Boot, microservices, AWS) who builds production-grade AI automation, and founder of Angodigital Technologies." The full brief (visitors, journeys, 12 sections, rules, scope, done-when) is captured in the requirements below.

## User Scenarios & Testing *(mandatory)*

Visitors are Upwork clients who click a link in a proposal. They are usually business owners or product managers, often non-technical, and decide in under a minute whether to invite Ravi to interview.

### User Story 1 - Understand, see proof, hire (Priority: P1)

A client lands from a proposal, reads the headline, scrolls to the featured work, clicks Hire me on Upwork, and Ravi's Upwork profile opens in a new tab.

**Why this priority**: This is the site's only goal. Without it, nothing else matters.

**Independent Test**: Open the homepage, follow See my work to the featured work, click any Hire me on Upwork button, and confirm the configured Upwork profile opens in a new tab.

**Acceptance Scenarios**:

1. **Given** a client on the homepage, **When** they read the first screen, **Then** they see the headline "I build backends, apps and AI that run in production.", the subhead and a Hire me on Upwork button.
2. **Given** a client in the hero, **When** they select See my work, **Then** the page moves to the featured work section.
3. **Given** any Hire me on Upwork button on the page, **When** the client selects it, **Then** the configured Upwork profile opens in a new tab and the homepage stays open.
4. **Given** the Upwork URL is changed in its one configured place, **When** the site is rebuilt, **Then** every Hire me on Upwork button opens the new URL.

---

### User Story 2 - First screen on a phone (Priority: P1)

A client opens the proposal link on a phone and sees the headline and the Hire button without scrolling.

**Why this priority**: Some clients open the link on a phone first, and they decide quickly.

**Independent Test**: Load the homepage at 375 by 553 pixels and confirm the headline and a Hire me on Upwork button are fully visible before any scrolling.

**Acceptance Scenarios**:

1. **Given** a screen 375 pixels wide, **When** the homepage loads, **Then** the full headline and a full Hire me on Upwork button are visible without scrolling.
2. **Given** a screen 375 pixels wide, **When** the client looks for Work, Services and About, **Then** all three can still be reached from the top bar.
3. **Given** a screen 320 pixels wide, **When** the homepage loads, **Then** nothing is cut off and the page does not scroll sideways.

---

### User Story 3 - Go to a matching service (Priority: P2)

A client who cares about one kind of work reads that service's card. Once the service page exists, the card links to it.

**Why this priority**: Service pages are the most persuasive pages for a specific need, but they are a secondary path from the homepage.

**Independent Test**: Confirm each card shows its fields. The link appears on a card once feature 002 provides its page.

**Acceptance Scenarios**:

1. **Given** the services section, **When** the client reads a card, **Then** they see an outcome headline, one line of description and three example deliverables.
2. **Given** a service card whose page exists, **When** the client selects its link, **Then** they arrive at that service's page.
3. **Given** a service card whose page doesn't exist yet, **When** the client views it, **Then** it has no link and doesn't look clickable.

---

### User Story 4 - Edit the page through content only (Priority: P2)

Ravi changes what the homepage says by editing content, with no code changes. Sections with no content disappear.

**Why this priority**: Real metrics and testimonials will arrive over time, and the page has to look finished at every stage.

**Independent Test**: Remove all testimonials from content, rebuild, and confirm the testimonials section is gone with no empty heading or gap.

**Acceptance Scenarios**:

1. **Given** content with no testimonials, **When** the site is built, **Then** the testimonials section does not appear.
2. **Given** a change to any text, metric, testimonial or card in content, **When** the site is rebuilt, **Then** the page shows the change and no code was edited.
3. **Given** content that still contains a placeholder such as a bracketed X, **When** a production build runs, **Then** the build fails and names the placeholder.

---

### User Story 5 - Tagged proposal links stay safe (Priority: P3)

Ravi may add a source tag to a proposal link, such as `?src=upwork-chatbot`. The link works exactly like an untagged one.

**Why this priority**: It keeps tagged links safe, but the site works without them.

**Independent Test**: Visit the homepage with a source tag and confirm nothing on the page changes.

**Acceptance Scenarios**:

1. **Given** a link with a source tag, **When** the client views the page, **Then** the page looks the same as without a tag, and every Hire me on Upwork button still opens the same URL.

---

### Edge Cases

- **Unusual source tag**: a very long or malformed tag is never shown on the page and cannot change it.
- **Upwork URL missing or not an Upwork address**: the production build fails.
- **Headline or Hire button content missing**: the production build fails. These are required, so they are never hidden.
- **Fewer items than the usual count** (for example one testimonial or two metrics): the items that exist are shown. Zero items hides the section.
- **More items than the maximum** (over 4 metrics or 3 testimonials): the production build fails with a clear message, so nothing is dropped silently.
- **More than three listed case studies**: the first three in the set order are shown, so the Work list can grow without breaking the build.
- **No featured work**: the section is hidden and the See my work button is hidden too, so it never points at nothing.
- **Hidden section with a top bar link**: while Work, Services or About points to a homepage section, its link is hidden whenever that section is hidden.
- **Missing address**: the visitor sees a styled not-found page with a route home and a Hire me on Upwork button.
- **Testimonial without approval**: it is not shown. A quote that is approved but has no approved name, role or company shows only the approved parts.
- **No real photo yet**: the hero and about snippet use generated illustrations, and the page still looks finished.
- **Longer headline after an edit**: the first-screen check at 375 pixels catches it before merging.
- **Scripts off, failing or slow**: all content stays visible, and Hire buttons, navigation, See my work and FAQ answers still work.
- **Larger text or landscape**: the first-screen rule doesn't apply, but content reflows with nothing lost.
- **Visitor prefers reduced motion**: scrolling and animation are not animated.
- **Contact details inside an image**: automated scans read text only, so Ravi must check images before publishing.

## Requirements *(mandatory)*

### Functional Requirements

**Page structure**

- **FR-001**: The homepage MUST show its sections in this order: top bar, hero, proof strip, services, featured work, how I work, tech stack, about snippet, testimonials, FAQ, closing call to action, footer.
- **FR-002**: The top bar MUST show the name wordmark, links to Work, Services and About, and a Hire me on Upwork button. A link to a section that is hidden MUST be hidden too. The top bar MUST stay fixed at the top of the screen while scrolling, and MUST NOT hide keyboard focus or the target of an in-page link.
- **FR-003**: The hero MUST show the headline "I build backends, apps and AI that run in production.", a subhead, a See my work button, a Hire me on Upwork button, a photo or generated illustration, and the trust line "Founder, Angodigital Technologies · 4+ years production backend · Web and mobile apps · Healthcare, e-commerce and ERP". On narrow screens the order MUST be: headline, subhead, Hire me on Upwork button, See my work button, trust line, photo. Angodigital Technologies MUST be plain text here.
- **FR-004**: The See my work button MUST move the visitor to the featured work section.
- **FR-005**: The proof strip MUST show up to 4 metrics, each with a value and a label.
- **FR-006**: The services section MUST show one card per service, starting with the four named services: AI agents and automation, Backend and APIs, Healthcare integrations (HL7), and Websites and web apps. Each card MUST have an outcome headline, one line, three example deliverables, and a link to its service page once that page exists.
- **FR-007**: The featured work section MUST show up to 3 case study cards, each with an image, client type, one-line result and stack tags, with AikaIQ first. Each card MUST link to its case study page once that page exists.
- **FR-008**: The how I work section MUST show four steps: scoping chat on Upwork; fixed milestones; weekly demo and written update; handover with code, docs and a walkthrough video.
- **FR-009**: The tech stack section MUST show logos grouped into AI, Backend, Cloud and DevOps, and Healthcare. Every logo MUST have a text name.
- **FR-010**: The about snippet MUST show a photo or generated illustration, three sentences, and a link to the About page once that page exists.
- **FR-011**: The testimonials section MUST show up to 3 client quotes, with name, role and company where approved.
- **FR-012**: The FAQ MUST show 5 expandable questions covering fixed price or hourly, code ownership, NDA, communication, and patient data. Each MUST open and close by keyboard as well as by pointer.
- **FR-013**: The closing section MUST show "Have a process that eats your team's time? Let's automate it." and a Hire me on Upwork button.
- **FR-014**: The footer MUST show the name, the year, "Founder of Angodigital Technologies" as plain text, and links to Work, Services and About.

**Hire button**

- **FR-015**: Every Hire me on Upwork button MUST open the same Upwork profile URL in a new tab.
- **FR-016**: The Upwork profile URL MUST be set in exactly one place.
- **FR-017**: The Hire me on Upwork button MUST be the only element in the accent colour. Links, headings, icons and focus indicators MUST NOT use it.

**Compliance and content**

- **FR-018**: The page MUST NOT contain any contact details or contact method. That means any way to reach Ravi outside Upwork, including email, phone, WhatsApp, Telegram, Skype, Discord, Signal, a contact form, a booking link, a QR code, or a link to a social profile that allows direct messages.
- **FR-019**: The production build MUST fail if a scan of the built page finds an email address, phone number or banned domain.
- **FR-020**: All text, metrics, testimonials and cards MUST come from editable content, not code.
- **FR-021**: A section with no content MUST be hidden entirely, including its heading. See also FR-035.
- **FR-022**: Every factual claim MUST be true, including the trust line, tech logos and FAQ answers. Metrics, client names and testimonials MUST also be shown only if marked approved.
- **FR-023**: The production build MUST fail if content contains a placeholder value.

**Mobile, accessibility and privacy**

- **FR-024**: The headline and a Hire me on Upwork button MUST be fully visible without scrolling in 375 by 553 pixels of visible space, in portrait at default text size. The subhead and See my work are not part of this rule.
- **FR-025**: The page MUST conform to WCAG 2.2 AA.
- **FR-026**: The page MUST render as static content by default, with client-side scripting limited to what it needs to function and the animation allowed by FR-031 and constitution Principle IV.
- **FR-027**: A source tag on an incoming link MUST NOT change the page or any Hire me on Upwork URL.
- **FR-028**: The site MUST NOT set cookies, load third-party scripts or show a cookie banner. It has no analytics in v1.
- **FR-029**: On narrow screens, Work, Services and About MAY collapse into a menu. The menu MUST be closed by default, have a labelled control, expose its open or closed state to assistive technology, and work by keyboard. It MUST close when a link in it is selected. With scripts off, it stays open until the visitor closes it.
- **FR-030**: Every interactive element MUST be at least 44 by 44 pixels.
- **FR-031**: The page MUST feel animated and interactive, with these effects: sections fade in once as they enter the screen, over 400 milliseconds with a 16 pixel rise, with items inside them staggered; cards with a link lift on hover and focus, and cards without one don't; a line under the top bar shows scroll progress; the top bar marks the current section; a line draws along the how I work steps as the visitor scrolls; FAQ answers open smoothly; and the hero illustration draws itself once, in under 4 seconds. The hero headline and Hire me on Upwork buttons MUST NOT animate in. Nothing that moves on its own may run longer than 5 seconds. Content MUST be visible by default, becoming hidden only once scripts are running, so that it stays visible if scripts are off, fail or arrive late, and when printed. All motion MUST stop when the visitor prefers reduced motion. Content reached by link, keyboard or in-page search MUST become visible.
- **FR-032**: Ravi MUST review every real image and video for contact details and client data before publishing, as a step in the release checks.
- **FR-033**: Each page MUST state a canonical address with no source tag, so tagged links don't count as duplicate pages.
- **FR-034**: Every image MUST be generated automatically from content at build time, needing no manual image work. A real photo or logo set in content MUST replace the generated one with no code change. Generated images MUST NOT use the accent colour, and MUST NOT pose as a photo of a real person or a product screenshot.
- **FR-035**: The published page MUST NOT show empty states, "coming soon" text, TODO text, or links to pages that don't exist. The build MUST fail on a broken internal link. See also FR-021.
- **FR-036**: The site MUST work at its GitHub Pages address, under the `/portfolio/` path, and at the site root if a custom domain is added later.
- **FR-037**: A missing address MUST show a not-found page with the top bar, footer, a route to the homepage and a Hire me on Upwork button, with its text from content.
- **FR-038**: Publishing MUST run every quality gate first, and MUST NOT publish if any fails. A push to `main` alone MUST NOT change the live site.

### Key Entities

- **Site config**: the Upwork profile URL, site address, name, tagline and navigation links, held in one file. Editing this file counts as a settings change, not a code change.
- **Homepage content**: hero text, trust line, how I work steps, about snippet, closing text and section headings.
- **Metric**: value, label, approval status.
- **Service**: name, outcome headline, one line, three deliverables, page address, display order. Shared with feature 002.
- **Case study card**: image, client type, one-line result, stack tags, order. Comes from the case study content in feature 003, so nothing is entered twice.
- **Tech item**: name, logo, group.
- **Testimonial**: quote, approval flag, and optional name, role and company. A part the client has not approved is left out of the file.
- **FAQ item**: question and answer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 375 by 553 pixel screen, the headline and a Hire me on Upwork button are fully visible without scrolling on every load.
- **SC-002**: 100% of Hire me on Upwork buttons open the configured Upwork URL in a new tab, and changing the one setting changes all of them.
- **SC-003**: With all testimonials removed, the testimonials section is absent, with no leftover heading or gap.
- **SC-004**: In a test with five non-technical people, at least four can say within 60 seconds what Ravi does, name one piece of proof, and point to how to hire Ravi.
- **SC-005**: The page scores 95 or higher in each of the performance, accessibility, best practices and SEO categories of a standard automated web quality audit, on phone and desktop settings, using the median of 3 runs. The live site with real content passes the same audit before launch.
- **SC-006**: Automated accessibility checks find no WCAG 2.2 AA violations, and Ravi completes a keyboard and screen reader pass of the page before launch with no blocking problems.
- **SC-007**: A scan of the published page finds no email addresses, phone numbers or banned domains.
- **SC-008**: Ravi can change any visible text, metric, testimonial or card without editing code.
- **SC-009**: The page has no broken links, no empty sections and no placeholder text in any build, and every image appears with no manual image work.

## Assumptions

- **Screen height**: "first screen" at 375 pixels wide means 375 by 553 pixels of visible space. That's a 667 pixel tall small phone after its browser toolbars take their share.
- **Calls to action**: following the portfolio plan, Hire me on Upwork buttons are the site's only calls to action. See my work, service card links and top bar links count as navigation, so they satisfy constitution Principle I without linking to Upwork.
- **Top bar**: it stays on screen so a Hire button is always one tap away, which serves the site's only goal. Either the top bar button or the hero button can satisfy the first-screen rule.
- **Top bar links**: until features 002 to 004 exist, Work, Services and About go to their sections on the homepage, and cards have no link. Each feature switches its links to the new pages. So the homepage can go live on its own.
- **Fifth service**: the services section shows every service in content, so a fifth service from feature 002 appears automatically.
- **AikaIQ**: it is Ravi's own product, so its card's client type says so.
- **Approval**: Ravi decides what is approved and marks it in content. A client's name or quote is marked approved only after that client agrees in writing. Written approvals are kept privately, outside this repo.
- **Public repo**: this repo is public, so anything committed can be read even if the site hides it. Real client names, quotes and metrics are added only once approved.
- **Banned domains**: the list includes LinkedIn, X, Instagram, Facebook, WhatsApp, Telegram, booking services such as Calendly, and any Angodigital Technologies website with contact details. The homepage has no GitHub link. If one is added later, that GitHub profile must show no email address.
- **Year**: the footer year is set when the site is built.
- **Generated images**: covers and illustrations are clearly illustrations. The portfolio plan's real photo stays the better option, and takes over as soon as one is added to content.
- **Analytics**: none in v1, at the project owner's direction, so source tags aren't recorded anywhere. Any analytics added later must be cookieless.
- **Privacy notice**: none in v1. The site has no forms, cookies, analytics or third-party scripts, and collects no personal data. This is a practical judgement, not legal advice.
- **Hosting**: GitHub Pages, deployed by GitHub Actions on every push to `main` after all gates pass. It can't set custom security headers and has no preview deployments. All gates still run on every pull request and push to `main`.
- **Initial content**: subhead, service headlines and FAQ topics start from "Ravi Teja — Portfolio Site Plan for Upwork". Tech tiles list only tools named in the project brief and that plan.
- **Drafted content**: the about sentences, FAQ answers and tech list are drafted from the brief and plan, and state things in Ravi's name, so Ravi reads them before the site goes live. The FAQ answer on patient data MUST NOT claim a certification or compliance status that isn't true.
- **Content only Ravi can supply**: real metrics, approved testimonials, a real photo and further case studies. Their sections stay hidden until then.
- **Out of scope**: service pages, case study pages, About page, blog, AI chat demo, dark mode, analytics.
