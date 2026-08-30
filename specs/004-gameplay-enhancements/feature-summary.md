# Gameplay Enhancements Summary

## Delivered Features

1. The smaller team starts first when team sizes differ; equal teams use secure random selection when available.
2. The first-player team remains first in the rendered game layout throughout the game.
3. Turn undo restores the turn, active team, life totals, and chess-clock state.
4. A persisted sound preference controls the turn-advance tone.
5. Player results can be sorted by name, wins, games played, or win rate in either direction.
6. Life controls use a 300 ms feedback animation that resets after each press.
7. Each team has an active or paused elapsed-time clock, including recovery after reload and completed-game summaries.
8. Completed games export as UTF-8 CSV in newest-first order.
9. An in-game audit viewer shows chronological, contract-shaped gameplay events; completed games retain their logs.

## Verification

- Automated logic suite: `node --test tests/*.test.js`
- Browser flow: create a game, advance and undo a turn, inspect the audit log, reload, and confirm timer recovery.
- Manual device coverage: audio mute behavior, iPad portrait and landscape, and sustained timer accuracy require a supported physical device.