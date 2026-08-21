# Quickstart: Session Reset and Winner Default

## Prerequisites

- A current desktop browser or iPad Safari.
- The existing Magic Circle static app files.

## Run Locally

Use the existing static hosting command from the baseline quickstart, or open the static
entry point directly when no local server is available. No backend or database is needed.

## Acceptance Validation

1. Complete a game so the between-games view contains a game card and player results.
2. Start another game without finishing it, then invoke **New session**. Verify the warning
   states that the active game, completed history, and player results will be erased.
3. Cancel the reset. Verify the active game and existing history/statistics remain unchanged.
4. Invoke **New session** again and confirm. Verify the app returns to an empty between-games
   view with no game cards or player-stat rows.
5. Start a new game after reset and verify setup behaves as a fresh session.
6. Create a game where Team Blue has higher life than Team Green. Open End game and verify
   Team Blue is selected by default.
7. Create a game where Team Green has higher life than Team Blue, including negative and
   above-40 values. Verify Team Green is selected by default.
8. Create a game with equal life totals. Verify neither winner is selected and Save result
   remains unavailable until a team is chosen.
9. Select the non-default team and save. Verify the completed-game history records the final
   user selection.
10. Reload after reset and after a saved result. Verify local persistence remains correct.
11. Repeat reset confirmation and winner selection on a tablet-sized viewport and verify all
    controls remain visible and touch-usable.

## Expected Outcome

Session reset is explicit and reversible until confirmation, confirmed reset produces a clean
session, and higher-life winner defaults speed common completion without preventing correction
or silently deciding ties.
