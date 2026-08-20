# Data Model: Team Display and Player Statistics

## Team Identity

A fixed presentation identity mapped onto the existing two team IDs.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | fixed identifier | Existing `a` or `b` team ID |
| `name` | fixed text | `Team Blue` for `a`; `Team Green` for `b` |
| `colorToken` | fixed text | Blue identity token for `a`; green identity token for `b` |

The mapping is stable across setup, active play, completed history, and player results.
Existing persisted IDs remain valid.

## Team Roster Display

The existing `members` list remains the source roster. Every rendered member list uses a
case-insensitive alphabetical copy of that list. Selection state remains independent of
display order.

Selection rules:

- Selecting a player for one team marks that player unavailable in the other team selector.
- The opposing control is disabled and visually greyed out.
- Removing the player from the selected team re-enables the opposing control.
- The selected team retains the player throughout the disabled state.

## Life Adjustment

An active game exposes four actions per team:

| Action | Delta |
| --- | ---: |
| `decreaseOne` | -1 |
| `increaseOne` | +1 |
| `decreaseFive` | -5 |
| `increaseFive` | +5 |

Life totals remain integers and are not clamped at zero or 40.

## Player Result

A derived aggregate calculated from completed games, not persisted separately.

| Field | Type | Derivation |
| --- | --- | --- |
| `playerName` | fixed text | Roster member name |
| `gamesPlayed` | non-negative integer | Count of completed-game rosters containing the player |
| `wins` | non-negative integer | Count where the player's team equals `winnerTeamId` |
| `losses` | non-negative integer | `gamesPlayed - wins` |
| `winPercentage` | percentage | `wins / gamesPlayed * 100`, displayed to one decimal place |

Only players with at least one completed game appear. A completed game contributes at most
once per player; valid team rosters prevent duplicate membership within a game.

## Derived View State

- `activeTeamId` selects the team with the active highlight.
- `teamIdentity` maps each team ID to name and color.
- `sortedMembers(team)` returns a display-only alphabetical copy.
- `playerResults(completedGames)` returns one result per participating player, ordered
  alphabetically by player name for stable scanning.
