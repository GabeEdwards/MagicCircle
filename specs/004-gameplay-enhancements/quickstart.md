# Quickstart: Gameplay Enhancements Validation

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-30

This guide provides runnable validation scenarios that verify each gameplay enhancement is working correctly. Use these scenarios during testing and after implementation to confirm feature completeness.

---

## Prerequisites

- MTG Game Tracker deployed and running (either locally or on GitHub Pages)
- A recent browser with Web Audio API support (for audio feedback tests)
- Local storage enabled in browser settings
- For iPad tests: physical iPad with Safari browser
- Access to browser developer console (F12 or Cmd+Option+I)

---

## Setup for All Scenarios

Before starting any test:

1. **Clear browser storage**: Open DevTools → Application → Storage → Local Storage → select this site → Clear All
2. **Reload page**: Refresh the app (Cmd+R or Ctrl+R)
3. **Navigate to between-games view**: Verify you see the "New Game" button

---

## Scenario 1: Fair First-Player Selection (Team Size Aware)

**Feature**: FR-001, FR-002 | **Priority**: P1

**Objective**: Verify that when team sizes differ, the smaller team automatically starts first.

### Steps

1. **Create a new game**
   - Press "New Game" button
   - Assign Team A: Gabe, Phil (2 members)
   - Assign Team B: Tung, Siu, Anthony, Chris (4 members)
   - Confirm team setup

2. **Verify first player selection**
   - Game view appears
   - Check which team is active (highlighted or marked as "Team A's turn" or "Team B's turn")
   - Verify Team A (2 members) is active, not Team B (4 members)

3. **Check audit log** (if implemented)
   - Open audit log viewer
   - Find "GameStarted" event
   - Verify `firstPlayerSelectionMethod` is `"team-size-fairness"`

4. **Repeat with reversed sizes**
   - End game (select any winner)
   - Create new game: Team A with 4 members, Team B with 2 members
   - Verify Team B (smaller) is active

### Expected Outcome

✓ Smaller team always starts first
✓ Audit log shows `"team-size-fairness"` selection method
✓ App provides visual indication that fairness logic was applied (optional; can be in audit log only)

---

## Scenario 2: First-Player Team Left-Side Layout

**Feature**: FR-003 | **Priority**: P1

**Objective**: Verify that the first-player team is always on the left side in both orientations.

### Steps

1. **Start a new game with unequal team sizes**
   - Team A: Gabe, Phil (first player due to size)
   - Team B: Tung, Siu, Anthony
   - Confirm and view game

2. **Verify left-side positioning (portrait mode)**
   - In portrait orientation (iPad held upright), verify Team A is on the left
   - Verify Team B is on the right

3. **Rotate to landscape**
   - Rotate iPad to landscape orientation (sideways)
   - Verify Team A remains on the left
   - Verify Team B remains on the right

4. **Advance turns**
   - Press "Next Turn" button multiple times (at least 3 times)
   - Verify Team A stays on the left throughout

5. **Rotate back to portrait**
   - Rotate iPad back to portrait
   - Verify Team A still on left, Team B on right

6. **Verify layout stability**
   - Close game and create another new game with different teams
   - First-player team (selected by size or random) always appears on left

### Expected Outcome

✓ First-player team on left in portrait and landscape
✓ Layout remains stable across turn advances and rotations
✓ Other team always on right
✓ No overlap or hidden controls in either orientation

---

## Scenario 3: Turn Undo Functionality

**Feature**: FR-004, FR-005, FR-006 | **Priority**: P1

**Objective**: Verify that undo reverts turn state and disables appropriately.

### Steps

1. **Start a new game**
   - Confirm team setup (any teams)
   - Note initial state: Turn 1, first team active

2. **Verify undo disabled at start**
   - Look for undo button (should be grayed out or disabled)
   - Attempt to press undo (should have no effect)

3. **Advance turn and undo**
   - Press "Next Turn"
   - Verify active team changed
   - Press "Undo"
   - Verify active team reverted to previous state
   - Verify turn number unchanged (both teams on Turn 1)

4. **Undo multiple times**
   - Advance turn 5 times (turn counter goes 1→2→2→3→3→4→4)
   - Press undo 4 times
   - Verify turn counter and active team step back correctly with each undo

5. **Advance after undo**
   - After undoing several times, press "Next Turn"
   - Verify state advances from the undo point (no redo history)

6. **Test undo with life adjustments**
   - Advance turn
   - Adjust Team A life +5
   - Undo
   - Verify Team A life reverted to pre-adjustment value

