const test = require('node:test');
const assert = require('node:assert/strict');
const { editCompletedGame, parseTimeString, formatElapsedTime, playerResults } = require('../app.js');

test('editCompletedGame updates winner, life totals, and timers', () => {
  const originalGame = {
    id: 'game-1',
    completedAt: '2026-10-12T12:00:00.000Z',
    teams: [
      { id: 'a', members: ['Alice', 'Bob'] },
      { id: 'b', members: ['Charlie', 'Dana'] }
    ],
    winnerTeamId: 'a',
    winningTurnNumber: 5,
    finalLifeTotals: { a: 20, b: 0 },
    teamTimers: { a: 120000, b: 150000 },
    auditLog: []
  };

  const updates = {
    winnerTeamId: 'b',
    finalLifeTotals: { a: 15, b: 5 },
    teamTimers: { a: 130000, b: 140000 }
  };

  const updatedGame = editCompletedGame(originalGame, updates);
  assert.equal(updatedGame.winnerTeamId, 'b');
  assert.deepEqual(updatedGame.finalLifeTotals, { a: 15, b: 5 });
  assert.deepEqual(updatedGame.teamTimers, { a: 130000, b: 140000 });
  assert.equal(updatedGame.id, originalGame.id);
  assert.equal(updatedGame.completedAt, originalGame.completedAt);
});

test('editCompletedGame validates inputs and rejects invalid values', () => {
  const originalGame = {
    id: 'game-1',
    teams: [{ id: 'a', members: ['Alice'] }, { id: 'b', members: ['Bob'] }],
    winnerTeamId: 'a',
    finalLifeTotals: { a: 20, b: 0 },
    teamTimers: { a: 60000, b: 60000 }
  };

  assert.throws(() => editCompletedGame(originalGame, { winnerTeamId: 'c' }), /winner/i);
  assert.throws(() => editCompletedGame(originalGame, { finalLifeTotals: { a: 'invalid', b: 10 } }), /life/i);
  assert.throws(() => editCompletedGame(originalGame, { teamTimers: { a: -500, b: 1000 } }), /timer/i);
});

test('parseTimeString correctly parses MM:SS and HH:MM:SS to milliseconds', () => {
  assert.equal(parseTimeString('02:30'), 150000);
  assert.equal(parseTimeString('1:02:30'), 3750000);
  assert.equal(parseTimeString('0:00'), 0);
  assert.equal(parseTimeString('45'), 45000);
  assert.equal(parseTimeString('invalid'), null);
});

test('recalculates player stats correctly when game winner is changed via edit', () => {
  const games = [
    {
      id: 'game-1',
      teams: [
        { id: 'a', members: ['Alice'] },
        { id: 'b', members: ['Bob'] }
      ],
      winnerTeamId: 'a',
      finalLifeTotals: { a: 20, b: 0 },
      teamTimers: { a: 60000, b: 60000 }
    }
  ];

  let stats = playerResults(games);
  assert.equal(stats.find((p) => p.playerName === 'Alice').wins, 1);
  assert.equal(stats.find((p) => p.playerName === 'Bob').wins, 0);

  games[0] = editCompletedGame(games[0], { winnerTeamId: 'b' });
  stats = playerResults(games);
  assert.equal(stats.find((p) => p.playerName === 'Alice').wins, 0);
  assert.equal(stats.find((p) => p.playerName === 'Bob').wins, 1);
});
