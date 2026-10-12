# Implementation Plan: First Playing Team Display

**Branch**: `006-first-playing-team-display` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-first-playing-team-display/spec.md`

## Summary

Update the application's pre-game confirmation stage and in-game indicators to identify only the starting team by team name (e.g. `Team Blue` or `Team Green`), rather than specifying individual players. All teammates act simultaneously on their team's turn.

## Technical Context

**Language/Version**: HTML5, CSS3, modern JavaScript (ES2022+)

**Primary Dependencies**: None; browser-native APIs only

**Storage**: Local storage (`localStorage`), unchanged envelope schema

**Testing**: Node test runner (`node --test tests/*.test.js`) and browser verification

**Target Platform**: Current iPad Safari and desktop browsers; GitHub Pages static hosting

**Project Type**: Single-page web application

**Performance Goals**: Instant view update (<50ms)

**Constraints**: Pure client-side execution; no external dependencies; preserve simultaneous team gameplay semantics

**Scale/Scope**: 2 teams, 2-4 members per team

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. Eliminates user confusion by accurately reflecting game rules (simultaneous team turns).
* **Simplicity and Local Consistency**: PASS. Directly simplifies `app.js` and `index.html` by removing unnecessary player-level starter data.
* **Verification Is Mandatory**: PASS. Verified via unit tests and quickstart validation guide.
* **Explicit Contracts**: PASS. Explicit contracts documented in `contracts/ui-contract.md` and `data-model.md`.
* **Secure and Observable Operation**: PASS. Client-only execution, zero external data leaks.

**Potential Violations**: None.

## Project Structure

### Documentation (this feature)

```text
specs/006-first-playing-team-display/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Quality checklist
└── contracts/
    └── ui-contract.md   # UI interaction contract
```

### Source Code (repository root)

```text
app.js                  # - Refactor selectFirstTeam() to eliminate firstPlayerName
                        # - Update renderFirstPlayerStage() to announce TEAM_NAMES[teamId]
                        # - Update in-game labels from "First player" to "First team"

index.html              # - Update #first-player-heading text to "Starting team picked"

tests/game-state.test.js# - Update test assertions for selectFirstTeam
```

**Structure Decision**: Minimal targeted updates to existing files.

## Complexity Tracking

No violations of the project constitution were identified.


**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
