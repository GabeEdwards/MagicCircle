# UI Contract: MTG Game Tracker

This contract defines observable states and user actions. It is the interface between
the game state model and the single-page experience.

## View States

### Between Games

Must expose:

- A New Game action.
- Recent completed games, newest first.
- For every result: both team member lists, winner, shared winning turn number, and
  final life total for both teams.
- A clear empty-history state when no game has been completed.
- A storage warning when history cannot be read or saved.

### Team Setup

Must expose:

- Two team selectors using only the seven fixed player names.
- Visible selected-member counts for both teams.
- A confirmation action disabled or rejected until both teams have 2-4 distinct members
  and no player appears on both teams.
- Validation feedback identifying the invalid team and reason.
- A cancel/back action that returns to between-games without changing history.

### In Game

Must expose:

- Both team member lists and current life totals.
- Current shared turn number.
- Active team and first-player indication.
- Separate increment and decrement controls for each team.
- A turn action that alternates teams and applies the shared-round counter rule.
- An End Game action.
- A New Game action that requires confirmation before abandoning an active game.

Life values must remain visible as numeric values when negative or above 40.

### End Game Confirmation

Must expose:

- Both teams as mutually exclusive winner choices.
- The current shared turn number and final life totals for review.
- A confirmation action disabled or rejected until a winner is selected.
- A cancel action that returns to the active game without changes.

## Action Contracts

| Action | Preconditions | Observable result |
| --- | --- | --- |
| `startNewGame` | Between-games, or active game abandonment confirmed | Opens setup or clears the confirmed active game |
| `selectMember` | Setup view | Toggles one player for one team and updates validation |
| `confirmSetup` | Both teams valid | Creates Active Game with life 40, turn 1, and a first-player selection; uses secure randomness when available and visibly warns when the browser fallback is used |
| `adjustLife(team, delta)` | Active game; `delta` is +1 or -1 | Changes only the selected team's total by one, without bounds |
| `advanceTurn` | Active game | Alternates active team; increments shared turn only on return to first player |
| `openEndGame` | Active game | Opens winner selection without changing game state |
| `confirmWinner(team)` | One configured team selected | Creates Completed Game snapshot and returns to between-games |
| `cancelEndGame` | End-game view | Returns to unchanged active game |
| `restoreState` | Page load | Restores valid persisted state or starts between-games with warning |

## Touch and Layout Contract

- Primary actions must be usable by touch without keyboard or mouse.
- Team controls must remain visually associated with the corresponding team.
- Required game values and controls must remain visible in portrait and landscape tablet
  layouts without overlap or horizontal clipping.
- Controls must have stable dimensions so labels and values do not shift during updates.
