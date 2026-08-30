const test = require('node:test');
const assert = require('node:assert/strict');
const { createActiveGame, advanceTurn, undoTurn, readState, timerElapsed, formatElapsedTime } = require('../app.js');

const teams = [
  { id: 'a', members: ['Gabe', 'Phil'] },
  { id: 'b', members: ['Tung', 'Siu'] }
];

test('turn advance pauses the active timer and starts the opposing timer', () => {
  const game = createActiveGame(teams, { getRandomValues: (values) => { values[0] = 0; } }, 1000);
  const next = advanceTurn(game, 4500);

  assert.equal(next.timers.a.elapsedMs, 3500);
  assert.equal(next.timers.a.lastStartTime, null);
  assert.equal(timerElapsed(next.timers.b, 6000), 1500);
});

test('undo restores and resumes the previously active team timer', () => {
  const game = createActiveGame(teams, { getRandomValues: (values) => { values[0] = 0; } }, 1000);
  const advanced = advanceTurn(game, 4500);
  const restored = undoTurn(advanced, 6000);

  assert.equal(restored.activeTeamId, 'a');
  assert.equal(restored.timers.a.elapsedMs, 3500);
  assert.equal(restored.timers.a.lastStartTime, 6000);
  assert.equal(restored.timers.b.lastStartTime, null);
});

test('recovery resumes an active game when both persisted timers are paused', () => {
  const storage = { getItem: () => JSON.stringify({ schemaVersion: 1, completedGames: [], activeGame: { ...createActiveGame(teams, { getRandomValues: (values) => { values[0] = 0; } }, 1000), timers: { a: { elapsedMs: 3500, lastStartTime: null }, b: { elapsedMs: 0, lastStartTime: null } } } }) };
  const { state } = readState(storage);

  assert.equal(state.activeGame.timers.a.elapsedMs, 3500);
  assert.notEqual(state.activeGame.timers.a.lastStartTime, null);
  assert.equal(state.activeGame.timers.b.lastStartTime, null);
});

test('formats elapsed time for short and long games', () => {
  assert.equal(formatElapsedTime(65000), '01:05');
  assert.equal(formatElapsedTime(0), '00:00');
  assert.equal(formatElapsedTime(3661000), '1:01:01');
});