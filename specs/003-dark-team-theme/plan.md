# Implementation Plan: Dark Theme and Team Shading

**Branch**: `003-dark-team-theme` | **Date**: 2026-08-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-dark-team-theme/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Apply a default dark palette to the existing static tracker and replace neutral team
surfaces with accessible dark blue and dark green shades. Preserve markup semantics,
state transitions, persisted data, and interaction behavior without adding dependencies
or stored theme preferences.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Existing HTML5, CSS, and modern browser JavaScript (ES2022+)

**Primary Dependencies**: None; existing browser platform APIs only

**Storage**: None added; existing local storage remains unchanged

**Testing**: Browser visual/interaction acceptance checks and existing focused state tests

**Target Platform**: Current iPad Safari and desktop browsers; GitHub Pages static hosting

**Project Type**: Presentation-only enhancement to a static single-page web application

**Performance Goals**: Theme changes render with the existing page update; no additional network request or measurable interaction delay

**Constraints**: Dark default only; no theme preference storage, server, dependency, image, or network change; preserve touch sizing, tablet orientations, team names, and state behavior

**Scale/Scope**: Existing two-team tracker, four view modes, fixed Team Blue/Team Green surfaces, and all existing control states

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. The plan directly covers the requested dark theme and team shading with readable, testable outcomes.
* **Simplicity and Local Consistency**: PASS. The change reuses existing markup and CSS variables without adding runtime architecture.
* **Verification Is Mandatory**: PASS. Visual and regression checks cover all view states, orientations, contrast, and unchanged game behavior.
* **Explicit Contracts**: PASS. Theme surfaces, team shades, and active highlight are defined as presentation contracts.
* **Secure and Observable Operation**: PASS. No data, authentication, or external input is added; accessibility and forced-contrast behavior are explicitly considered.
* **App Target**: PASS. The result remains simple, client-only, low-cost, touch-compatible, and free of third-party visual assets.

## Project Structure

### Documentation (this feature)

```text
specs/003-dark-team-theme/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
index.html       # Existing semantic view structure
styles.css       # Dark palette, team shades, focus, disabled, and active states
app.js           # Existing state/rendering behavior; no persistence changes
tests/
├── game-state.test.js
├── persistence.test.js
└── acceptance.md
```

**Structure Decision**: Keep the enhancement in the existing root static files. Prefer
CSS-only changes; add markup hooks only where current team surfaces cannot receive
consistent shading or state styling. Do not alter persisted data.

## Post-Design Constitution Check

* **User Value First**: PASS. Every design decision supports dark readability or team recognition.
* **Simplicity and Local Consistency**: PASS. No new project, dependency, persistence field, or runtime service is introduced.
* **Verification Is Mandatory**: PASS. Quickstart validates all views, state styling, orientations, contrast, and baseline behavior.
* **Explicit Contracts**: PASS. Theme Surface, Team Shade, and Active Highlight are defined without changing game data contracts.
* **Secure and Observable Operation**: PASS. No sensitive data is introduced; forced-contrast and disabled/focused states remain explicit.
* **App Target**: PASS. The design remains client-only, simple, touch-compatible, and static.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | The enhancement is presentation-only and reuses the existing static app. |
