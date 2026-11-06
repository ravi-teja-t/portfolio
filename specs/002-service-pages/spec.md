# Feature Specification: Service Pages

**Feature Branch**: `main` (no feature branch created)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Build four service landing pages (/ai-automation, /backend, /healthcare, /web-apps) plus a Services index listing all four. Ravi links these pages from Upwork proposals for matching jobs. Each page, in order: headline naming the buyer's problem; who it's for (2-3 client types); what Ravi delivers (3-6 bullets); 1-2 matching case studies pulled from case study content; how an engagement runs, with a typical timeline; the stack for this service; a service-specific FAQ; Hire me on Upwork button. All four share one layout, and each page's content lives in its own content file. Adding a fifth service needs only a new content file. Out of scope: pricing tables."

## User Scenarios & Testing *(mandatory)*

These pages are what Ravi links from proposals, so for most clients a service page is the first page they see. The top bar, footer, Hire me on Upwork button, compliance rules and source tag handling are the same as in feature 001.

### User Story 1 - Client lands on the matching service page (Priority: P1)

A client who posted a job clicks the link in Ravi's proposal, lands on the page for that kind of work, recognises their problem in the headline, sees matching proof, and clicks Hire me on Upwork.

**Why this priority**: The portfolio plan calls this the biggest lever on the site. A page that matches the job converts better than a general homepage.

**Independent Test**: Open /ai-automation directly, read it top to bottom, and confirm all eight blocks appear in order and the Hire button opens the configured Upwork URL in a new tab.

**Acceptance Scenarios**:

1. **Given** a client opens a service page directly, **When** the page loads, **Then** the headline names the buyer's problem.
2. **Given** a service page, **When** the client scrolls, **Then** they see, in order: headline, who it's for, what Ravi delivers, matching case studies, how an engagement runs with a typical timeline, the stack, the FAQ, and a Hire me on Upwork button.
3. **Given** a matching case study on the page, **When** the client selects it, **Then** they go to that case study page.
4. **Given** a phone 375 pixels wide, **When** a service page loads, **Then** the headline and a Hire me on Upwork button are visible without scrolling.

---

### User Story 2 - Add a service with one content file (Priority: P2)

Ravi adds a fifth service by adding one content file. The new page appears with the same layout and no code changes.

**Why this priority**: Constitution Principle III requires this, and it keeps the site cheap to extend.

**Independent Test**: Add a test service content file, rebuild, and confirm its page exists, and that it appears on the Services index and homepage, with no code edited.

**Acceptance Scenarios**:

1. **Given** a new valid service content file, **When** the site is rebuilt, **Then** the service has its own page in the shared layout.
2. **Given** a new valid service content file, **When** the site is rebuilt, **Then** it appears on the Services index and the homepage services section.
3. **Given** a change to one service's content file, **When** the site is rebuilt, **Then** only that service's content changes.

---

### User Story 3 - Compare services on the index (Priority: P3)

A client browsing the site opens the Services index, sees every service, and picks the one that fits.

**Why this priority**: Most clients arrive on a specific page, so the index serves a smaller group.

**Independent Test**: Open the Services index and confirm that all four services are listed and each links to its page.

**Acceptance Scenarios**:

1. **Given** the Services index, **When** it loads, **Then** every service is listed in its set order with AI agents and automation first.
2. **Given** a service on the index, **When** the client selects it, **Then** they go to that service's page.

---

### Edge Cases

- **No matching case study**: the case study block is hidden, and the rest of the page still works. This may apply to the healthcare page until a case study exists.
- **More than two matching case studies**: only the first two in the set order are shown.
- **Unlisted case study**: it is never shown on a service page, even if it matches.
- **Service page address clashes with another page** (for example `work` or `about`) or with another service: the production build fails.
- **Required block missing or outside its range** (fewer than 2 or more than 3 client types, fewer than 3 or more than 6 deliverables): the production build fails with the file name and reason.
- **Empty service FAQ**: the FAQ block is hidden.
- **Service file names a case study that doesn't exist**: the production build fails.
- **Source tag on a service page link**: it changes nothing on the page, the same as on the homepage.
- **Link shared in a proposal**: the page has its own title and description, so previews and browser tabs identify the service.

