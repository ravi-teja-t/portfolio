# Feature Specification: Case Studies

**Feature Branch**: `main` (no feature branch created)

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Build case study pages and a Work index. Each case study: title stated as a result; snapshot row (client name or type, Ravi's role, timeline, stack tags); the problem; what was built; architecture diagram; results with before/after numbers; optional 1-2 minute walkthrough video; optional client quote; closing Hire me on Upwork button. Client names show only when marked approved; otherwise show the client type. A case study can be marked unlisted: hidden from the Work index but reachable by direct link, so Ravi can share it in a single proposal. The Work index lists all listed case studies and can be filtered by service. First three: AikaIQ, a client AI project, a client backend or healthcare project."

## User Scenarios & Testing *(mandatory)*

The top bar, footer, Hire me on Upwork button, compliance rules and source tag handling are the same as in feature 001.

### User Story 1 - Read a case study and hire (Priority: P1)

A client opens a case study from a proposal or another page, sees the result in the title, understands the problem and what was built, sees before and after numbers, and clicks Hire me on Upwork.

**Why this priority**: Case studies are the main proof, and Ravi links them directly from proposals.

**Independent Test**: Open a case study directly, confirm each block appears in order, and confirm the closing Hire button opens the configured Upwork URL in a new tab.

**Acceptance Scenarios**:

1. **Given** a case study, **When** it loads, **Then** the client sees, in order: a title stated as a result; a snapshot row; the problem; what was built; an architecture diagram; results with before and after numbers; the optional video and quote if present; and a closing Hire me on Upwork button.
2. **Given** a case study with no video or no quote, **When** it loads, **Then** that block is absent, with no empty heading or gap.
3. **Given** a video on the page, **When** the client views it, **Then** it does not play until they start it.

---

### User Story 2 - Protect client identity (Priority: P1)

Ravi publishes work for a client who has not agreed to be named. The site shows only the client type.

**Why this priority**: Naming a client without permission breaks trust and constitution Principle II. It cannot be undone once seen.

**Independent Test**: Build a case study whose client name is not approved, then search the whole built site for that name and confirm it is not there.

**Acceptance Scenarios**:

1. **Given** a case study whose client name is marked approved, **When** it is shown, **Then** the snapshot row shows the client name.
2. **Given** a case study whose client name is not marked approved, **When** it is shown, **Then** the snapshot row shows the client type, such as "a US e-commerce brand".
3. **Given** a client name that is not approved, **When** the built site is searched, **Then** the name appears nowhere, including page titles, descriptions, page addresses and image text alternatives.

---

### User Story 3 - Share an unlisted case study (Priority: P2)

Ravi marks a case study as unlisted and shares its link in one proposal. Only people with the link can reach it.

**Why this priority**: It lets Ravi share niche or sensitive work with one client without promoting it across the site.

**Independent Test**: Mark a case study unlisted, rebuild, confirm it is absent from everywhere it could be listed, then open it by its direct link.

**Acceptance Scenarios**:

1. **Given** an unlisted case study, **When** the Work index loads, **Then** it is not listed under any filter.
2. **Given** an unlisted case study, **When** a client opens its direct link, **Then** the full case study displays, including the Hire me on Upwork button.
3. **Given** an unlisted case study, **When** the site is built, **Then** it is absent from the homepage, service pages and site map, and search engines are told not to index it.

---

### User Story 4 - Browse and filter the Work index (Priority: P2)

A client opens the Work index, sees every listed case study, and filters by the service they need.

**Why this priority**: It helps clients who browse, but most arrive through a direct link.

**Independent Test**: Open the Work index, confirm all listed case studies appear, then apply each service filter and confirm only matching ones remain.

**Acceptance Scenarios**:

1. **Given** the Work index, **When** it loads, **Then** all listed case studies are shown in the set order, with AikaIQ first.
2. **Given** a service filter, **When** the client selects it, **Then** only listed case studies related to that service are shown.
3. **Given** a filter is applied, **When** the client clears it, **Then** all listed case studies are shown again.

---

### User Story 5 - Add a case study with one content file (Priority: P2)

Ravi adds a case study by adding one content file, with no code changes.

**Why this priority**: Constitution Principle III requires this.

**Independent Test**: Add a test content file, rebuild, and confirm its page and Work index entry exist with no code edited.

**Acceptance Scenarios**:

1. **Given** a new valid case study file, **When** the site is rebuilt, **Then** it has its own page and, if listed, appears on the Work index.
2. **Given** a case study related to a service, **When** the site is rebuilt, **Then** it can appear on that service page and under that filter.

---

### Edge Cases

- **Required block missing** (result title, snapshot, problem, what was built, diagram, or results): the production build fails with the file name, whether the case study is listed or unlisted.
- **Client name not approved and no client type given**: the production build fails.
- **Quote not approved**: it is not shown. Its attribution follows the same name approval as the client name.
- **Service with no listed case studies**: its filter option is not shown.
- **No listed case studies at all**: the Work index still loads and offers a Hire me on Upwork button, with no empty list.
- **Scripts unavailable**: all listed case studies are shown, and the filter is not needed to reach them.
- **Old link in a sent proposal after a case study is renamed or removed**: the visitor sees a not-found page with routes to the Work index and the Upwork profile, not a dead end.
- **Unlisted link forwarded**: unlisted means not promoted, not secret. Anyone with the link can open it.
- **Contact details or client data in a diagram, screenshot or video**: automated scans read text only, so Ravi must check these before publishing.
- **Video unavailable**: the rest of the page still works, and the video block does not break the layout.

## Requirements *(mandatory)*

### Functional Requirements

**Case study pages**

- **FR-001**: Each case study MUST have its own page, showing in order: a title stated as a result; a snapshot row (client name or type, Ravi's role, timeline, stack tags); the problem; what was built; an architecture diagram; results with before and after numbers; an optional 1 to 2 minute walkthrough video; an optional client quote; and a closing Hire me on Upwork button.
- **FR-002**: Optional blocks with no content MUST be hidden entirely, including their heading.
- **FR-003**: Each architecture diagram MUST have a text description for people who can't see it.
- **FR-004**: Each video MUST have captions, MUST NOT play until the visitor starts it, and MUST NOT set cookies when the page loads.
- **FR-005**: A case study MAY show a plain text tag saying it was delivered through Ango Digital Tech. This tag MUST NOT be a link.
- **FR-006**: Each page MUST have its own title and description.
- **FR-007**: Case study pages MUST NOT link to any external site other than the Upwork profile and GitHub.

**Client identity**

- **FR-008**: A client name MUST be shown only when marked approved. Otherwise the client type MUST be shown.
- **FR-009**: An unapproved client name MUST NOT appear anywhere in the built site, including titles, descriptions, page addresses and image text alternatives.
- **FR-010**: A client quote MUST be shown only when marked approved.

**Listing**

- **FR-011**: The site MUST have a Work index listing all listed case studies in a set order, with AikaIQ first.
- **FR-012**: The Work index MUST let visitors filter by service and clear the filter.
- **FR-013**: The filter MUST offer only services that have at least one listed case study.
- **FR-014**: A case study MAY be marked unlisted. Unlisted case studies MUST be reachable by direct link, and MUST NOT appear on the Work index, homepage, service pages or site map.
- **FR-015**: Unlisted case study pages MUST tell search engines not to index them.
- **FR-016**: The site MUST show a not-found page with routes to the Work index and the Upwork profile when an address doesn't exist.

**Content**

- **FR-017**: Each case study MUST live in its own content file, and adding one MUST NOT need code changes.
- **FR-018**: Each case study MUST name the services it relates to, and its content MUST supply the homepage card (image, client type, one-line result, stack tags).
- **FR-019**: The first three case studies MUST be AikaIQ, a client AI project, and a client backend or healthcare project.
- **FR-020**: The production build MUST fail if a required block is missing, if a client type is missing where the name isn't approved, or if content contains a placeholder value.

**Constitution rules**

- **FR-021**: These pages MUST NOT contain contact details or contact methods, and MUST be covered by the build scan for emails, phone numbers and banned domains. This includes unlisted pages.
- **FR-022**: A source tag on a link to any of these pages MUST NOT change the page or any Hire me on Upwork URL.
- **FR-023**: These pages MUST conform to WCAG 2.2 AA, render as static content by default, and fit the page headline and a Hire me on Upwork button on the first screen at 375 by 553 pixels.

### Key Entities

- **Case study**: title, page address, client name, name approval, client type, role, timeline, stack tags, related services, problem, what was built, diagram and its text description, results, optional video, optional quote with approval, optional Ango Digital Tech tag, listed or unlisted, display order, card image, one-line result.
- **Result**: what was measured, before value, after value.
- **Service**: defined in feature 002. Used for matching and filtering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A search of the built site finds no unapproved client name.
- **SC-002**: Unlisted case studies appear in 0 site listings, and 100% of them open by direct link.
- **SC-003**: Each service filter shows exactly the listed case studies related to that service.
- **SC-004**: A new case study can be added with one content file and no code changes.
- **SC-005**: In a test with five non-technical people, at least four can state a case study's main result within 30 seconds.
- **SC-006**: 100% of Hire me on Upwork buttons on these pages open the configured Upwork URL in a new tab.
- **SC-007**: Every page scores 95 or higher in every category of a standard automated web quality audit, and an accessibility review finds no WCAG 2.2 AA failures.
- **SC-008**: A scan of the published pages, including unlisted ones, finds no email addresses, phone numbers or banned domains.

## Assumptions

- **Addresses**: the Work index is at /work and case studies are at /work/ followed by a short name. That short name MUST NOT contain an unapproved client name.
- **Order**: display order is set in content, and the homepage uses the first three listed case studies.
- **AikaIQ**: it is Ravi's own product, so its client type says so, and it has no client approval to record.
- **Video**: videos are either hosted with the site or loaded only after the visitor starts them, so nothing sets a cookie on page load. A standard video embed may not meet this. Walkthrough videos are kept under two minutes.
- **Approval**: Ravi marks a client name or quote approved only after that client agrees in writing. This repo is public, so an unapproved client name is left out of the content file entirely, not just hidden.
- **Confidentiality**: following the portfolio plan, no client code, data or internal dashboards are shown. Ravi checks this before publishing, because no scan can.
- **Third case study**: if no healthcare client work can be shown, Ravi can use a backend project or a small public demo, as the portfolio plan suggests.
- **Not ready yet**: a case study that isn't ready simply isn't added to content. There is no separate draft state.
- **Images**: covers and architecture diagrams are generated from content at build time, as in feature 001. They're illustrations and diagrams, never fake screenshots.
- **Not-found page**: feature 001 builds it. This feature adds the route to the Work index (FR-016).
- **Dependencies**: this feature uses the top bar, footer and Hire button from feature 001. Features 001 and 002 read its content. When it ships, the Work link and case study cards switch from homepage sections to these pages.
- **Content Ravi must supply**: the three case studies, with real before and after numbers, diagrams, and written client approvals.
