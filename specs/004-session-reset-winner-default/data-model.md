# Data Model: Session Reset and Winner Default

## Session State

The existing persistence envelope remains the source of truth:

| Field | Type | Reset behavior |
| --- | --- | --- |
| `activeGame` | Active Game or null | Set to `null` |
| `completedGames` | ordered Completed Game list | Set to `[]` |
| `schemaVersion` | number | Preserved at the existing version |

A confirmed session reset writes this empty envelope to the existing application storage
key. Canceling reset leaves the envelope byte-for-byte equivalent in behavior.

## Session Reset Confirmation

A transient UI state containing:

| Field | Type | Rules |
| --- | --- | --- |
| `isOpen` | boolean | True only while confirmation is shown |
| `message` | fixed text | Names active game, completed history, and player results as data to erase |
| `decision` | cancel or confirm | No storage write until confirm |

The confirmation does not persist and does not affect unrelated browser data.

## Winner Selection

A transient end-game UI value:

| Field | Type | Rules |
| --- | --- | --- |
| `selectedWinner` | Team ID or empty | Default from final life comparison; user can replace it |
| `defaultWinner` | Team ID or empty | Blue if `lifeTotals.a > lifeTotals.b`, Green if inverse, empty on tie |
| `lifeTotals` | integer per team | May be negative or above 40; compare numerically |

When the user confirms, `selectedWinner` is copied into the existing Completed Game's
`winnerTeamId`. `defaultWinner` is not persisted.

## State Transitions

- `between-games -> reset-confirmation`: user chooses New session.
- `reset-confirmation -> between-games`: user cancels; state remains unchanged.
- `reset-confirmation -> between-games`: user confirms; empty envelope is persisted.
- `active -> reset-confirmation`: user invokes New session while an active game exists.
- `active -> end-game`: user opens end-game screen; default is derived from current totals.
- `end-game -> end-game`: user replaces or clears the default winner selection.
- `end-game -> between-games`: user confirms the final selected winner.
