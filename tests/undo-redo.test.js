const test = require('node:test');
const assert = require('node:assert/strict');
const { createActiveGame, adjustLife, advanceTurn, undoTurn } = require('../app.js');

const teams = [
  { id: 'a', members: ['Gabe', 'Phil'] },
  { id: 'b', members: ['Tung', 'Siu'] }
];

test('undo restores the state present before a turn advance', () => {
  let game = createActiveGame(teams, { getRandomValues: (values) => { values[0] = 0; } }, 1000);
  game = adjustLife(game, 'a', -5);
  game = advanceTurn(game, 2500);
  const restored = undoTurn(game);

  assert.equal(restored.turnNumber, 1);
  assert.equal(restored.activeTeamId, 'a');
  assert.equal(restored.lifeTotals.a, 35);
  assert.equal(restored.undoHistory.length, 0);
});

test('undo is a no-op with no turn history', () => {
  const game = createActiveGame(teams, null, 1000);
  assert.strictEqual(undoTurn(game), game);
});