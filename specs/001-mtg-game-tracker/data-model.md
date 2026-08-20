# Data Model: MTG Game Tracker

## Player

Represents one selectable participant.

| Field | Type | Rules |
| --- | --- | --- |
| `name` | fixed text | One of Gabe, Phil, Tung, Siu, Anthony, Chris, or Kate |

Players are value objects from a fixed pool; no account, profile, or mutable player
record is required.

## Team

Represents one side in a game.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | fixed identifier | Exactly one of the two team identifiers |
| `members` | ordered list of Player names | Contains 2-4 distinct names from the fixed pool |

The two teams must not share a member. The member order is presentation-only and has no
gameplay meaning.

## Active Game

Represents the in-progress game.

| Field | Type | Rules |
| --- | --- | --- |
| `teams` | two Team records | Exactly two teams; valid membership rules apply |
| `lifeTotals` | mapping by team id to integer | Starts at 40; may increase above 40 or decrease below 0 |
| `turnNumber` | positive integer | Starts at 1; shared by both teams' current turns |
| `activeTeamId` | team identifier | Exactly one configured team is active |
| `firstPlayerTeamId` | team identifier | Exactly one configured team; selected with equal probability |
| `status` | fixed text | `active` while the game is in progress |

### Turn transition

At game start, `turnNumber` is 1 and `activeTeamId` equals `firstPlayerTeamId`.
Each turn action alternates `activeTeamId`. Increment `turnNumber` only when the active
team changes back to `firstPlayerTeamId`; therefore the sequence is:

1. First player team, Turn 1
2. Other team, Turn 1
3. First player team, Turn 2
4. Other team, Turn 2

### Active-game transitions

- `between-games -> setup`: user chooses New Game.
- `setup -> active`: both teams pass membership validation and the user confirms.
- `active -> active`: life adjustment or turn action succeeds.
- `active -> between-games`: user selects and confirms a winner; a Completed Game is
  created and the active game is cleared.
- `active -> setup`: user chooses New Game and confirms abandoning the active game.
- `active -> active`: page reload restores the saved active game when storage is valid.
- `active -> between-games`: storage recovery is unavailable; no unverified result is
  created.

## Completed Game

Represents a saved result shown in recent history.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | unique text | Stable identifier for the saved result |
| `teams` | two Team records | Snapshot of the active game's team compositions |
| `winnerTeamId` | team identifier | Must identify one of the two saved teams |
| `winningTurnNumber` | positive integer | Snapshot of the shared turn number when confirmed |
| `finalLifeTotals` | mapping by team id to integer | Snapshot; values may be negative or above 40 |
| `completedAt` | timestamp text | Local completion time for ordering/display |

Completed games are stored newest first. History is bounded by a product decision during
implementation if a practical device-storage limit is needed; no artificial limit is
part of the user-facing MVP contract.

## Persistence Envelope

The persisted client state contains:

- `activeGame`: an Active Game or `null`.
- `completedGames`: an ordered list of Completed Game records.
- `schemaVersion`: a numeric format version for future migrations.

Invalid or unreadable persisted data must be ignored without inventing a result. The app
must continue in between-games mode and provide a clear storage warning when it cannot
save or restore state.