7. **Test undo with timer state** (if timers implemented)
   - Advance turn (timer starts for new active team)
   - Wait a few seconds
   - Press undo
   - Verify timers reverted to pre-advance values

### Expected Outcome

✓ Undo button disabled when no turns to revert
✓ Undo reverts turn number and active team correctly
✓ Multiple undos step back through entire history
✓ Undo reverts life totals and timer state
✓ New turn advance after undo creates new timeline (no redo)

---

## Scenario 4: Audio Feedback on Turn Advance

**Feature**: FR-007, FR-008, FR-009 | **Priority**: P2

**Objective**: Verify that sound plays on turn advance when enabled and device not muted.

### Steps

1. **Start a new game**
   - Confirm team setup
   - Note: Device must have volume up (not muted)

2. **Enable sound** (if settings available)
   - Look for sound toggle in settings or UI
   - Ensure sound is enabled (default is on)
   - Verify indication (icon or label) shows sound is enabled

3. **Advance turn and listen**
   - Press "Next Turn"
   - Listen for distinctive beep/tone
   - Repeat 3 times; verify sound plays each time

4. **Disable sound** (if toggle available)
   - Toggle sound to off
   - Advance turn
   - Verify no sound plays

5. **Re-enable sound**
   - Toggle sound to on
   - Advance turn
   - Verify sound plays again

6. **Test device mute** (iPad physical mute switch)
   - Set device to muted (physical switch on side of iPad)
   - Ensure sound is enabled in app
   - Advance turn
   - Verify no sound plays (device mute is respected)

7. **Unmute device**
   - Set device to unmuted
   - Advance turn
   - Verify sound plays

8. **Test sound persistence**
   - End game, create new game
   - Verify sound setting is preserved (same as before)

### Expected Outcome

✓ Sound plays on turn advance when enabled and device not muted
✓ Sound is distinctive and audible (not inaudible beep)
✓ Sound respects user setting and device mute state
✓ Sound setting persists across games
✓ No errors in console when playing sound

---

## Scenario 5: Sortable Player Statistics

**Feature**: FR-020 (sort subset) | **Priority**: P2

**Objective**: Verify that completed games can be sorted by various criteria.

### Steps

1. **Create and complete 5–10 games**
   - Each game with different team compositions and winners
   - Note: Use varied teams (e.g., 3 games won by Gabe, 2 by Phil, etc.)

2. **View between-games results**
   - Press "End Game" (if in active game) or navigate to between-games view
   - Verify results list shows all completed games

3. **Find sort controls**
   - Look for sort dropdown, buttons, or column headers
   - Available sort criteria: player name, team, win count, participation, date

4. **Sort by player name (A→Z)**
   - Select "Sort by Player Name" or click name column
   - Verify results reorder alphabetically (Gabe before Phil, etc.)

5. **Sort by player name (Z→A)**
   - Select descending order (if toggle available)
   - Verify reverse alphabetical order

6. **Sort by win count (high→low)**
   - Select "Sort by Wins"
   - Verify player with most wins appears first

7. **Sort by games played**
   - Select "Sort by Games Played"
   - Verify player with most games appears first

8. **Sort persistence**
   - Reload page
   - Verify sort preference is restored (same sort as before reload)

### Expected Outcome

