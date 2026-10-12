# UI and Interaction Contracts: Match Controls and Game Results Editing

**Feature Branch**: `005-match-controls-and-results`

## 1. Maximize View Contract

### 1.1 Element Placement & Identification
- **Selector**: `#maximize-button`
- **Container**: Global `.site-header`
- **Initial State**:
  - Text/Label: `Maximize`
  - Attribute: `aria-pressed="false"`, `title="Maximize to full screen"`
- **Active State (Fullscreen active)**:
  - Text/Label: `Restore` (or `Exit Maximize`)
  - Attribute: `aria-pressed="true"`, `title="Restore window size"`

### 1.2 Interactions & Lifecycle
- When clicked in standard mode: invokes `document.documentElement.requestFullscreen()`.
- When clicked in maximized mode: invokes `document.exitFullscreen()`.
- When fullscreen changes via any mechanism (keyboard `Escape`, touch swipe, browser toolbar): `fullscreenchange` event updates `#maximize-button` label and `aria-pressed` state.
- Fallback: If `document.fullscreenEnabled` is false or unavailable, `#maximize-button` is hidden (`hidden = true`).

---

## 2. First-Player Stage Contract

### 2.1 View Structure
- **Container**: `<section id="first-player-view" class="view" aria-labelledby="first-player-heading" hidden>`
- **Heading**: `First Player Announced` (`#first-player-heading`)
- **Player & Team Display**:
  - Element `#first-player-announcement` containing the selected player's name and their team badge/name (e.g. `Alice (Team Blue)`).
- **Selection Rationale Badge**:
  - Element `#first-player-reason` describing why:
    - `"Fair start: smaller team plays first"` (if unequal team sizes)
    - `"Random selection: equal team sizes"` (if equal team sizes)
- **Controls**:
  - Back Button: `#back-to-setup-button` (`class="button button-quiet"`) labeled `Go back`
  - Continue Button: `#start-game-from-stage-button` (`class="button button-primary"`) labeled `Continue to game`

### 2.2 Navigation Contracts
- From `#setup-view`: Clicking `#confirm-setup-button` validates rosters. If valid, generates the first player selection and transitions mode to `'first-player'`.
- From `#first-player-view`:
  - Clicking `#back-to-setup-button` sets mode to `'setup'`. Checked player checkboxes remain preserved.
  - Clicking `#start-game-from-stage-button` instantiates `activeGame` using the staged setup teams and selected first player, saves to `localStorage`, and sets mode to `'game'`.

---

## 3. Game Results Editing Contract

### 3.1 History Card Action
- Each card in `#history-list` includes an edit button:
  - Element: `<button class="button button-quiet button-edit-game" data-action="edit-game" data-game-index="{index}">Edit result</button>`

### 3.2 Edit Modal / Interface Contract
- **Container**: `<section id="edit-game-view" class="view modal-view" aria-labelledby="edit-game-heading" hidden>`
- **Modal Fields**:
  - **Winner Selection**: Radio buttons (`name="edit-winner"`, values `'a'` and `'b'`) for Team Blue and Team Green.
  - **Team A Final Life**: Number input (`#edit-life-a`, `type="number"`, required).
  - **Team B Final Life**: Number input (`#edit-life-b`, `type="number"`, required).
  - **Team A Time Total**: Text input (`#edit-time-a`, placeholder `MM:SS` or `H:MM:SS`, pattern `^(\d+:)?\d{1,2}:\d{2}$`).
  - **Team B Time Total**: Text input (`#edit-time-b`, placeholder `MM:SS` or `H:MM:SS`, pattern `^(\d+:)?\d{1,2}:\d{2}$`).
  - **Error Container**: `#edit-game-errors` (`role="alert"`, hidden by default).
- **Actions**:
  - Cancel Button: `#cancel-edit-game-button` (`class="button button-quiet"`) -> Closes edit view without saving.
  - Save Button: `#save-edit-game-button` (`class="button button-primary"`) -> Validates inputs. If valid:
    1. Updates `state.completedGames[gameIndex].winnerTeamId`.
    2. Updates `state.completedGames[gameIndex].finalLifeTotals`.
    3. Updates `state.completedGames[gameIndex].teamTimers`.
    4. Persists state to `localStorage`.
    5. Re-renders history cards and player results table.
    6. Closes edit view and returns to `'between'`.

---

## 4. Life Adjustment Controls Contract

### 4.1 Buttons Specification
Inside each `.game-team` card, `.life-controls` contains 6 buttons:
- `-5`: `data-delta="-5"`
- `-3`: `data-delta="-3"`
- `-1`: `data-delta="-1"`
- `+1`: `data-delta="1"`
- `+3`: `data-delta="3"`
- `+5`: `data-delta="5"`

### 4.2 Behavior
- Clicking `-3` or `+3`:
  - Directly calls `adjustLife(game, teamId, -3)` or `adjustLife(game, teamId, 3)`.
  - Appends audit entry of type `LifeAdjusted`:
    ```json
    {
      "eventType": "LifeAdjusted",
      "details": {
        "teamId": "a",
        "delta": 3,
        "oldValue": 40,
        "newValue": 43
      }
    }
    ```
  - Triggers CSS animation `.feedback` (cleared on subsequent click or animation end).
