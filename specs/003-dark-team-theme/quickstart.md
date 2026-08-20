# Quickstart: Dark Theme and Team Shading

## Prerequisites

- A current desktop browser or iPad Safari.
- The existing Magic Circle static app files.

## Run Locally

Use the existing static hosting command from the baseline quickstart, or open the static
entry point directly when no local server is available. No backend or database is needed.

## Acceptance Validation

1. Open between-games, setup, active-game, and end-game views. Verify the page, panels,
   controls, inputs, table, modal, empty state, and messages all use dark surfaces.
2. Verify headings, team names, member lists, life totals, history, statistics, and primary
   controls remain readable without bright light-theme surfaces.
3. In setup, verify Team Blue uses a dark blue shade and Team Green uses a dark green shade;
   verify the shades are distinct from each other and the page background.
4. Start a game and verify team panels retain their Blue/Green shades while the active team
   receives a separate visible highlight.
5. Advance the turn and verify the highlight moves without changing either team shade.
6. Check focused, selected, disabled, hovered, and validation-error controls. Verify each
   state remains distinguishable and readable on dark surfaces.
7. Verify negative and above-40 life totals remain readable with team shading and active
   highlighting intact.
8. Complete a game and verify history and player-results surfaces retain the dark theme and
   team-associated shading, with all baseline values unchanged.
9. Reload the app and verify existing active-game or completed-history recovery is unchanged.
10. Repeat checks in portrait and landscape tablet orientations and verify no required value
    or control is hidden, clipped, or overlapped.
11. Run with a forced-contrast or equivalent accessibility setting when available and verify
    team labels, controls, active state, and required values remain usable.
12. Confirm browser network activity does not gain a new request caused by the theme change.

## Expected Outcome

The app presents a cohesive dark interface with readable content, distinct dark Team Blue
and Team Green surfaces, and an active-team cue that remains visible without changing game
data or behavior.
