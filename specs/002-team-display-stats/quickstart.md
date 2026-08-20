# Quickstart: Team Display and Player Statistics

## Prerequisites

- A current desktop browser or iPad Safari.
- The repository checked out locally.
- Existing static app files from the baseline feature.

## Run Locally

Use the existing static hosting command from the baseline quickstart, or open the static
entry point directly when no local server is available. No backend or database is needed.

## Acceptance Validation

1. Open team setup and verify the headings are exactly Team Blue and Team Green, with blue
   and green visual treatments.
2. Verify all seven player names appear alphabetically in both selectors.
3. Select Gabe for Team Blue. Verify Gabe is greyed out and disabled for Team Green while
   remaining selected for Team Blue. Remove Gabe and verify Team Green can select Gabe.
4. Start a game and verify both rosters remain alphabetically ordered and the active team
   has a distinct highlight in addition to its team color.
5. Activate each team's -1, +1, -5, and +5 controls. Verify only the selected team changes
   by the exact labeled amount, including when totals are below zero or above 40.
6. Advance the turn and verify the active highlight moves to the newly active team.
7. Complete one game for Team Blue and another for Team Green using overlapping players.
   Return to between-games and verify each participating player's games, wins, losses, and
   one-decimal win percentage match the source game winners.
8. Verify player rows are alphabetized and completed-game cards still show their original
   team rosters and winner.
9. Clear completed history or use a fresh browser profile. Verify the player-results area
   shows a clear zero-results state with no percentage values.
10. Repeat setup and live-game checks in portrait and landscape tablet orientations and
    confirm required values and controls remain visible without overlap.

## Expected Outcome

All enhancement scenarios pass without changing the baseline persisted game record shape,
requiring a server, or requiring network access after the page has loaded.
