# Implementation Plan: MTG Gameplay Enhancements

**Branch**: `004-gameplay-enhancements` | **Date**: 2026-08-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-gameplay-enhancements/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Enhance the MTG Game Tracker with nine gameplay improvements: fair team-size-based first-player selection, consistent left-side layout for the first-player team, turn undo capability, audio feedback on turn advance, sortable game statistics, refined button feedback without persistent highlighting, chess-clock style team timers, CSV export of game results, and comprehensive event audit logging. All enhancements maintain the existing single-page architecture, use browser-native APIs, store data locally, and require no new external dependencies.

## Technical Context

**Language/Version**: HTML5, CSS, and modern browser JavaScript (ES2022+)

**Primary Dependencies**: None; browser platform APIs only (Web Audio API, Permissions API for mute state detection)

**Storage**: Browser local storage for active-game recovery, completed-game history, audit logs, and user preferences (sound enable/disable, sort preference)

**Testing**: Browser acceptance checks documented in quickstart.md, with focused logic tests for game state transitions, timer accuracy, undo/redo history, and audit event recording during implementation

**Target Platform**: Current iPad Safari and current desktop browsers; GitHub Pages static hosting

**Project Type**: Static single-page web application with interactive gameplay and analytics features

**Performance Goals**: Primary controls update visibly within 100 ms on a supported iPad; timer tick-rate maintains sub-second accuracy; turn-advance sound plays within 50 ms of button press; initial page load remains suitable for a small static application

**Constraints**: No server-side execution, account system, remote database, or required network access after load; touch-first controls; portrait and landscape support; no third-party images or runtime dependencies; all life values remain numeric without caps; audit log does not expose sensitive device data

**Scale/Scope**: One shared iPad per play group; two teams; 2-4 members per team from seven fixed players; recent local history with CSV export capability; two user-facing modes (in-game with audit log viewer, between-games with statistics and export); team timers track elapsed seconds with display format M:SS or HH:MM:SS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. Each enhancement maps to a user story with acceptance criteria and measurable success outcomes in the feature specification.
* **Simplicity and Local Consistency**: PASS. All enhancements reuse existing patterns (state management via centralized objects, local storage, browser APIs). No new external dependencies or architectural boundaries introduced; timer logic extends existing turn-tracking; audit log uses existing event model.
* **Verification Is Mandatory**: PASS. Each feature includes focused test scenarios (turn undo verification, timer accuracy within ±1 second, audit log event recording completeness, CSV export data integrity). Narrowest relevant validation is timer logic (unit testable) and UI feedback (integration testable).
* **Explicit Contracts**: PASS. Data-model extensions document new fields in Active Game (for undo history, timers, audit log) and Completed Game (for team times). CSV export column structure is defined in the export requirement. Audit log event schema is specified.
* **Secure and Observable Operation**: PASS. Audit log excludes device identifiers and network information per FR-028. Timer data does not expose sensitive information. CSV export contains only game data. Sound feedback respects device mute state without attempting privileged access.

**Potential Violations**: None identified.

## Project Structure

### Documentation (this feature)

```text
specs/004-gameplay-enhancements/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (decisions on audio implementation, timer precision, audit log storage)
├── data-model.md        # Phase 1 output (extensions to Active Game, Completed Game, and new Audit Log entity)
├── quickstart.md        # Phase 1 output (validation scenarios for each feature component)
├── contracts/
│   ├── game-state-contract.md       # Game state schema including undo history, timers, audit log
│   ├── audit-log-contract.md        # Event schema, event types, and data requirements
│   ├── csv-export-contract.md       # Column structure, data format, and export flow
│   └── timer-contract.md            # Timer state, accuracy requirements, and display format
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app.js                  # Main game logic and state management
                        # - Update chooseFirstTeam() to support team-size comparison (FR-001, FR-002)
                        # - Add undo history and redo tracking to Active Game state (FR-004–006)
                        # - Add team timer objects and management functions (FR-013–019)
                        # - Add audit log array and event recording functions (FR-023–028)
                        # - Add CSV export function using Blob and download link (FR-020–022)
                        # - Add sort preference persistence to local storage

index.html              # DOM structure and event binding
                        # - Add undo button (initially disabled)
                        # - Add audit log viewer modal/sidebar (non-interrupting)
                        # - Add sort dropdown in between-games view
                        # - Add export button in between-games view
                        # - Update team display to respect first-player left-side positioning (FR-003)
                        # - Update life point buttons for fade-out animation (FR-010–012)
                        # - Add team timer display elements (HH:MM:SS or M:SS format)

styles.css              # Presentation and animations
                        # - Add fade-out animation for button feedback (completes within 300ms, FR-010–012)
                        # - Add audit log viewer layout (modal or sidebar, accessible during gameplay)
                        # - Add sort control styling
                        # - Add export button styling
                        # - Ensure left-side first-player team layout in both portrait and landscape

tests/                  # Optional unit and acceptance tests
├── game-state.test.js  # Existing tests (likely covers game creation, life adjustment, turn advance)
├── persistence.test.js # Existing tests (likely covers local storage recovery)
├── undo-redo.test.js   # New: undo history, reverting turn counter and active team
├── timers.test.js      # New: timer start/pause/resume, accuracy, undo reversion
├── audit-log.test.js   # New: event recording, completeness, no sensitive data
└── csv-export.test.js  # New: export file generation, column structure, data integrity
```

**Structure Decision**: The implementation maintains the single-page architecture of Feature 001, with enhancements integrated into existing app.js state management and index.html/styles.css presentation. No new top-level modules or components are introduced; all logic follows existing patterns (pure functions for state transformation, localStorage for persistence, event-driven UI updates).

## Complexity Tracking

No violations of the project constitution were identified. The enhancements remain aligned with project principles: no external dependencies, client-side only, touch-first UI, and simplified architecture.
