const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTeams, createActiveGame, adjustLife, advanceTurn } = require('../app.js');

const teams = [
  { id: 'a', members: ['Gabe', 'Phil'] },
  { id: 'b', members: ['Tung', 'Siu'] }
];

test('validates team size and duplicate players', () => {
  assert.equal(validateTeams(teams).length, 0);
  assert.match(validateTeams([{ id: 'a', members: ['Gabe'] }, { id: 'b', members: ['Gabe', 'Phil'] }]).join(' '), /2 to 4|both teams/);
});

test('creates a 40-life active game and supports unbounded life totals', () => {
  const game = createActiveGame(teams, null);
  assert.deepEqual(game.lifeTotals, { a: 40, b: 40 });
  assert.equal(adjustLife(adjustLife(game, 'a', -1), 'a', -1).lifeTotals.a, 38);
  assert.equal(adjustLife(game, 'b', 1).lifeTotals.b, 41);
});

test('turns share a number across both teams', () => {
  const game = { ...createActiveGame(teams, null), firstPlayerTeamId: 'a', activeTeamId: 'a', turnNumber: 1 };
  const teamBTurn1 = advanceTurn(game);
  assert.deepEqual({ active: teamBTurn1.activeTeamId, turn: teamBTurn1.turnNumber }, { active: 'b', turn: 1 });
  const teamATurn2 = advanceTurn(teamBTurn1);
  assert.deepEqual({ active: teamATurn2.activeTeamId, turn: teamATurn2.turnNumber }, { active: 'a', turn: 2 });
});

test('uses fallback randomness when secure randomness is unavailable', () => {
  const game = createActiveGame(teams, null);
  assert.equal(typeof game.firstPlayerTeamId, 'string');
  assert.equal(game.usedRandomFallback, true);
});
