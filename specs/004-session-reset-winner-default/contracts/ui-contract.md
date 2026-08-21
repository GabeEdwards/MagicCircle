# UI Contract: Session Reset and Winner Default

## Session Reset

The between-games view exposes a distinct **New session** action alongside the non-destructive
**New game** action.

When reset is requested with any app data present, the confirmation must:

- Clearly state that the active game, completed game history, and player results will be erased.
- Offer explicit cancel and confirm actions.
- Leave the existing view and data unchanged on cancel.
- Return to the empty between-games state after confirm.

The reset action writes only the app's existing storage envelope and does not affect unrelated
browser data. The empty state shows no completed game cards and no player-stat rows.

## Winner Default

When the end-game view opens:

- Team Blue is selected if Blue's current life total is greater than Green's.
- Team Green is selected if Green's current life total is greater than Blue's.
- Neither team is selected when totals are equal.

The user can select either team before confirmation. The saved result uses the selection at
the moment of confirmation, not a stale default.

## Preservation Contract

- Existing dark theme, Team Blue/Team Green shading, roster sorting, life controls, turns,
  first-player state, persistence, history, and player statistics remain unchanged except
  when the user confirms a reset.
- Reset confirmation and winner selection are touch-usable and keyboard-accessible.