✓ Results reorder correctly for each sort criterion
✓ Ascending and descending sort work
✓ Sort preference persists across page reloads
✓ All games remain visible (sort doesn't hide any results)
✓ Aggregate statistics (win %, games played) computed correctly

---

## Scenario 6: Button Feedback Without Persistent Highlight

**Feature**: FR-010, FR-011, FR-012 | **Priority**: P2

**Objective**: Verify that life adjustment buttons provide brief feedback without staying highlighted.

### Steps

1. **Start a new game**
   - Confirm teams and begin gameplay

2. **Test single button press**
   - Press Team A life +1 button
   - Observe brief visual feedback (highlight, color change, or animation)
   - Verify feedback completes and button returns to default state
   - Verify no persistent highlight remains

3. **Test rapid presses**
   - Press Team A life +1 button 10 times in quick succession
   - Observe each press produces brief feedback
   - Verify none of the feedback states "stick" or persist
   - Verify all presses registered (life total increments 10 times)

4. **Test different button**
   - Press Team B life -1 button
   - Observe brief feedback and return to default
   - Verify button does not stay in active/pressed state

5. **Verify feedback timing**
   - Press button
   - Measure feedback duration (approximately 300 ms or less)
   - Verify animation completes quickly (not sluggish or delayed)

6. **Verify life total updates immediately**
   - Press life adjustment button
   - Confirm life total changes instantly (before or as feedback plays)
   - Verify feedback animation doesn't delay the numeric update

### Expected Outcome

✓ Brief, visible feedback on every button press
✓ Feedback completes within ~300 ms
✓ No persistent highlight remains after feedback
✓ Rapid presses each show distinct feedback
✓ Life total updates immediately (not delayed by animation)

---

## Scenario 7: Chess-Clock Team Timers

**Feature**: FR-013 through FR-019 | **Priority**: P2

**Objective**: Verify that team timers track elapsed time accurately and display correctly.

### Steps

1. **Start a new game**
   - Confirm teams
   - Note the time (e.g., 15:23:00) or use stopwatch app

2. **Verify timer initialization**
   - Check both team timers display 00:00
   - Verify one timer shows "Active" or running indicator, other shows "Paused"

3. **Wait and verify timer tick**
   - Wait 5–10 seconds
   - Observe active team's timer increment
   - Verify paused team's timer remains unchanged
   - Manually verify against wall clock (should match within ±1 second)

4. **Advance turn**
   - Press "Next Turn"
   - Verify previously active team's timer pauses (stops incrementing)
   - Verify other team's timer starts incrementing

5. **Wait and verify opposite team's timer**
   - Wait 10 seconds
   - Verify second team's timer increments by ~10 seconds
   - Verify first team's timer remains unchanged

6. **Advance turn again**
   - Press "Next Turn"
   - Verify first team's timer resumes incrementing
   - Verify second team's timer pauses

7. **Verify timer display formats**
   - Play game for at least 5 minutes
   - Verify times display as MM:SS (e.g., 05:45)
   - Play game for over 1 hour (if feasible)
   - Verify times display as H:MM:SS (e.g., 1:05:45)

8. **Test undo with timers**
   - Advance turn and wait 30 seconds
   - Advance turn again and wait 20 seconds
   - Note both timers (e.g., Team A: 2:00, Team B: 1:30)
   - Press "Undo"
   - Verify timers revert to pre-undo state (e.g., Team A: 1:30, Team B: 0:00)

9. **Verify timer in game summary**
   - End the game
   - View game result in between-games view
   - Verify both teams' final elapsed times are displayed
   - Manually verify total time ≈ sum of observed increments

10. **Page reload test** (if session recovery enabled)
    - Start game, advance turn, wait 30 seconds
    - Hard refresh page (Cmd+Shift+R or Ctrl+Shift+R)
    - Verify game restored with timer values intact
    - Verify active team's timer continues running from restored value

### Expected Outcome

✓ Timers initialize to 00:00 at game start
✓ Active team's timer increments, paused timer doesn't
✓ Timers swap correctly on turn advance
✓ Timer accuracy within ±1 second over 5+ minute game
✓ Display format: MM:SS for <1 hour, H:MM:SS for ≥1 hour
✓ Undo reverts timers to pre-undo state
✓ Final times displayed in game summary
✓ Timers persist correctly across page reload

---

## Scenario 8: CSV Export of Game Results

**Feature**: FR-020, FR-021, FR-022 | **Priority**: P2

**Objective**: Verify that game results export to CSV with correct format and data.

### Steps

1. **Create and complete 3–5 games**
   - Vary teams, winners, and turn numbers
   - Note game details for verification

2. **Navigate to between-games view**
   - View completed games list

3. **Find export button**
   - Look for "Export to CSV", "Download Results", or similar button
   - Should be in between-games view

4. **Trigger export**
   - Press export button
   - Browser should show save dialog
   - Verify filename is appropriate (e.g., `magic-circle-games-2026-08-30.csv`)

5. **Save file**
   - Choose location and save

6. **Open CSV in spreadsheet**
   - Open file in Excel, Google Sheets, LibreOffice Calc, or Apple Numbers
   - Verify data imports without errors
   - Verify columns are: Date, Team A Members, Team B Members, Winner, Final Turn, Team A Final Life, Team B Final Life, Team A Elapsed Time, Team B Elapsed Time

7. **Verify data correctness**
   - Check first row: Should match most recent game
   - Verify team member names are comma-separated and quoted if needed
   - Verify winner is "Team A" or "Team B"
   - Verify turn numbers match game results
   - Verify life totals match (including negatives and values > 40)
   - Verify elapsed times are in MM:SS format

8. **Verify row ordering**
   - Newest games appear first in CSV
   - Oldest games appear last

9. **Test multiple exports**
   - Repeat export process
   - Verify data is consistent across multiple exports
   - Verify no data is lost or duplicated

### Expected Outcome

✓ Export button available in between-games view
✓ CSV file downloads with appropriate filename
✓ CSV opens in standard spreadsheet applications
✓ All columns present with correct headers
✓ Data matches completed games (teams, winner, turn, life totals, times)
✓ Rows ordered newest-first
✓ No data loss or corruption
✓ Player names properly escaped if containing commas

---

## Scenario 9: Audit Log Viewer

**Feature**: FR-023 through FR-028 | **Priority**: P2

**Objective**: Verify that audit log records all gameplay events and provides accessible viewer.

### Steps

1. **Start a new game**
   - Note that audit log starts recording immediately

2. **Open audit log viewer**
   - Look for "View Log", "Audit Log", or similar link/button
   - Should be accessible during active gameplay without interrupting game

3. **Verify GameStarted event**
   - Check first entry in log
   - Should show game start with team compositions and first player selected
   - Should include timestamp

4. **Adjust life total and verify LifeAdjusted event**
   - Press Team A +5 life button
   - Check audit log
   - Should show: Team A, +5, old value, new value, timestamp

5. **Advance turn and verify TurnAdvanced event**
   - Press "Next Turn"
   - Check audit log
   - Should show: old active team, new active team, turn numbers, timestamp

6. **Advance again and verify another TurnAdvanced event**
   - Press "Next Turn" again
   - Check audit log
   - Should show new turn advancement with turn counter increment

7. **Undo and verify UndoTurn event**
   - Press "Undo"
   - Check audit log
   - Should show: reverted turn number, restored active team, timestamp

8. **Verify log accessibility**
   - Scroll through audit log viewer
   - Verify you can dismiss/close it
   - Return to main game view
   - Verify game state unchanged

9. **End game and verify GameEnded event**
   - Select and confirm a winner
   - Audit log viewer might close or show final event
   - If viewing log in between-games view, check for GameEnded entry with:
     - Winner team, final turn, final life totals, team times, timestamp

10. **Verify log completeness**
    - Create a new game and play through 5 turns with life adjustments
    - End game
    - Check audit log
    - Count events: 1 GameStarted + N×LifeAdjusted + 5×TurnAdvanced + 1 GameEnded
    - Verify all events present

### Expected Outcome

✓ Audit log records all significant game events
✓ Events include timestamps and relevant details
✓ Log viewer accessible during gameplay without interruption
✓ Log displayed in chronological order
✓ Events are human-readable (clear action descriptions)
✓ No sensitive data exposed (only game data, no device info)
✓ Log preserved with completed game
✓ All events recorded with 100% completeness

---

## Post-Implementation Test Checklist

After implementing all features, run through this checklist:

- [ ] Scenario 1: Fair team-size first-player selection works
- [ ] Scenario 2: First-player team always on left side
- [ ] Scenario 3: Undo functionality complete and correct
- [ ] Scenario 4: Audio feedback plays on turn advance
- [ ] Scenario 5: Statistics sortable by multiple criteria
- [ ] Scenario 6: Button feedback fades without persistence
- [ ] Scenario 7: Chess-clock timers accurate and persistent
- [ ] Scenario 8: CSV export correct and complete
- [ ] Scenario 9: Audit log records and displays all events
- [ ] All features tested on iPad (if available)
- [ ] All features tested in portrait and landscape
- [ ] No console errors during testing
- [ ] No performance issues (UI responds within 100 ms)
- [ ] Data persists correctly across page reload
- [ ] Old games from Feature 001 still display correctly

---

## Known Limitations and Future Work

- Audit log viewer may not be available for games created before Feature 004 (acceptable graceful degradation)
- Sort preference reset if localStorage cleared
- CSV export may be large if many games recorded (not filtered by date range in this release)
- Timer precision is ±1 second (sufficient for casual play)

---

## Support and Troubleshooting

**Sound not playing?**
- Verify device is unmuted (physical switch on iPad)
- Check browser volume settings
- Ensure Web Audio API is supported in your browser

**Timer not updating?**
- Refresh page and check if timers resume
- Verify browser performance (heavy CPU load can delay updates)

**Export fails?**
- Try different browser (some have stricter download policies)
- Verify local storage is not full
- Check browser console for error messages

**Undo not working?**
- Ensure at least one turn has been advanced
- Verify undo button is enabled (not grayed out)
- Check that game status is "active" (not completed)

