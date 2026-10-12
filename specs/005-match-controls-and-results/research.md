# Research: Match Controls and Game Results Editing

**Feature Branch**: `005-match-controls-and-results`

## Decisions and Findings

### 1. Maximize Screen View (Fullscreen API)

- **Decision**: Use the standard browser Fullscreen API (`document.documentElement.requestFullscreen()` and `document.exitFullscreen()`), synchronized with the `fullscreenchange` event.
- **Rationale**: 
  - Standard, native browser capability available in modern desktop and mobile/tablet browsers.
  - No external libraries required, directly supporting the project's zero-dependency, client-only constitution.
  - Listening to the `fullscreenchange` event ensures the UI (button text/icon and accessibility attributes like `aria-pressed`) automatically updates even if the user exits fullscreen via system gestures (swipe) or physical/keyboard keys (Escape).
  - Graceful fallback: If `document.fullscreenEnabled` is false or the methods are not available (e.g. certain constrained iframe contexts or iOS Safari which only supports fullscreen on video elements or standalone PWA mode), hide or disable the button cleanly without errors.
- **Alternatives considered**:
  - CSS-only viewport expansion: Doesn't hide browser chrome/navigation bars, which is the user's intent when asking to "maximize".
  - External fullscreen polyfill libraries: Rejected because the project constitution forbids unnecessary dependencies; native checks (`document.fullscreenElement`) are concise and standard.

### 2. First-Player Stage & Workflow State

- **Decision**: Introduce a dedicated view stage (`#first-player-view`, mode `'first-player'`) between team setup and active gameplay.
- **Rationale**:
  - In `app.js`, modes currently include `'between'`, `'setup'`, `'game'`, and `'end'`.
  - Adding `'first-player'` cleanly integrates into existing view-switching logic (`render()`) where only the active view is unhidden.
  - When the user confirms team selection on the setup screen:
    1. Teams and first player are evaluated/initialized (using existing `chooseFirstTeam(teams)` logic supporting team-size fairness or random fallback).
    2. Instead of directly persisting an active game and jumping into `'game'`, the app transitions to `'first-player'`.
    3. The first-player view displays:
       - The picked first player's name and their team (Team Blue or Team Green).
       - An explanatory tag/text indicating whether selection was based on team size fairness (smaller team) or random choice.
       - A "Go back" button that returns to `'setup'` with the selected team members preserved.
       - A "Start game" / "Continue" button that calls `createActiveGame(setupTeams, firstPlayer)` (or initializes active game with the preselected first player), persists state, and transitions to `'game'`.
- **Alternatives considered**:
  - Modal overlay on setup screen: Less clear on mobile/touch interfaces; a full screen stage keeps cognitive focus clear and matches existing view architecture.
  - Auto-timer countdown to start: Rejected; explicit buttons ("Go back" and "Continue") provide intentional control without rushing users.

### 3. Between-Games Editing of Completed Game Results

- **Decision**: Add an "Edit" action to completed game cards in the between-games history view that opens an edit modal or inline form to modify:
  - Winning team (`winnerTeamId`: `'a'` or `'b'`)
  - Team final life totals (`finalLifeTotals.a`, `finalLifeTotals.b` as integers)
  - Team elapsed times (`teamTimers.a`, `teamTimers.b` formatted as `M:SS` or `H:MM:SS` and converted to milliseconds)
- **Rationale**:
  - Keeps the edit interface close to the context of the game being reviewed.
  - When saved, the modified game record in `state.completedGames[index]` is updated in place.
  - `playerResults(state.completedGames)` already dynamically recomputes aggregated player stats (wins, losses, win percentage) directly from `state.completedGames`. Updating the game and re-rendering automatically updates the player stats table and CSV export without duplicating aggregation logic.
  - Validation:
    - Winner must be one of the game's teams.
    - Life totals must parse to valid integers (allowing negative, zero, positive).
    - Time inputs can be edited either via standard time strings (`mm:ss` / `hh:mm:ss`) or minute/second fields, parsed back into non-negative milliseconds.
  - Audit log preservation: The game's historical `auditLog` remains an immutable record of live game actions, but the completed game's top-level summary fields (`winnerTeamId`, `finalLifeTotals`, `teamTimers`) reflect the corrected official result.
- **Alternatives considered**:
  - Replaying entire game turns from scratch: Too cumbersome for users who simply want to correct an incorrect end-game winner declaration or a missed 3-life trigger.
  - Adding a separate admin screen: Unnecessary complexity; adding an "Edit" button to each game card in recent history is intuitive and consistent with existing UI patterns.

### 4. Rapid ±3 Point Life Adjustment Buttons

- **Decision**: Expand the life controls from `[-5, -1, 1, 5]` to `[-5, -3, -1, 1, 3, 5]`.
- **Rationale**:
  - Existing logic in `app.js` renders life buttons dynamically from an array of deltas and handles clicks uniformly:
    ```javascript
    [-5, -3, -1, 1, 3, 5].forEach(delta => ...)
    ```
  - The click handler already delegates to `adjustLife(state.activeGame, teamId, delta)`, which automatically logs `AUDIT_EVENTS.LIFE_ADJUSTED` with the delta, old value, and new value.
  - The transient button feedback CSS (`.life-button.feedback`) already exists and will apply to the new buttons seamlessly.
  - Touch targets: Adjust grid styling in `styles.css` so that 6 buttons per team fit comfortably on both phone/tablet viewports in portrait and landscape without cramped tap targets.
- **Alternatives considered**:
  - Dropdown selector for custom numbers: Slows down gameplay during rapid turn cycles.
  - Replacing ±5 with ±3: Users still regularly need ±5 for MTG increments (e.g. 5 damage chunks). Keeping both provides maximum utility.
