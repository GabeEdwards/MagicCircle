# Acceptance Checklist

- [x] Setup shows only the seven fixed players.
- [x] Invalid team sizes and duplicate players are rejected with clear feedback.
- [x] A valid game starts at 40 life, Turn 1, with one visible first player.
- [x] Missing secure randomness uses a browser fallback and displays a fairness warning in the state API; secure-random UI fallback requires a browser that exposes no `crypto.getRandomValues`.
- [x] Life totals can move below zero and above 40.
- [x] Turn sequence is first team Turn 1, second team Turn 1, first team Turn 2.
- [x] Winner confirmation records both teams, winner, shared turn, and final life totals.
- [x] Reload restores active play and completed history when storage is available.
- [x] New game abandonment requires confirmation and preserves completed history by guarded UI flow.
- [x] Portrait and landscape tablet layouts keep values and controls visible.
- [x] Loaded app continues tracking without network access when opened from the static file.
- [x] Setup identifies the teams as Team Blue and Team Green with matching visual treatments.
- [x] Setup sorts player names alphabetically and disables selected players in the opposing team.
- [x] Active games highlight the active team and provide -5, -1, +1, and +5 controls.
- [x] Between-games view shows alphabetized player games, wins, losses, and one-decimal win percentages.
- [x] Every app view and state uses dark surfaces with readable text and controls.
- [x] Team Blue and Team Green use distinct dark shades in setup, game, and history displays.
- [x] Active-team emphasis remains visible over team shading and does not rely on color alone.
- [x] Focused, disabled, selected, error, and forced-contrast states remain usable on dark surfaces.
- [x] New session warns before erasing active game, history, and player results.
- [x] Canceling New session preserves all existing data.
- [x] Confirming New session clears active game, history, and player results.
- [x] Higher-life winner is selected by default, ties remain unselected, and the user can override the default.

## Validation Notes

- Browser acceptance checks passed on 2026-08-20 at desktop and tablet-sized viewports.
- Node.js and Python are unavailable in the current environment, so the Node test files
  were not executed and a local HTTP server could not be started.
