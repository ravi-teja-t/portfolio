# Feature Specification: About Page

**Feature Branch**: `main` (no feature branch created)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Build the About page: photo; Ravi's story (backend engineering background, move into AI automation); what Ango Digital Tech is and what was built under it; working hours that overlap with US and EU clients; how engagements run; Hire me on Upwork button. Ango Digital Tech appears as plain text, not a link."

## User Scenarios & Testing *(mandatory)*

The top bar, footer, Hire me on Upwork button, compliance rules and source tag handling are the same as in feature 001.

### User Story 1 - Decide Ravi is a safe hire (Priority: P1)

A client who is nearly convinced opens the About page to see who they would be working with. They see a real person, a credible background and a working pattern that fits them, then click Hire me on Upwork.

**Why this priority**: Clients hiring a stranger want reassurance before they send an invite. This is the page's only job.

**Independent Test**: Open the About page and confirm each block appears in order, and that the Hire button opens the configured Upwork URL in a new tab.

**Acceptance Scenarios**:

1. **Given** the About page, **When** it loads, **Then** the client sees, in order: photo; Ravi's story; what Ango Digital Tech is and what was built under it; working hours that overlap with US and EU clients; how engagements run; and a Hire me on Upwork button.
2. **Given** a client in the US or EU, **When** they read the working hours, **Then** they can tell which hours overlap with their working day.
3. **Given** the Hire me on Upwork button, **When** the client selects it, **Then** the configured Upwork profile opens in a new tab.
4. **Given** a phone 375 pixels wide, **When** the page loads, **Then** the page headline and a Hire me on Upwork button are visible without scrolling.

---

### User Story 2 - Keep Ango Digital Tech as credibility only (Priority: P1)

A client reads about Ango Digital Tech and sees that Ravi runs a real business, but has no way to leave for a site that could offer contact details.

**Why this priority**: A link to a site with contact details would break constitution Principle I and put Ravi's Upwork account at risk.

**Independent Test**: Check every mention of Ango Digital Tech on the page and confirm none is a link.

**Acceptance Scenarios**:

1. **Given** any mention of Ango Digital Tech, **When** a client selects the text, **Then** nothing happens, because it is plain text.
2. **Given** content that adds a link to an Ango Digital Tech website, **When** a production build runs, **Then** the build fails.

---

### User Story 3 - Edit the story through content (Priority: P3)

Ravi updates the story, working hours or Ango Digital Tech paragraph by editing content, with no code changes.

**Why this priority**: The page changes rarely, but constitution Principle III still applies.

**Independent Test**: Change the working hours in content, rebuild, and confirm the page shows the change with no code edited.

**Acceptance Scenarios**:

1. **Given** a change to the About content, **When** the site is rebuilt, **Then** the page shows the change.
2. **Given** an optional block with no content, **When** the site is rebuilt, **Then** that block is hidden, with no empty heading or gap.

---

### Edge Cases

- **No real photo yet**: the page uses the generated illustration from feature 001, never a fabricated portrait.
- **Working hours missing**: the block is hidden.
- **Story or Hire button content missing**: the production build fails, because these are required.
- **Working hours and time zones**: hours are stated with their time zone, so they can't be misread.
- **Hours read as a contact invitation**: the text describes availability on Upwork only, and doesn't invite direct contact.
- **Source tag on a link to this page**: it changes nothing on the page, the same as on the homepage.

## Requirements *(mandatory)*

### Functional Requirements

**Page**

- **FR-001**: The site MUST have an About page showing, in order: a photo; Ravi's story (backend engineering background, move into AI automation); what Ango Digital Tech is and what was built under it; working hours that overlap with US and EU clients; how engagements run; and a Hire me on Upwork button.
- **FR-002**: Working hours MUST be stated with a time zone.
- **FR-003**: The how engagements run block MUST use the same content as the homepage how I work section, so the two can't disagree.
- **FR-004**: The page MUST have its own title and description.
- **FR-005**: The top bar, footer and Hire me on Upwork button MUST behave as defined in feature 001.

**Ango Digital Tech**

- **FR-006**: Every mention of Ango Digital Tech MUST be plain text, not a link.
- **FR-007**: The production build MUST fail if the site contains a link to an Ango Digital Tech website.

**Content**

- **FR-008**: All About page text MUST come from editable content, not code.
- **FR-009**: Optional blocks with no content MUST be hidden entirely, including their heading. The story and the Hire me on Upwork button are required, and the production build MUST fail without them.
- **FR-010**: About content MUST be covered by the build check for placeholder values.

**Constitution rules**

- **FR-011**: The page MUST NOT contain contact details or contact methods, and MUST be covered by the build scan for emails, phone numbers and banned domains.
- **FR-012**: A source tag on a link to this page MUST NOT change the page or any Hire me on Upwork URL.
- **FR-013**: The page MUST conform to WCAG 2.2 AA, render as static content by default, and fit the page headline and a Hire me on Upwork button on the first screen at 375 by 553 pixels.

### Key Entities

- **About content**: page title and description, photo and its text alternative, story, Ango Digital Tech paragraph, what was built under it, working hours with time zone.
- **How I work steps**: defined in feature 001 and reused here.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The About page shows every block with content, in the set order.
- **SC-002**: No mention of Ango Digital Tech anywhere on the page is a link.
- **SC-003**: In a test with five non-technical people, at least four can say within 60 seconds what Ravi's background is and whether Ravi's hours overlap with theirs.
- **SC-004**: 100% of Hire me on Upwork buttons on the page open the configured Upwork URL in a new tab.
- **SC-005**: The page scores 95 or higher in every category of a standard automated web quality audit, and an accessibility review finds no WCAG 2.2 AA failures.
- **SC-006**: A scan of the published page finds no email addresses, phone numbers or banned domains.

## Assumptions

- **Address**: the About page is at /about.
- **Ango Digital Tech**: following the portfolio plan, it gets one paragraph as a credibility badge. Ravi remains the focus of the page.
- **Built under Ango Digital Tech**: AikaIQ is named as plain text here. Any link to its case study stays on this site.
- **Truthful content**: the story and years of experience match what the homepage says.
- **Dependencies**: this feature uses the top bar, footer, Hire button and how I work content from feature 001. When it ships, the About link switches from the homepage section to this page.
- **Content Ravi must supply**: the photo, the story, the Ango Digital Tech paragraph, and real working hours with a time zone.
- **Out of scope**: team pages, and downloadable resumes or CVs, which usually carry contact details.
