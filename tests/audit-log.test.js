const test = require('node:test');
const assert = require('node:assert/strict');
const { AUDIT_EVENTS, createActiveGame, adjustLife, advanceTurn } = require('../app.js');

const unevenTeams = [
  { id: 'a', members: ['Gabe', 'Phil'] },
  { id: 'b', members: ['Tung', 'Siu', 'Anthony'] }
];

test('smaller team starts and the start event documents the fairness decision', () => {
  const game = createActiveGame(unevenTeams, null, 1000);
  assert.equal(game.firstPlayerTeamId, 'a');
  assert.equal(game.firstPlayerSelectionMethod, 'team-size-fairness');
  assert.deepEqual(game.auditLog[0], {
    eventType: AUDIT_EVENTS.GAME_STARTED,
    timestamp: 1000,
    details: {
      teamA: { members: ['Gabe', 'Phil'] },
      teamB: { members: ['Tung', 'Siu', 'Anthony'] },
      firstPlayerTeamId: 'a',
      firstPlayerSelectionMethod: 'team-size-fairness'
    }
  });
});

test('life changes and turns are recorded in the audit log', () => {
  const game = advanceTurn(adjustLife(createActiveGame(unevenTeams, null, 1000), 'a', -1), 2000);
  assert.deepEqual(game.auditLog.map((event) => event.eventType), [AUDIT_EVENTS.GAME_STARTED, AUDIT_EVENTS.LIFE_ADJUSTED, AUDIT_EVENTS.TURN_ADVANCED]);
  assert.deepEqual(game.auditLog.at(-1), {
    eventType: AUDIT_EVENTS.TURN_ADVANCED,
    timestamp: 2000,
    details: { oldActiveTeamId: 'a', newActiveTeamId: 'b', oldTurnNumber: 1, newTurnNumber: 1 }
  });
});