## Requirements *(mandatory)*

### Functional Requirements

**Pages**

- **FR-001**: The site MUST have service pages at /ai-automation, /backend, /healthcare and /web-apps.
- **FR-002**: The site MUST have a Services index listing every service, each linking to its page, in a set order with AI agents and automation first.
- **FR-003**: Every service page MUST use one shared layout.
- **FR-004**: Each service page MUST show, in order: a headline naming the buyer's problem; who it's for (2 to 3 client types); what Ravi delivers (3 to 6 bullets); 1 to 2 matching case studies; how an engagement runs, with a typical timeline; the stack for this service; a service-specific FAQ; and a Hire me on Upwork button.
- **FR-005**: Each service page and the Services index MUST have their own page title and description.
- **FR-006**: The top bar, footer and Hire me on Upwork button MUST behave as defined in feature 001.

**Content**

- **FR-007**: Each service's content MUST live in its own content file.
- **FR-008**: Adding a service MUST need only a new content file. It MUST then appear as a page, on the Services index and on the homepage.
- **FR-009**: Matching case studies MUST come from case study content (feature 003), never be re-entered in the service file.
- **FR-010**: A service page MUST NOT show unlisted case studies.
- **FR-011**: A block that has no content and is optional (case studies, FAQ) MUST be hidden entirely, including its heading.
- **FR-012**: The production build MUST fail if a required block is missing, a count is out of range, an address clashes, or a referenced case study doesn't exist.

**Constitution rules**

- **FR-013**: Service pages MUST NOT contain contact details or contact methods, and MUST be covered by the build scan for emails, phone numbers and banned domains.
- **FR-014**: Service content MUST be covered by the build check for placeholder values.
- **FR-015**: A source tag on a link to any service page MUST NOT change the page or any Hire me on Upwork URL.
- **FR-016**: Service pages MUST NOT show pricing tables.
- **FR-017**: Service pages and the Services index MUST conform to WCAG 2.2 AA, render as static content by default, and fit the headline and a Hire me on Upwork button on the first screen at 375 by 553 pixels.

### Key Entities

- **Service**: name, page address, display order, page title and description, outcome headline, one line and three deliverables (for the card in feature 001), buyer-problem headline, client types, deliverables, engagement steps, typical timeline, stack, FAQ items.
- **Case study**: defined in feature 003. It names the services it relates to, and that link drives both the matching here and the filter on the Work index.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four service pages and the Services index are reachable by their addresses, and each shows every block with content, in the set order.
- **SC-002**: A fifth service can be added with one new content file and no code changes, and it appears in all three places.
- **SC-003**: In a test with five non-technical people, at least four can say within 60 seconds who a service page is for and what they would get.
- **SC-004**: 100% of Hire me on Upwork buttons on these pages open the configured Upwork URL in a new tab.
- **SC-005**: Every page scores 95 or higher in every category of a standard automated web quality audit, and an accessibility review finds no WCAG 2.2 AA failures.
- **SC-006**: A scan of the published pages finds no email addresses, phone numbers or banned domains.
- **SC-007**: A service page opened with a source tag looks exactly the same as without one.

## Assumptions

- **Service page addresses**: services sit at the top level of the site (for example /backend), as specified, and the index is at /services.
- **Matching**: each case study names the services it relates to. A service page shows up to two of these, using the case study display order.
- **Same-page Hire button**: the block at the end of the page is required. The top bar button satisfies the first-screen rule.
- **Initial content**: headlines, buyers and related job types start from the service table in "Ravi Teja — Portfolio Site Plan for Upwork".
- **Healthcare claims**: healthcare content MUST NOT claim a certification or compliance status that isn't true.
- **Timelines**: a typical timeline is a general range, not a promise or a price.
- **Dependencies**: this feature uses the top bar, footer and Hire button from feature 001, and the case study content from feature 003. When it ships, the Services link and service cards switch from homepage sections to these pages.
- **Content Ravi must supply**: the content for each service, including real timelines and FAQ answers.
- **Out of scope**: pricing tables.
