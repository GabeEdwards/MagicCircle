# Feature Specification: Dark Theme and Team Shading

**Feature Branch**: `003-dark-team-theme`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "give the overall app a dark theme. Make the Team displays shaded to match the team color."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use the App in a Dark Theme (Priority: P1)

As a player using the shared tablet during a game, I want the entire app to use a dark visual theme so that the interface is comfortable and cohesive during play.

**Why this priority**: The theme affects every view and is the primary requested change.

**Independent Test**: Open the between-games, setup, active-game, and end-game views and verify that each uses the dark theme without exposing bright light-theme surfaces or reducing readability.

**Acceptance Scenarios**:

1. **Given** any app view, **When** the view is displayed, **Then** the page background, panels, text, controls, tables, dialogs, and status messages use the dark theme palette.
2. **Given** the dark theme, **When** the user reads headings, body text, life totals, labels, and control text, **Then** all required content remains legible against its background.
3. **Given** the dark theme, **When** the user focuses, hovers, disables, or selects a control, **Then** the state remains visually distinguishable without reverting to a light-theme surface.
4. **Given** the app in portrait or landscape tablet orientation, **When** the user changes views, **Then** the dark theme remains consistent without layout shifts or hidden controls.

---

### User Story 2 - Distinguish Team Displays by Shading (Priority: P1)

As a player or spectator, I want each team display to be shaded using its team color so that Team Blue and Team Green remain easy to distinguish in the dark interface.

**Why this priority**: Team identity is central to setup, life tracking, active-turn recognition, and result review.

**Independent Test**: Start a game and verify Team Blue and Team Green panels have distinct dark shades derived from their canonical colors, while both remain readable and the active-team highlight remains visible.

**Acceptance Scenarios**:

1. **Given** an active game, **When** Team Blue and Team Green are displayed, **Then** each panel uses a distinct dark shade matching its canonical team color.
2. **Given** team displays with shaded backgrounds, **When** the active team changes, **Then** the active highlight remains visible over the team shade and does not make the inactive team appear active.
3. **Given** setup and completed-game history, **When** team panels or result rows are displayed, **Then** the Blue and Green shading remains consistent with the active-game displays.
4. **Given** a user who does not distinguish colors reliably, **When** team displays are viewed, **Then** team names and non-color identity cues still distinguish the teams.

---

### Edge Cases

- No view may retain a bright light-theme panel, table, modal, input, or button background that conflicts with the dark theme.
- Team shading must remain distinguishable when life totals are negative or above 40.
- Disabled and focused controls must remain visibly identifiable on dark team shades.
- Active-team emphasis must remain distinguishable from both team shading and the page background.
- Team Blue and Team Green must retain their existing names and canonical color identities.
- Dark-theme styling must not change game state, persisted history, turn behavior, life adjustment amounts, or player statistics.
- If the device has a forced contrast or accessibility mode, required text and controls must remain usable even if decorative shading is reduced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST apply a dark visual theme to every user-facing view and state, including between-games, setup, active-game, end-game, empty, error, disabled, focused, and selected states.
- **FR-002**: The app MUST use dark background and surface colors with readable foreground text for headings, labels, values, tables, controls, and messages.
- **FR-003**: The app MUST render Team Blue displays with a dark blue shade derived from the canonical Team Blue color.
- **FR-004**: The app MUST render Team Green displays with a dark green shade derived from the canonical Team Green color.
- **FR-005**: Team Blue and Team Green shading MUST remain visually distinct from each other and from the overall dark page background.
- **FR-006**: The app MUST preserve visible active-team highlighting on top of the applicable team shade.
- **FR-007**: The app MUST preserve non-color team identity cues, including the exact Team Blue and Team Green labels, wherever team shading is shown.
- **FR-008**: The app MUST keep primary touch controls, life totals, team member lists, history, and player statistics readable and usable on the dark theme in portrait and landscape tablet orientations.
- **FR-009**: The app MUST preserve existing game behavior and data, including team selection, alphabetical rosters, random first-player selection, round-based turns, unbounded life totals, life adjustment controls, completed-game history, and player statistics.
- **FR-010**: The app MUST NOT require server-side execution, new stored data, authentication, or network access for the dark theme or team shading.

### Key Entities

- **Theme Surface**: A dark background or panel surface used by an app view or control state.
- **Team Shade**: The dark blue or dark green surface treatment associated with a fixed team identity.
- **Active Highlight**: The non-color visual treatment indicating the currently active team above its team shade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a review of every user-facing view and state, 100% use the dark theme with no conflicting bright light-theme surfaces.
- **SC-002**: In both portrait and landscape tablet checks, at least 95% of participants can read team names, life totals, member lists, and primary controls without assistance.
- **SC-003**: In a visual review, Team Blue and Team Green remain distinguishable in 100% of setup, active-game, history, and end-game checks, including when the active highlight is applied.
- **SC-004**: In accessibility checks, all required text and primary controls meet the project-selected readable contrast target against their dark surfaces.
- **SC-005**: Existing baseline behavior checks produce the same game state, history fields, turn sequence, life values, and player statistics before and after the theme change.
- **SC-006**: The theme and shading update completes on the client with no additional network request or server dependency.

## Assumptions

- The dark theme is the default and only required theme; a light-theme toggle is out of scope.
- Exact dark surface colors and contrast-safe shades may be selected during planning, provided they preserve canonical blue/green identity and readability.
- Team shading applies to team panels, team setup surfaces, and team-associated history/result surfaces where those surfaces exist.
- The existing Team Blue and Team Green names, active highlight, life controls, player statistics, persistence, and GitHub Pages deployment remain unchanged.
- The feature changes presentation only; no new theme preference is persisted.
