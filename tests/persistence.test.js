const test = require('node:test');
const assert = require('node:assert/strict');
const { emptyState, readState, writeState, isValidState } = require('../app.js');

function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

test('persists and restores the local state envelope', () => {
  const fakeStorage = storage();
  const state = { ...emptyState(), completedGames: [{ id: '1' }] };
  assert.equal(writeState(state, fakeStorage).ok, true);
  assert.deepEqual(readState(fakeStorage).state, state);
});

test('rejects malformed saved state without inventing a result', () => {
  const fakeStorage = storage();
  fakeStorage.setItem('magic-circle-state-v1', JSON.stringify({ unexpected: true }));
  const restored = readState(fakeStorage);
  assert.deepEqual(restored.state, emptyState());
  assert.match(restored.warning, /invalid/);
  assert.equal(isValidState(restored.state), true);
});

test('reports storage failures without stopping play', () => {
  const failingStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); } };
  assert.match(readState(failingStorage).warning, /could not be read/);
  assert.equal(writeState(emptyState(), failingStorage).ok, false);
});

test('reset state can overwrite only the app storage record', () => {
  const fakeStorage = storage();
  const reset = { activeGame: null, completedGames: [], schemaVersion: 1 };
  assert.equal(writeState(reset, fakeStorage).ok, true);
  assert.deepEqual(readState(fakeStorage).state, reset);
});
