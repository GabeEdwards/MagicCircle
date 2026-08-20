# UI Contract: Team Display and Player Statistics

## Team Identity

All views use the fixed labels and visual mapping:

| Team ID | Label | Visual treatment |
| --- | --- | --- |
| `a` | Team Blue | Blue border, accent, or background treatment |
| `b` | Team Green | Green border, accent, or background treatment |

Color must not be the only active-state signal.

## Setup Contract

- Show Team Blue and Team Green as the two setup headings.
- Display each team's available players in case-insensitive alphabetical order.
- When a player is selected for one team, render the same player's opposing checkbox or
  control disabled and greyed out.
- Re-enable the opposing control when the player is removed from the selected team.
- Keep the selected team's control and membership visible.

## Active Game Contract

- Render both team rosters alphabetically.
- Apply each team's identity color to its game panel.
- Apply a distinct active highlight to the team whose ID equals `activeTeamId`.
- Provide `-1`, `+1`, `-5`, and `+5` controls for each team.
- Each action updates only its team's life total by the labeled amount.
- Highlight state moves when the existing turn action changes `activeTeamId`.

## Between-Games Contract

Retain the existing newest-first completed-game results and add a player-results table.
The table contains:

| Column | Meaning |
| --- | --- |
| Player | Alphabetically sorted participating player name |
| Games | Completed games involving that player |
| Wins | Games where the player's team won |
| Win percentage | Wins divided by games, displayed to one decimal place |

When no completed games exist, show a clear no-results state and no fabricated percentages.

## Preservation Contract

- Existing completed-game records remain the source of truth and keep their team IDs.
- Existing random first-player, turn, local storage, and life-total behavior remain intact.
- New derived statistics are recalculated whenever the between-games view renders.
