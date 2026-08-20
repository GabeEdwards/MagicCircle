# UI Contract: Dark Theme and Team Shading

## Global Theme Contract

Every visible application state uses the dark theme:

- Between-games history and player-results table
- Team setup and selection controls
- Active-game panels, life totals, and controls
- End-game winner dialog
- Empty, validation-error, storage-warning, focused, hovered, disabled, and selected states

No required text, value, control, or status may depend on a bright light-theme surface.

## Team Surface Contract

| Team | Required surface | Required identity cues |
| --- | --- | --- |
| Team Blue | Dark blue shade with readable text and distinct accent | Team Blue label and non-color active cue |
| Team Green | Dark green shade with readable text and distinct accent | Team Green label and non-color active cue |

Team shades must remain distinguishable from each other, the page background, and the
active highlight. The same mapping applies in setup, active play, and history.

## State Contract

- The active team receives a distinct border, outline, shadow, or equivalent non-color cue
  in addition to its team shade.
- Focused controls remain clearly outlined on dark surfaces.
- Disabled controls remain visibly disabled without becoming unreadable.
- Selected controls retain enough contrast to distinguish selected from default.
- Forced-contrast modes may reduce decorative shading but must preserve labels, controls,
  and active-state semantics.

## Preservation Contract

- Team IDs, names, rosters, life totals, turns, first-player state, completed-game records,
  player statistics, and local persistence are unchanged.
- The feature adds no network request, server dependency, or theme preference storage.
- Touch controls and portrait/landscape tablet layout remain usable.
