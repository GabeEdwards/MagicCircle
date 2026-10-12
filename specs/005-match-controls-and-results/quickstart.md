# Quickstart & Validation Guide: Match Controls and Game Results Editing

**Feature Branch**: `005-match-controls-and-results`

## Prerequisites

1. Static file hosting or local browser preview (e.g. VS Code Live Server or opening `index.html` directly in a modern browser).
2. Modern web browser with Fullscreen API support (Chrome, Edge, Firefox, or Safari).

---

## Validation Scenarios

### Scenario 1: Maximize and Restore Screen View
1. Open `index.html`.
2. Locate the **Maximize** button in the top header.
3. Click **Maximize**:
   - *Expected*: The browser window transitions into fullscreen mode. The button label changes to **Restore** (or **Exit Maximize**) with `aria-pressed="true"`.
4. Press the `Escape` key (or click **Restore**):
   - *Expected*: The browser exits fullscreen mode. The button label reverts to **Maximize** with `aria-pressed="false"`.

---

### Scenario 2: Team Selection and First-Player Staging Stage
1. From the between-games screen, click **New game**.
2. Select 2 players for Team Blue (e.g., Alice and Bob) and 3 players for Team Green (e.g., Charlie, Dana, and Eli).
3. Click **Start game** (or advance):
   - *Expected*: The application transitions to the **First Player** confirmation view (`#first-player-view`) instead of directly starting the match.
   - *Expected*: The screen prominently announces a player from Team Blue (the smaller team) as starting first.
   - *Expected*: A note indicates the decision was made due to team-size fairness.
4. Click **Go back**:
   - *Expected*: The view returns to the setup screen. Alice and Bob are still selected on Team Blue; Charlie, Dana, and Eli are still selected on Team Green.
5. Click **Start game** again to return to the first-player stage, then click **Continue to game**:
   - *Expected*: The live game begins at Turn 1, with Team Blue positioned on the left and indicated as active.

---

### Scenario 3: Rapid ±3 Life Adjustments
1. In an active live game, observe the life adjustment buttons for both teams:
   - *Expected*: Each team card displays buttons for `-5`, `-3`, `-1`, `+1`, `+3`, and `+5`.
2. Click **+3** on Team Blue:
   - *Expected*: Team Blue's life increases from 40 to 43 immediately.
   - *Expected*: The button flashes a brief feedback animation.
3. Click **-3** on Team Green:
   - *Expected*: Team Green's life decreases from 40 to 37 immediately.
4. Click **Audit log**:
   - *Expected*: Entries are visible for Team Blue life +3 (40 to 43) and Team Green life -3 (40 to 37).

---

### Scenario 4: Edit Completed Game Results
1. End the game by clicking **End game**, select Team Blue as the winner, and click **Save result**.
2. On the between-games screen, locate the newly completed game card under **Recent games**.
3. Click the **Edit result** button on the game card:
   - *Expected*: An edit modal opens displaying the current winner (Team Blue), final life totals (e.g. 43 and 37), and elapsed times.
4. Change the winner to **Team Green**, adjust Team Blue's life to **35**, Team Green's life to **40**, and modify the times:
5. Click **Save**:
   - *Expected*: The game card updates immediately to show Team Green as Winner, with life 35 / 40.
   - *Expected*: The **Player results** table immediately reflects the updated winner (players on Team Green have +1 win, Team Blue players have +1 loss).
   - *Expected*: Exporting CSV contains the updated winner, life totals, and time durations.
6. Click **Edit result** on the game again, modify values, and click **Cancel**:
   - *Expected*: The modal closes and no changes are saved.

---

## Automated Validation Checklist

- [ ] Unit tests for ±3 life adjustment logic and audit event recording.
- [ ] Unit tests for editing completed game records (`editCompletedGame(game, updates)`).
- [ ] Unit tests for recomputing player statistics after a completed game edit.
- [ ] UI tests for first-player stage view transitions.
