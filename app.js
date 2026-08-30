(function () {
  'use strict';

  const PLAYERS = ['Gabe', 'Phil', 'Tung', 'Siu', 'Anthony', 'Chris', 'Kate'];
  const STORAGE_KEY = 'magic-circle-state-v1';
  const SOUND_ENABLED_KEY = 'sound-enabled';
  const SORT_PREFERENCE_KEY = 'sort-preference';
  const TEAM_NAMES = { a: 'Team Blue', b: 'Team Green' };
  const TEAM_COLORS = { a: 'blue', b: 'green' };
  const AUDIT_EVENTS = { GAME_STARTED: 'GameStarted', LIFE_ADJUSTED: 'LifeAdjusted', TURN_ADVANCED: 'TurnAdvanced', UNDO_TURN: 'UndoTurn', GAME_ENDED: 'GameEnded' };

  // Active games retain enough state to recover undo, clocks, and the event trail after reload.
  const emptyState = () => ({ activeGame: null, completedGames: [], schemaVersion: 1 });
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const nowMs = () => Date.now();

  function sortedMembers(members) {
    return [...members].sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
  }

  function validateTeams(teams) {
    const errors = [];
    if (!Array.isArray(teams) || teams.length !== 2) return ['Exactly two teams are required.'];
    const assigned = new Set();
    teams.forEach((team, index) => {
      const label = TEAM_NAMES[team.id] || `Team ${index + 1}`;
      if (!Array.isArray(team.members) || team.members.length < 2 || team.members.length > 4) errors.push(`${label} needs 2 to 4 members.`);
      if (new Set(team.members || []).size !== (team.members || []).length) errors.push(`${label} cannot contain duplicate members.`);
      (team.members || []).forEach((player) => {
        if (!PLAYERS.includes(player)) errors.push(`${player} is not in the player pool.`);
        if (assigned.has(player)) errors.push(`${player} cannot be assigned to both teams.`);
        assigned.add(player);
      });
    });
    return errors;
  }

  function chooseFirstTeam(randomSource = globalThis.crypto) {
    if (randomSource && typeof randomSource.getRandomValues === 'function') {
      const value = new Uint32Array(1);
      randomSource.getRandomValues(value);
      return { teamId: value[0] % 2 === 0 ? 'a' : 'b', usedFallback: false };
    }
    return { teamId: Math.random() < 0.5 ? 'a' : 'b', usedFallback: true };
  }

  function selectFirstTeam(teams, randomSource) {
    const [first, second] = teams;
    if (first.members.length !== second.members.length) return { teamId: first.members.length < second.members.length ? first.id : second.id, usedFallback: false, method: 'team-size-fairness' };
    const selected = chooseFirstTeam(randomSource);
    return { ...selected, method: selected.usedFallback ? 'fallback-random' : 'random' };
  }

  function initializeTimers(activeTeamId, startedAt = nowMs()) {
    return { a: { elapsedMs: 0, lastStartTime: activeTeamId === 'a' ? startedAt : null }, b: { elapsedMs: 0, lastStartTime: activeTeamId === 'b' ? startedAt : null } };
  }

  function timerElapsed(timer, at = nowMs()) {
    return timer.elapsedMs + (timer.lastStartTime === null ? 0 : Math.max(0, at - timer.lastStartTime));
  }

  function pauseTimer(timer, at = nowMs()) { return { elapsedMs: timerElapsed(timer, at), lastStartTime: null }; }
  function resumeTimer(timer, at = nowMs()) { return timer.lastStartTime === null ? { ...timer, lastStartTime: at } : timer; }
  function freezeTimers(timers, at = nowMs()) { return { a: pauseTimer(timers.a, at), b: pauseTimer(timers.b, at) }; }
  function recordAuditEvent(auditLog, eventType, details = {}, at = nowMs()) {
    return [...auditLog, { eventType, timestamp: typeof at === 'number' ? at : at.getTime(), details: clone(details) }];
  }

  function createActiveGame(teams, randomSource, startedAt = nowMs()) {
    const errors = validateTeams(teams);
    if (errors.length) throw new Error(errors.join(' '));
    const firstPlayer = selectFirstTeam(teams, randomSource);
    const game = {
      teams: teams.map((team) => ({ id: team.id, members: [...team.members] })),
      lifeTotals: { a: 40, b: 40 }, turnNumber: 1, activeTeamId: firstPlayer.teamId, firstPlayerTeamId: firstPlayer.teamId,
      firstPlayerSelectionMethod: firstPlayer.method, usedRandomFallback: firstPlayer.usedFallback, undoHistory: [], timers: initializeTimers(firstPlayer.teamId, startedAt), auditLog: [], status: 'active'
    };
    game.auditLog = recordAuditEvent(game.auditLog, AUDIT_EVENTS.GAME_STARTED, {
      teamA: { members: [...game.teams.find((team) => team.id === 'a').members] },
      teamB: { members: [...game.teams.find((team) => team.id === 'b').members] },
      firstPlayerTeamId: game.firstPlayerTeamId,
      firstPlayerSelectionMethod: game.firstPlayerSelectionMethod
    }, startedAt);
    return game;
  }

  function captureUndoSnapshot(game, at = nowMs()) {
    return { turnNumber: game.turnNumber, activeTeamId: game.activeTeamId, lifeTotals: clone(game.lifeTotals), timers: freezeTimers(game.timers, at) };
  }

  function adjustLife(game, teamId, delta) {
    if (!game || game.status !== 'active' || !['a', 'b'].includes(teamId) || ![1, -1, 5, -5].includes(delta)) return game;
    const oldValue = game.lifeTotals[teamId];
    return { ...game, lifeTotals: { ...game.lifeTotals, [teamId]: oldValue + delta }, auditLog: recordAuditEvent(game.auditLog, AUDIT_EVENTS.LIFE_ADJUSTED, { teamId, delta, oldValue, newValue: oldValue + delta }) };
  }

  function advanceTurn(game, at = nowMs()) {
    if (!game || game.status !== 'active') return game;
    const previousTeamId = game.activeTeamId;
    const pausedTimers = freezeTimers(game.timers, at);
    const nextTeamId = previousTeamId === 'a' ? 'b' : 'a';
    const nextTurnNumber = nextTeamId === game.firstPlayerTeamId ? game.turnNumber + 1 : game.turnNumber;
    return {
      ...game, activeTeamId: nextTeamId, turnNumber: nextTurnNumber, timers: { ...pausedTimers, [nextTeamId]: resumeTimer(pausedTimers[nextTeamId], at) },
      undoHistory: [...game.undoHistory, captureUndoSnapshot(game, at)],
      auditLog: recordAuditEvent(game.auditLog, AUDIT_EVENTS.TURN_ADVANCED, { oldActiveTeamId: previousTeamId, newActiveTeamId: nextTeamId, oldTurnNumber: game.turnNumber, newTurnNumber: nextTurnNumber }, at)
    };
  }

  function undoTurn(game, at = nowMs()) {
    if (!game || game.status !== 'active' || !game.undoHistory.length) return game;
    const snapshot = game.undoHistory.at(-1);
    const restoredTimers = clone(snapshot.timers);
    restoredTimers[snapshot.activeTeamId] = resumeTimer(restoredTimers[snapshot.activeTeamId], at);
    return { ...game, turnNumber: snapshot.turnNumber, activeTeamId: snapshot.activeTeamId, lifeTotals: clone(snapshot.lifeTotals), timers: restoredTimers, undoHistory: game.undoHistory.slice(0, -1), auditLog: recordAuditEvent(game.auditLog, AUDIT_EVENTS.UNDO_TURN, { revertedTurnNumber: snapshot.turnNumber, restoredActiveTeamId: snapshot.activeTeamId, undoHistoryDepth: game.undoHistory.length - 1 }, at) };
  }

  function createCompletedGame(game, winnerTeamId, at = new Date()) {
    if (!game || game.status !== 'active' || !['a', 'b'].includes(winnerTeamId)) return null;
    const timers = freezeTimers(game.timers, at.getTime());
    return {
      id: `${at.getTime()}-${Math.random().toString(36).slice(2, 8)}`, teams: game.teams.map((team) => ({ id: team.id, members: [...team.members] })), winnerTeamId,
      winningTurnNumber: game.turnNumber, finalLifeTotals: clone(game.lifeTotals), teamTimers: { a: timers.a.elapsedMs, b: timers.b.elapsedMs },
      auditLog: recordAuditEvent(game.auditLog, AUDIT_EVENTS.GAME_ENDED, { winnerTeamId, winningTurnNumber: game.turnNumber, finalLifeTotals: clone(game.lifeTotals), teamAElapsedMs: timers.a.elapsedMs, teamBElapsedMs: timers.b.elapsedMs }, at), completedAt: at.toISOString()
    };
  }

  function playerResults(completedGames) {
    const results = new Map();
    completedGames.forEach((game) => game.teams.forEach((team) => team.members.forEach((player) => {
      const result = results.get(player) || { playerName: player, gamesPlayed: 0, wins: 0, losses: 0, winPercentage: 0 };
      result.gamesPlayed += 1;
      if (team.id === game.winnerTeamId) result.wins += 1; else result.losses += 1;
      result.winPercentage = Number(((result.wins / result.gamesPlayed) * 100).toFixed(1)); results.set(player, result);
    })));
    return sortedMembers([...results.keys()]).map((player) => results.get(player));
  }

  function defaultWinner(lifeTotals) {
    if (lifeTotals.a > lifeTotals.b) return 'a';
    if (lifeTotals.b > lifeTotals.a) return 'b';
    return '';
  }

  function resetState() {
    return emptyState();
  }

  function sortPlayerResults(results, field = 'playerName', direction = 'asc') {
    const multiplier = direction === 'desc' ? -1 : 1;
    return [...results].sort((left, right) => typeof left[field] === 'string' ? multiplier * left[field].localeCompare(right[field]) : multiplier * (left[field] - right[field]));
  }

  function formatElapsedTime(milliseconds) {
    const seconds = Math.floor(Math.max(0, milliseconds) / 1000); const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60); const remainingSeconds = seconds % 60;
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  function csvCell(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
  function generateCSV(completedGames) {
    const header = ['Date', 'Team A Members', 'Team B Members', 'Winner', 'Final Turn', 'Team A Final Life', 'Team B Final Life', 'Team A Elapsed Time', 'Team B Elapsed Time'];
    const rows = [...completedGames].sort((left, right) => right.completedAt.localeCompare(left.completedAt)).map((game) => {
      const team = (id) => game.teams.find((entry) => entry.id === id);
      return [game.completedAt, team('a').members.join(', '), team('b').members.join(', '), TEAM_NAMES[game.winnerTeamId], game.winningTurnNumber, game.finalLifeTotals.a, game.finalLifeTotals.b, formatElapsedTime(game.teamTimers?.a || 0), formatElapsedTime(game.teamTimers?.b || 0)].map(csvCell).join(',');
    });
    return [header.map(csvCell).join(','), ...rows].join('\n');
  }

  function getPreference(key, defaultValue, storage = globalThis.localStorage) { try { const value = storage?.getItem(key); return value === null || value === undefined ? defaultValue : JSON.parse(value); } catch { return defaultValue; } }
  function setPreference(key, value, storage = globalThis.localStorage) { try { storage?.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
  function validateGameState(game) { const errors = []; if (!game) return { valid: true, errors }; if (!Array.isArray(game.undoHistory)) errors.push('undoHistory must be an array'); if (!Array.isArray(game.auditLog)) errors.push('auditLog must be an array'); if (!game.timers?.a || !game.timers?.b) errors.push('timers must include both teams'); return { valid: !errors.length, errors }; }
  function isValidState(value) { return Boolean(value && value.schemaVersion === 1 && Array.isArray(value.completedGames) && (value.activeGame === null || value.activeGame?.status === 'active')); }
  // Legacy and interrupted saves can have no running clock; resume the recorded active team.
  function hydrateActiveGame(game) { if (!game) return game; const activeTeamId = game.activeTeamId || game.firstPlayerTeamId || 'a'; const timers = game.timers || initializeTimers(activeTeamId); const hasRunningTimer = timers.a?.lastStartTime !== null || timers.b?.lastStartTime !== null; return { ...game, undoHistory: Array.isArray(game.undoHistory) ? game.undoHistory : [], auditLog: Array.isArray(game.auditLog) ? game.auditLog : [], timers: hasRunningTimer ? timers : { ...timers, [activeTeamId]: resumeTimer(timers[activeTeamId]) }, firstPlayerSelectionMethod: game.firstPlayerSelectionMethod || 'random' }; }
  function readState(storage = globalThis.localStorage) { if (!storage) return { state: emptyState(), warning: 'Local storage is unavailable. History may not persist.' }; try { const raw = storage.getItem(STORAGE_KEY); if (!raw) return { state: emptyState(), warning: '' }; const state = JSON.parse(raw); return isValidState(state) ? { state: { ...state, activeGame: hydrateActiveGame(state.activeGame) }, warning: '' } : { state: emptyState(), warning: 'Saved data was invalid, so a fresh game history was started.' }; } catch { return { state: emptyState(), warning: 'Saved game data could not be read. Current play can continue, but history may not persist.' }; } }
  function writeState(state, storage = globalThis.localStorage) { if (!storage) return { ok: false, warning: 'Local storage is unavailable. History may not persist.' }; try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return { ok: true, warning: '' }; } catch { return { ok: false, warning: 'This game is still usable, but the device could not save history.' }; } }

  function downloadCSV(completedGames) {
    const blob = new Blob([generateCSV(completedGames)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magic-circle-games-${new Date().toISOString().slice(0, 10)}.csv`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function playTurnAdvanceSound() {
    if (!getPreference(SOUND_ENABLED_KEY, true)) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 440;
    gain.gain.setValueAtTime(.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .1);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + .1);
  }

  function formatAuditEvent(event) {
    const legacyEvent = event.details ? event : { eventType: event.type, timestamp: event.timestamp, details: event };
    const { eventType, details } = legacyEvent;
    const time = new Date(legacyEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (eventType === AUDIT_EVENTS.LIFE_ADJUSTED) return `${time}: ${TEAM_NAMES[details.teamId]} life ${details.delta > 0 ? '+' : ''}${details.delta} (${details.oldValue} to ${details.newValue})`;
    if (eventType === AUDIT_EVENTS.TURN_ADVANCED) return `${time}: Turn advanced to ${TEAM_NAMES[details.newActiveTeamId]}`;
    if (eventType === AUDIT_EVENTS.UNDO_TURN) return `${time}: Restored turn ${details.revertedTurnNumber}`;
    if (eventType === AUDIT_EVENTS.GAME_ENDED) return `${time}: ${TEAM_NAMES[details.winnerTeamId]} won`;
    return `${time}: Game started (${details.firstPlayerSelectionMethod})`;
  }

  const api = { PLAYERS, TEAM_NAMES, TEAM_COLORS, AUDIT_EVENTS, validateTeams, sortedMembers, defaultWinner, resetState, chooseFirstTeam, createActiveGame, adjustLife, advanceTurn, undoTurn, createCompletedGame, playerResults, sortPlayerResults, initializeTimers, pauseTimer, resumeTimer, timerElapsed, formatElapsedTime, recordAuditEvent, generateCSV, getPreference, setPreference, validateGameState, emptyState, isValidState, readState, writeState };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MTGTracker = api;
  if (typeof document === 'undefined') return;

  const elements = { modeLabel: document.querySelector('#mode-label'), status: document.querySelector('#status-message'), history: document.querySelector('#history-list'), playerResults: document.querySelector('#player-results'), setupErrors: document.querySelector('#setup-errors'), confirmSetup: document.querySelector('#confirm-setup-button'), gameTeams: document.querySelector('#game-teams'), turnNumber: document.querySelector('#turn-number'), activeTeamLabel: document.querySelector('#active-team-label'), firstPlayerMethod: document.querySelector('#first-player-method'), winnerOptions: document.querySelector('#winner-options'), confirmEnd: document.querySelector('#confirm-end-button'), undoTurn: document.querySelector('#undo-turn-button'), soundEnabled: document.querySelector('#sound-enabled'), sortResults: document.querySelector('#sort-results'), auditLogButton: document.querySelector('#audit-log-button'), auditLogPanel: document.querySelector('#audit-log-panel'), auditLogList: document.querySelector('#audit-log-list') };
  const views = { between: document.querySelector('#between-games-view'), setup: document.querySelector('#setup-view'), game: document.querySelector('#in-game-view'), end: document.querySelector('#end-game-view') };
  let stored = readState(); let state = stored.state; let mode = state.activeGame ? 'game' : 'between'; let setupTeams = [{ id: 'a', members: [] }, { id: 'b', members: [] }]; let selectedWinner = ''; let auditVisible = false;
  function showStatus(message) { elements.status.textContent = message; elements.status.hidden = !message; }
  function persist() { const result = writeState(state); if (!result.ok) showStatus(result.warning); }
  function setMode(nextMode) { mode = nextMode; render(); }
  function renderSetup() { setupTeams.forEach((team) => { const container = document.querySelector(`#team-${team.id}-players`); document.querySelector(`#team-${team.id}-count`).textContent = `${team.members.length} / 2-4`; const opposingTeam = setupTeams.find((entry) => entry.id !== team.id); container.replaceChildren(...sortedMembers(PLAYERS).map((player) => { const wrapper = document.createElement('div'); wrapper.className = 'player-choice'; const input = document.createElement('input'); input.type = 'checkbox'; input.id = `team-${team.id}-${player}`; input.checked = team.members.includes(player); input.dataset.team = team.id; input.dataset.player = player; input.disabled = opposingTeam.members.includes(player); const label = document.createElement('label'); label.htmlFor = input.id; label.textContent = player; wrapper.append(input, label); return wrapper; })); }); const errors = validateTeams(setupTeams); elements.setupErrors.textContent = errors.join(' '); elements.setupErrors.hidden = !errors.length; elements.confirmSetup.disabled = Boolean(errors.length); }
  function renderHistory() { if (!state.completedGames.length) { elements.history.replaceChildren(Object.assign(document.createElement('div'), { className: 'empty-state', textContent: 'No completed games yet. Set up the first match when your teams are ready.' })); elements.playerResults.replaceChildren(Object.assign(document.createElement('p'), { className: 'player-results-empty', textContent: 'No player results yet.' })); return; } elements.history.replaceChildren(...state.completedGames.map((result, index) => { const card = document.createElement('article'); card.className = 'history-card'; const header = document.createElement('header'); header.innerHTML = `<h3>Game ${state.completedGames.length - index}</h3><span class="history-meta">Turn ${result.winningTurnNumber}</span>`; const teams = document.createElement('div'); teams.className = 'history-teams'; result.teams.forEach((team) => { const item = document.createElement('div'); item.className = `history-team${team.id === result.winnerTeamId ? ' winner' : ''}`; item.dataset.team = team.id; const elapsed = formatElapsedTime(result.teamTimers?.[team.id] || 0); item.innerHTML = `<strong>${TEAM_NAMES[team.id]}${team.id === result.winnerTeamId ? ' · Winner' : ''}</strong><span>${sortedMembers(team.members).join(', ')} · ${result.finalLifeTotals[team.id]} life · ${elapsed}</span>`; teams.append(item); }); card.append(header, teams); return card; })); const results = playerResults(state.completedGames); const table = document.createElement('table'); table.innerHTML = '<thead><tr><th>Player</th><th>Games</th><th>Wins</th><th>Losses</th><th>Win %</th></tr></thead>'; const body = document.createElement('tbody'); results.forEach((result) => { const row = document.createElement('tr'); [result.playerName, result.gamesPlayed, result.wins, result.losses, `${result.winPercentage.toFixed(1)}%`].forEach((value) => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }); body.append(row); }); table.append(body); elements.playerResults.replaceChildren(table); }
  function renderGame() { const game = state.activeGame; if (!game) return; elements.turnNumber.textContent = game.turnNumber; elements.activeTeamLabel.textContent = `${TEAM_NAMES[game.activeTeamId]} is active${game.activeTeamId === game.firstPlayerTeamId ? ' · first player' : ''}`; if (elements.firstPlayerMethod) elements.firstPlayerMethod.textContent = game.firstPlayerSelectionMethod === 'team-size-fairness' ? 'Fair start: smaller team' : ''; const orderedTeams = [...game.teams].sort((left, right) => (left.id === game.firstPlayerTeamId ? -1 : 1) - (right.id === game.firstPlayerTeamId ? -1 : 1)); elements.gameTeams.replaceChildren(...orderedTeams.map((team) => { const card = document.createElement('article'); card.className = 'game-team'; card.dataset.team = team.id; card.dataset.active = String(team.id === game.activeTeamId); const label = document.createElement('div'); label.className = 'team-label'; label.innerHTML = `<div><h3>${TEAM_NAMES[team.id]}</h3><span class="first-player">${team.id === game.firstPlayerTeamId ? 'First player' : ''}</span></div>`; const members = document.createElement('ul'); members.className = 'members'; sortedMembers(team.members).forEach((member) => { const item = document.createElement('li'); item.textContent = member; members.append(item); }); const life = document.createElement('div'); life.className = 'life-total'; life.textContent = game.lifeTotals[team.id]; const controls = document.createElement('div'); controls.className = 'life-controls'; [-5, -1, 1, 5].forEach((delta) => { const button = document.createElement('button'); button.className = 'life-button'; button.type = 'button'; button.dataset.action = 'life'; button.dataset.team = team.id; button.dataset.delta = delta; button.textContent = `${delta > 0 ? '+' : '-'}${Math.abs(delta)}`; controls.append(button); }); card.append(label, members, life, controls); return card; })); }
  function renderEndGame() { const game = state.activeGame; if (!game) return; elements.winnerOptions.replaceChildren(...game.teams.map((team) => { const label = document.createElement('label'); label.className = `winner-option${selectedWinner === team.id ? ' selected' : ''}`; label.innerHTML = `<input type="radio" name="winner" value="${team.id}" ${selectedWinner === team.id ? 'checked' : ''}><span>${TEAM_NAMES[team.id]} · ${game.lifeTotals[team.id]} life</span>`; return label; })); elements.confirmEnd.disabled = !selectedWinner; }
  function render() { Object.entries(views).forEach(([name, view]) => { view.hidden = name !== mode; }); elements.modeLabel.textContent = mode === 'between' ? 'Between games' : mode === 'setup' ? 'Team setup' : mode === 'end' ? 'Declare a winner' : 'In game'; if (mode === 'between') renderHistory(); else if (mode === 'setup') renderSetup(); else if (mode === 'game') renderGame(); else renderEndGame(); }
  document.addEventListener('change', (event) => { if (event.target.matches('.player-choice input')) { const team = setupTeams.find((entry) => entry.id === event.target.dataset.team); team.members = event.target.checked ? [...team.members, event.target.dataset.player] : team.members.filter((player) => player !== event.target.dataset.player); renderSetup(); } if (event.target.matches('input[name="winner"]')) { selectedWinner = event.target.value; renderEndGame(); } });
  document.addEventListener('click', (event) => { const action = event.target.dataset.action; if (event.target.id === 'new-session-button') { const hasData = Boolean(state.activeGame || state.completedGames.length); const message = 'Start a new session? This will erase the active game, completed game history, and player results.'; if (hasData && !window.confirm(message)) return; state = resetState(); setupTeams = [{ id: 'a', members: [] }, { id: 'b', members: [] }]; selectedWinner = ''; persist(); showStatus(''); setMode('between'); return; } if (event.target.id === 'new-game-button' || event.target.id === 'abandon-game-button') { if (state.activeGame && !window.confirm('Abandon the active game and start a new one?')) return; setupTeams = [{ id: 'a', members: [] }, { id: 'b', members: [] }]; setMode('setup'); return; } if (event.target.id === 'cancel-setup-button') { setMode('between'); return; } if (event.target.id === 'confirm-setup-button') { try { state.activeGame = createActiveGame(setupTeams); persist(); if (state.activeGame.usedRandomFallback) showStatus('Secure randomness was unavailable. A browser fallback selected the first player; this choice may be less fair.'); else showStatus(''); setMode('game'); } catch (error) { elements.setupErrors.textContent = error.message; elements.setupErrors.hidden = false; } return; } if (action === 'life') { state.activeGame = adjustLife(state.activeGame, event.target.dataset.team, Number(event.target.dataset.delta)); persist(); renderGame(); return; } if (event.target.id === 'advance-turn-button') { state.activeGame = advanceTurn(state.activeGame); persist(); renderGame(); return; } if (event.target.id === 'end-game-button') { selectedWinner = defaultWinner(state.activeGame.lifeTotals); setMode('end'); return; } if (event.target.id === 'cancel-end-button') { selectedWinner = ''; setMode('game'); return; } if (event.target.id === 'confirm-end-button' && selectedWinner) { state.completedGames = [createCompletedGame(state.activeGame, selectedWinner), ...state.completedGames]; state.activeGame = null; persist(); selectedWinner = ''; setMode('between'); } });

  function renderEnhancedControls() {
    const game = state.activeGame;
    if (!game) return;
    elements.undoTurn.disabled = game.undoHistory.length === 0;
    elements.soundEnabled.checked = getPreference(SOUND_ENABLED_KEY, true);
    elements.auditLogPanel.hidden = !auditVisible;
    elements.auditLogButton.setAttribute('aria-expanded', String(auditVisible));
    elements.auditLogList.replaceChildren(...game.auditLog.map((event) => Object.assign(document.createElement('li'), { textContent: formatAuditEvent(event) })));
    document.querySelectorAll('.game-team').forEach((card) => {
      let timer = card.querySelector('.team-timer');
      if (!timer) { timer = document.createElement('p'); timer.className = 'team-timer'; card.querySelector('.team-label').after(timer); }
      const timerState = game.timers[card.dataset.team].lastStartTime === null ? 'Paused' : 'Active';
      timer.textContent = `${formatElapsedTime(timerElapsed(game.timers[card.dataset.team]))} ${timerState}`;
    });
  }

  function renderSortedResults() {
    const [field, direction] = elements.sortResults.value.split(':');
    const results = sortPlayerResults(playerResults(state.completedGames), field, direction);
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>Player</th><th>Games</th><th>Wins</th><th>Losses</th><th>Win %</th></tr></thead>';
    const body = document.createElement('tbody');
    results.forEach((result) => { const row = document.createElement('tr'); [result.playerName, result.gamesPlayed, result.wins, result.losses, `${result.winPercentage.toFixed(1)}%`].forEach((value) => { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); }); body.append(row); });
    table.append(body); elements.playerResults.replaceChildren(table);
  }

  document.addEventListener('click', (event) => {
    if (event.target.id === 'advance-turn-button') playTurnAdvanceSound();
    if (event.target.id === 'undo-turn-button') { state.activeGame = undoTurn(state.activeGame); persist(); renderGame(); renderEnhancedControls(); }
    if (event.target.id === 'audit-log-button' || event.target.id === 'close-audit-log-button') { auditVisible = event.target.id === 'audit-log-button' ? !auditVisible : false; renderEnhancedControls(); }
    if (event.target.id === 'export-csv-button') { if (state.completedGames.length) downloadCSV(state.completedGames); else showStatus('There are no completed games to export.'); }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.matches('.life-button')) return;
    event.target.classList.remove('feedback');
    void event.target.offsetWidth;
    event.target.classList.add('feedback');
  }, true);
  elements.soundEnabled.addEventListener('change', () => setPreference(SOUND_ENABLED_KEY, elements.soundEnabled.checked));
  elements.sortResults.value = getPreference(SORT_PREFERENCE_KEY, 'playerName:asc');
  elements.sortResults.addEventListener('change', () => { setPreference(SORT_PREFERENCE_KEY, elements.sortResults.value); renderSortedResults(); });
  function tick() { if (mode === 'game') renderEnhancedControls(); requestAnimationFrame(tick); }
  if (stored.warning) showStatus(stored.warning); render();
  if (mode === 'between' && state.completedGames.length) renderSortedResults();
  if (mode === 'game') renderEnhancedControls();
  requestAnimationFrame(tick);
})();