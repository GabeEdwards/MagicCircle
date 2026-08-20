# Quickstart: MTG Game Tracker

## Prerequisites

- A current desktop browser or iPad Safari.
- The repository checked out locally.
- For local hosting, Python 3 or another static file server. No application server,
  database, account, or network service is required.

## Run Locally

From the repository root, start a static file server:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/` in the browser. Opening `index.html` directly may work,
but a local server gives storage and relative-path behavior closer to GitHub Pages.

## Acceptance Validation

1. Open the app and verify the between-games view shows an empty-history state and New Game.
2. Start a new game. Verify only the seven specified player names are available.
3. Try to continue with 0, 1, 5, or 6 members on a team. Verify setup is rejected with
   a clear team-size message.
4. Assign one player to both teams. Verify setup is rejected with duplicate-member
   feedback.
5. Configure two valid teams and start the game. Verify both life totals are 40, the
   turn is 1, and exactly one team is visibly marked as the random first player.
6. Advance turns and verify the sequence is first team Turn 1, second team Turn 1,
   first team Turn 2, second team Turn 2.
7. Adjust each team's life total. Verify each activation changes only the selected team
   by one, values can go below 0 and above 40, and controls remain usable.
8. Reload during an active game. Verify the active game and current values are restored
   when local storage is available.
9. End the game without selecting a winner. Verify completion is rejected. Select each
   possible winner in separate runs and confirm the result.
10. Return to between-games. Verify newest results appear first and include teams,
    winner, shared winning turn number, and both final life totals.
11. Start a new game after completing one. Verify prior history remains visible.
12. Repeat the in-game checks in portrait and landscape tablet orientations. Verify no
    required value or primary control is obscured or overlapping.

## GitHub Pages Validation

After the static files are published to the repository's configured GitHub Pages source:

1. Open the published URL in an iPad browser.
2. Confirm the between-games view loads without a sign-in or server dependency.
3. Start and track a game, then disable network access after the page loads.
4. Confirm life, turn, setup, and completion actions continue to work offline.
5. Reload with network unavailable and verify local recovery behavior matches the data
   model and UI contract.

## Expected Outcome

All acceptance checks pass without requiring a backend, remote database, account, third-
party image, or runtime dependency. The browser console contains no errors during the
primary setup, tracking, completion, recovery, and orientation flows.
