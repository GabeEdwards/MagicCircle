# Implementation Plan: Session Reset and Winner Default

**Branch**: `004-session-reset-winner-default` | **Date**: 2026-08-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-session-reset-winner-default/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Add a confirmed destructive New session action that resets the existing local state envelope,
and default winner selection to the higher numeric life total when opening the end-game view.
Keep reset and selection logic client-only, preserve the existing storage key and game record
shape, and require an explicit choice when life totals are tied.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Existing HTML5, CSS, and modern browser JavaScript (ES2022+)

**Primary Dependencies**: None; existing browser platform APIs only

**Storage**: Existing local-storage state envelope; reset writes the existing empty state

**Testing**: Browser acceptance checks and focused state/persistence tests

**Target Platform**: Current iPad Safari and desktop browsers; GitHub Pages static hosting

**Project Type**: Enhancement to a static single-page web application

**Performance Goals**: Reset and winner-default interactions respond within 100 ms after user action

**Constraints**: No server, new dependency, unrelated browser-data deletion, or network requirement; preserve dark theme, team identity, game behavior, and storage format outside confirmed reset

**Scale/Scope**: One shared tablet session, existing two-team state, local history, and derived player results

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. Both workflows have explicit user stories and acceptance scenarios.
* **Simplicity and Local Consistency**: PASS. Reset reuses the existing empty state and winner default is a pure comparison.
* **Verification Is Mandatory**: PASS. Tests cover cancel/confirm reset, all life comparisons, override behavior, and recovery.
* **Explicit Contracts**: PASS. Reset scope, confirmation semantics, and final winner selection are documented.
* **Secure and Observable Operation**: PASS. The destructive action is explicit and limited to this app's storage key.
* **App Target**: PASS. The feature remains client-only, touch-compatible, low-cost, and static-hosted.

## Project Structure

### Documentation (this feature)

```text
specs/004-session-reset-winner-default/
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
index.html       # Session action and winner-selection UI
styles.css       # Destructive confirmation and selected-winner presentation
app.js           # Reset state transition and higher-life default logic
tests/
├── game-state.test.js
├── persistence.test.js
└── acceptance.md
```

**Structure Decision**: Extend the existing root static app. Keep reset as an explicit
state transition that writes `emptyState()` to the existing storage key, and derive the
winner default when the end-game view opens without changing the completed-game schema.

## Post-Design Constitution Check

* **User Value First**: PASS. Reset safety and quicker winner confirmation map directly to
  the two feature stories.
* **Simplicity and Local Consistency**: PASS. The design uses the existing storage envelope,
  confirmation flow, and winner radio controls.
* **Verification Is Mandatory**: PASS. Quickstart covers cancel/confirm reset, all life
  comparisons, override behavior, and fresh-session recovery.
* **Explicit Contracts**: PASS. Reset scope, confirmation wording, tie handling, and final
  winner selection are explicit.
* **Secure and Observable Operation**: PASS. Reset is limited to the app storage key and
  requires an explicit confirmation before destructive persistence.
* **App Target**: PASS. The feature remains client-only, touch-compatible, dark-themed,
  and static-hosted.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | The enhancement reuses the existing state envelope and static UI. |
