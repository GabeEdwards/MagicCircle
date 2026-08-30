# Research: MTG Gameplay Enhancements

**Date**: 2026-08-30 | **Feature**: [spec.md](spec.md)

## Research Summary

No NEEDS CLARIFICATION markers required resolution. The specification contains sufficient detail for design and implementation. This document captures technology choices and design decisions for the nine enhancements.

---

## Feature 1: Fair Team-Size Based First-Player Selection

### Decision
Modify `chooseFirstTeam()` in app.js to compare team member counts before random selection.

**Logic**:
- If Team A members < Team B members → select Team A
- If Team B members < Team A members → select Team B
- If equal → use existing random selection (FR-002 backward compatibility)

**Rationale**: Team size is a known quantity at game start (captured when teams are confirmed). No runtime complexity added; comparison is a single O(1) operation on known arrays.

**Alternatives considered**:
- User-selectable fairness modes: Added complexity; auto-selection keeps game setup simple.
- Weighted random selection: Over-engineered for casual use case; simpler deterministic rule preferred.

**Status**: Ready for implementation. No external research required.

---

## Feature 2: First-Player Team Left-Side Layout

### Decision
Modify index.html template and styles.css to position the first-player team on the left side of the game display.

**Logic**:
- Render team UI in order: `[firstPlayerTeam, otherTeam]` regardless of turn state
- Use CSS grid or flexbox layout that respects this order
- Ensure layout works in both portrait (narrow/tall) and landscape (wide/short) orientations on iPad

**Rationale**: First-player team identity is stable throughout the game and known at game start. Left-right positioning is a pure presentation concern; no state changes required.

**Alternatives considered**:
- Dynamic repositioning based on active team: Adds visual confusion; fixed layout is clearer.
- Center-focused design with team indicators: Requires more screen space; left/right split is more intuitive.

**Status**: Ready for implementation. No external research required.

---

## Feature 3: Turn Undo Capability

### Decision
Add undo history tracking to the Active Game state. Each turn advance (and its related state) is recorded. Undo reverts one step back; redo history is discarded on new turn advance.

**State structure**:
```javascript
activeGame.undoHistory = [
  // Each entry captures game state at a point in time
  { turnNumber, activeTeamId, lifeTotals, timerStates }
  // ... previous states
]
```

**Logic**:
- On game start or after win: `undoHistory = []`
- On turn advance: Push current state (before advancing) to undoHistory, then advance
- On undo (FR-004): Pop most recent entry, restore all fields
- If undoHistory is empty: Disable undo button or show message (FR-005)

**Rationale**: Undo is fundamentally a stack-based operation; storing complete snapshots enables recovery of all game state (including future timer reversion). Snapshots are small (6 integers + 2 references) so memory impact is negligible for typical game lengths (50–100 turns).

**Alternatives considered**:
- Operation log (recording deltas only): Requires inverse operation for each state change; snapshot approach is simpler.
- Redo support: Spec does not require redo; discarding redo history on new turn avoids UI complexity.

**Status**: Ready for implementation. No external research required.

---

## Feature 4: Auditory Feedback for Turn Advancement

### Decision
Use Web Audio API or HTML5 `<audio>` element to play a brief sound on turn advance.

**Sound generation options**:
- Pre-generate a simple beep/tone and embed as base64 data URI in app.js
- Use Web Audio API's OscillatorNode to synthesize a tone at runtime

**Device mute handling**:
- Attempt to detect device mute state via Permissions API (iOS 14.5+) or volume event
- On fallback (API unavailable): Proceed with playback; user can manually mute device if desired
- Always respect user's local sound setting (FR-009)

**User preference persistence**:
- Store `soundEnabled` boolean in localStorage
- Provide UI toggle in settings/control panel

**Rationale**: Web Audio API is universally supported in modern browsers and requires no external dependencies. Embedded sound avoids network request. Device mute-state detection is optional because not all browsers/devices expose this reliably; fallback behavior is acceptable per assumptions.

**Alternatives considered**:
- External sound file (MP3, WAV): Adds network request and dependencies; embedded approach is simpler.
- Vibration feedback (Vibration API): Complements audio but requires separate implementation; audio alone satisfies the spec.

**Status**: Ready for implementation. Simple beep tone recommended (e.g., 440 Hz for 100 ms).

---

## Feature 5: Sortable Player Statistics

### Decision
Implement in-memory sorting of completed game results based on user-selected criteria.

**Sort dimensions**:
- By player name (A–Z, Z–A)
- By team name (A–Z, Z–A)
- By win count (ascending/descending)
- By games played (ascending/descending)
- By win percentage (ascending/descending)

**Sort state persistence**:
- Store selected sort criterion in localStorage under key `sortPreference`
- On page load, apply stored preference (or default to most recent games if not set)

**Logic**:
- Compute `playerResults()` aggregates from completed games (existing function)
- Apply sort function based on selected criterion
- Re-render results view

**Rationale**: Sorting is a presentation concern; no data model changes needed. User preference persistence avoids repeated manual selection.

**Alternatives considered**:
- Server-side sorting: Out of scope (client-only app).
- Multiple simultaneous sort keys: Overcomplicates UI; single-criterion sort sufficient.

**Status**: Ready for implementation. No external research required.

---

## Feature 6: Refined Button Feedback (No Persistent Highlight)

### Decision
Use CSS keyframe animation to fade out button highlight after press. Eliminate `:active` pseudo-class persistence on touch devices.

**Implementation**:
```css
@keyframes button-press-feedback {
  0% {
    background-color: var(--button-active-color);
    transform: scale(0.98);
  }
  100% {
    background-color: var(--button-default-color);
    transform: scale(1);
  }
}

.life-button {
  animation: button-press-feedback 300ms ease-out;
}
```

