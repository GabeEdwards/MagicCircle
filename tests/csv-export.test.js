const test = require('node:test');
const assert = require('node:assert/strict');
const { generateCSV } = require('../app.js');

test('generates quoted CSV rows in newest-first order', () => {
  const csv = generateCSV([
    { completedAt: '2026-08-29T12:00:00.000Z', teams: [{ id: 'a', members: ['Gabe'] }, { id: 'b', members: ['Phil'] }], winnerTeamId: 'a', winningTurnNumber: 3, finalLifeTotals: { a: 12, b: 0 }, teamTimers: { a: 1000, b: 2000 } },
    { completedAt: '2026-08-30T12:00:00.000Z', teams: [{ id: 'a', members: ['A "Mage"'] }, { id: 'b', members: ['Tung'] }], winnerTeamId: 'b', winningTurnNumber: 4, finalLifeTotals: { a: 0, b: 8 }, teamTimers: { a: 61000, b: 0 } }
  ]);
  const lines = csv.split('\n');
  assert.equal(lines.length, 3);
  assert.match(lines[1], /A ""Mage""/);
  assert.match(lines[1], /"01:01"/);
  assert.match(lines[2], /2026-08-29/);
});