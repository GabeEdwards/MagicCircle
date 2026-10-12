# Implementation Plan: Match Controls and Game Results Editing

**Branch**: `005-match-controls-and-results` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-match-controls-and-results/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Deliver four user-facing match controls and game-management improvements to Magic Circle:
1. A **Maximize** button in the header utilizing the native browser Fullscreen API with graceful fallback.
2. A **First-Player Stage** (`#first-player-view`) displayed after team selection, announcing the selected starter and rationale, with "Go back" and "Continue" actions.
3. Dedicated **-3 and +3** life adjustment buttons during active gameplay with transient animations and audit logging.
4. **Game Result Editing** between games to modify winner, life totals, and elapsed time totals for any completed game, dynamically refreshing the history card and player statistics.

All additions preserve client-only execution, local storage persistence, responsive mobile/tablet design, and zero external runtime dependencies.

## Technical Context

**Language/Version**: HTML5, CSS3, modern JavaScript (ES2022+)

**Primary Dependencies**: None; browser-native APIs only (Fullscreen API, LocalStorage, Web Audio API)

**Storage**: Browser `localStorage` for application state persistence (`magic_circle_state_v1`), including edited completed games and active game staging

**Testing**: Focused JavaScript unit tests for game manipulation functions (e.g. `adjustLife`, `editCompletedGame`, `playerResults`), plus manual browser validation per `quickstart.md`

**Target Platform**: Current iPad Safari and desktop modern browsers (Chrome, Edge, Firefox, Safari); GitHub Pages static hosting

**Project Type**: Single-page web application

**Performance Goals**: Instant UI responsiveness (<50ms for life point adjustments, fullscreen toggle, view transitions)

**Constraints**: Completely client-side; no server, no external CDNs or 3rd-party graphic assets; touch-friendly touch targets (min 44x44px for buttons)

**Scale/Scope**: Local session games, 2 teams (2-4 players each from 7 standard players), completed game history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. All four capabilities (Maximize, First-Player Stage, ±3 Life Controls, Edit Game Results) directly fulfill user-requested needs and have verifiable acceptance criteria.
* **Simplicity and Local Consistency**: PASS. Builds directly upon existing architecture in `app.js`, `index.html`, and `styles.css`. No external libraries or framework dependencies are introduced.
* **Verification Is Mandatory**: PASS. Quickstart validation scenarios and unit tests cover all modified state transformations and UI state transitions.
* **Explicit Contracts**: PASS. Contracts for UI, data structures, and state transitions are explicitly documented in `contracts/ui-contract.md` and `data-model.md`.
* **Secure and Observable Operation**: PASS. Local-only execution; Fullscreen API handles user permissions natively; audit log remains intact; no sensitive data collected or transmitted.

**Potential Violations**: None.

## Project Structure

### Documentation (this feature)

```text
specs/005-match-controls-and-results/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (research on Fullscreen API, view staging, edit workflows)
├── data-model.md        # Phase 1 output (schema definitions, state transitions, validation rules)
├── quickstart.md        # Phase 1 output (step-by-step user and tester validation guide)
├── checklists/
│   └── requirements.md  # Quality checklist from specification phase
└── contracts/
    └── ui-contract.md   # UI interaction and layout contract
```

### Source Code (repository root)

```text
app.js                  # Main game logic and UI controller
                        # - Add Fullscreen API toggle and state synchronization
                        # - Add first-player stage logic (mode 'first-player', staging state)
                        # - Expand life adjustment deltas to include -3 and +3
                        # - Add editCompletedGame() core function
                        # - Add renderFirstPlayerStage() and renderEditGameModal()
                        # - Bind event listeners for new buttons and form submissions

index.html              # DOM structure
                        # - Add #maximize-button to .site-header
                        # - Add #first-player-view section with back and continue controls
                        # - Add #edit-game-view modal section for editing completed game results

styles.css              # Layout and styling
                        # - Styles for #maximize-button in header
                        # - First-player stage card, announcement, and badge styling
                        # - Grid adjustment for 6 life buttons per team
                        # - Modal dialog styles for game editing view

tests/
├── game-state.test.js  # Add tests for ±3 life adjustment logic
└── edit-results.test.js# New unit tests for editing completed games and stat recalculation
```

**Structure Decision**: Preserves the single-page web app architecture, enhancing `app.js`, `index.html`, and `styles.css`, accompanied by targeted tests in `tests/`.

## Complexity Tracking

No violations of the project constitution were identified. The enhancements remain aligned with project principles: no external dependencies, client-side only, touch-first UI, and simplified architecture.

