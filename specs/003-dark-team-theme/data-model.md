# Data Model: Dark Theme and Team Shading

This presentation-only feature does not add persisted entities or change the existing game
state model.

## Theme Surface

A rendered page or component surface using the dark palette.

| Field | Type | Rules |
| --- | --- | --- |
| `role` | fixed text | Page, surface, control, table, modal, status, or input |
| `background` | color value | Dark enough to support readable foreground text |
| `foreground` | color value | Contrast-safe text or icon color |
| `state` | fixed text | Default, hover, focus, disabled, selected, active, or error |

Theme Surface values are presentation tokens, not user data.

## Team Shade

A dark tinted surface associated with an existing team identity.

| Field | Type | Rules |
| --- | --- | --- |
| `teamId` | fixed identifier | Existing Team Blue or Team Green ID |
| `teamName` | fixed text | Exactly Team Blue or Team Green |
| `shade` | color value | Dark blue for Team Blue or dark green for Team Green |
| `accent` | color value | Border or accent that remains distinguishable on dark surfaces |

Team Shade is applied consistently to setup panels, active-game panels, and team-associated
history/result surfaces. Existing team IDs and roster records remain unchanged.

## Active Highlight

A derived visual state for the team whose existing `activeTeamId` matches the panel's team.
It must be distinguishable from both Team Shade values and the overall dark background and
must not modify the active-game data.

## Compatibility

- No new local-storage fields are required.
- No migration is required for completed games or active games.
- Existing team names, roster sorting, life controls, turns, history, and player results
  remain data and behavior contracts outside this presentation change.
