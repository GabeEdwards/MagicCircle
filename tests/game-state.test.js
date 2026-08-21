const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTeams, sortedMembers, playerResults, defaultWinner, resetState, createActiveGame, adjustLife, advanceTurn } = require('../app.js');

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

test('sorts roster names and supports five-point life changes', () => {
  assert.deepEqual(sortedMembers(['Tung', 'Anthony', 'gabe']), ['Anthony', 'gabe', 'Tung']);
  const game = createActiveGame(teams, null);
  assert.equal(adjustLife(game, 'a', 5).lifeTotals.a, 45);
  assert.equal(adjustLife(game, 'b', -5).lifeTotals.b, 35);
});

test('derives alphabetized player results from completed games', () => {
  const games = [
    { teams, winnerTeamId: 'a' },
    { teams, winnerTeamId: 'b' }
  ];
  assert.deepEqual(playerResults(games), [
    { playerName: 'Gabe', gamesPlayed: 2, wins: 1, losses: 1, winPercentage: 50 },
    { playerName: 'Phil', gamesPlayed: 2, wins: 1, losses: 1, winPercentage: 50 },
    { playerName: 'Siu', gamesPlayed: 2, wins: 1, losses: 1, winPercentage: 50 },
    { playerName: 'Tung', gamesPlayed: 2, wins: 1, losses: 1, winPercentage: 50 }
  ]);
});

test('selects the higher-life team and leaves ties unselected', () => {
  assert.equal(defaultWinner({ a: 45, b: 40 }), 'a');
  assert.equal(defaultWinner({ a: -5, b: 2 }), 'b');
  assert.equal(defaultWinner({ a: 40, b: 40 }), '');
});

test('creates a clean session without changing the envelope shape', () => {
  assert.deepEqual(resetState(), { activeGame: null, completedGames: [], schemaVersion: 1 });
});