**Logic**:
- Trigger animation on mousedown/touchstart
- Complete within 300 ms (FR-006)
- Do not leave any highlighted state after animation completes

**Rationale**: CSS animations are lightweight and avoid JavaScript timer overhead. 300 ms is a sweet spot: fast enough to feel responsive, slow enough for visual clarity.

**Alternatives considered**:
- JavaScript timers: More complex; CSS animations are native browser optimization.
- Longer animation (500+ ms): Slows down gameplay feedback loop.

**Status**: Ready for implementation. No external research required.

---

## Feature 7: Chess-Clock Style Team Timers

### Decision
Implement separate timer objects for each team using `performance.now()` for precision.

**State structure**:
```javascript
activeGame.timers = {
  a: { elapsedMs: 0, lastStartTime: null },  // milliseconds, null if paused
  b: { elapsedMs: 0, lastStartTime: null }
}
```

**Logic**:
- On game start: Initialize both timers with `elapsedMs = 0, lastStartTime = null`
- On turn advance:
  - Pause active team's timer: `elapsedMs += now() - lastStartTime; lastStartTime = null`
  - Resume other team's timer: `lastStartTime = now()`
- On undo: Restore both timer objects from undo history
- On game end: Capture final timer states in completed game record
- Display format: `MM:SS` or `H:MM:SS` depending on elapsed time

**Accuracy**:
- Use `performance.now()` for high-resolution millisecond precision
- Accept ±1 second variance acceptable per assumptions (casual game, not tournament-grade timing)
- Update UI display on requestAnimationFrame (60 Hz) for smooth ticking

**Rationale**: `performance.now()` is precise and consistent across browsers. Storing both elapsed time and last-start-time enables accurate resumption after pause or undo. No external timer library required.

**Alternatives considered**:
- setInterval for timer updates: Lower precision; performance.now() approach is more reliable.
- Send to server for precise NTP sync: Out of scope (client-only); local precision sufficient.

**Status**: Ready for implementation. No external research required.

---

## Feature 8: CSV Export of Game Results

### Decision
Generate CSV file in-memory using JavaScript and trigger browser download via Blob + URL.

**CSV structure**:
```
Date,Team A,Team B,Winner,Final Turn,Team A Life,Team B Life,Team A Time,Team B Time
2026-08-30T15:23:45Z,"Gabe, Phil","Tung, Siu","Team A",5,42,18,3:45,2:30
```

**Logic**:
- Iterate over `completedGames` array
- Format each game as CSV row with columns: timestamp, team names (comma-separated members), winner, turn number, final life totals, elapsed times
- Aggregate into single string with newlines
- Create Blob and trigger download via temporary anchor element

**Encoding**:
- Use UTF-8 encoding (Blob with type `text/csv;charset=utf-8`)
- Properly escape commas and quotes in team member names

**Rationale**: No server required. Browser download mechanism is built-in and familiar to users. CSV format is universally readable in spreadsheet applications.

**Alternatives considered**:
- JSON export: Less universally understood; CSV is the request.
- Direct email/cloud upload: Out of scope; local download is simpler.

**Status**: Ready for implementation. No external research required.

---

## Feature 9: Audit Log of Gameplay Events

### Decision
Implement an in-memory audit log that records all significant gameplay events with timestamps.

**Event types**:
- `GameStarted`: Timestamp, team compositions, first player
- `LifeAdjusted`: Timestamp, team, amount, new total
- `TurnAdvanced`: Timestamp, old active team, new active team, new turn number
- `UndoTurn`: Timestamp, reverted turn number
- `GameEnded`: Timestamp, winning team, final turn number

**State structure**:
```javascript
activeGame.auditLog = [
  { eventType, timestamp: Date.now(), details: {...} }
  // ... chronological entries
]
```

**Storage and persistence**:
- Audit log lives in memory during active game
- On game completion, audit log is included in completed game record (optional; can be stored separately)
- On page reload, audit log is recovered with active game from localStorage

**Data safety**:
- Do not log sensitive data (device identifiers, IP addresses, user location)
- Log only game-related events and player actions
- No credentials or authentication tokens in log

**Viewer UI**:
- Modal or sidebar accessible during gameplay
- Display events in chronological order with timestamps
- Show event type and relevant details (e.g., "Gabe's Team: Life +5 → 45")
- Remain non-interrupting (player can dismiss and return to game immediately)

**Rationale**: Audit log is a simple append-only data structure. Event recording is a single push per action; memory usage is O(turns + life adjustments). Included in completed game enables post-game review and dispute resolution.

**Alternatives considered**:
- Server-side audit log: Out of scope (client-only).
- Conditional event recording (on/off toggle): Spec requires full recording; always-on is simpler.

**Status**: Ready for implementation. No external research required.

---

## Technology Decisions Summary

| Technology | Decision | Rationale |
|-----------|----------|-----------|
| Undo History | In-memory snapshots | Simple, reliable, no external library |
| Audio Feedback | Web Audio API + base64 beep | No network requests, no dependencies |
| Sorting | In-memory JavaScript sort | Fast for typical history size, no server needed |
| Button Animation | CSS keyframes | Lightweight, GPU-accelerated, native browser optimization |
| Timers | performance.now() + requestAnimationFrame | High precision, no external library, smooth UI updates |
| CSV Export | Blob + download link | Built-in browser mechanism, universally readable format |
| Audit Log | In-memory array + localStorage | Simple append-only structure, recovered on reload |

---

## Design Decisions Summary

All nine features maintain existing architecture and add no new external dependencies. Enhancements are integrated into app.js state management and rendered via index.html/styles.css. Constitution principles are fully satisfied: no complexity introduced without user value, all logic is testable, and no sensitive data is exposed.

