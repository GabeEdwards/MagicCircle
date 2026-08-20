(function () {
  'use strict';

  const PLAYERS = ['Gabe', 'Phil', 'Tung', 'Siu', 'Anthony', 'Chris', 'Kate'];
  const STORAGE_KEY = 'magic-circle-state-v1';
  const TEAM_NAMES = { a: 'Team Blue', b: 'Team Green' };
  const TEAM_COLORS = { a: 'blue', b: 'green' };

  const emptyState = () => ({
    activeGame: null,
    completedGames: [],
    schemaVersion: 1
  });

  function teamNames(teams) {
    return teams.reduce((names, team) => ({ ...names, [team.id]: TEAM_NAMES[team.id] || team.id }), {});
  }

  function sortedMembers(members) {
    return [...members].sort((first, second) => first.localeCompare(second, undefined, { sensitivity: 'base' }));
  }

  function playerResults(completedGames) {
    const results = new Map();
    completedGames.forEach((game) => {
      game.teams.forEach((team) => {
        team.members.forEach((player) => {
          const result = results.get(player) || { playerName: player, gamesPlayed: 0, wins: 0, losses: 0, winPercentage: 0 };
          result.gamesPlayed += 1;
          if (team.id === game.winnerTeamId) result.wins += 1;
          else result.losses += 1;
          result.winPercentage = Number(((result.wins / result.gamesPlayed) * 100).toFixed(1));
          results.set(player, result);
        });
      });
    });
    return sortedMembers([...results.keys()]).map((player) => results.get(player));
  }

  function validateTeams(teams) {
    const errors = [];
    if (!Array.isArray(teams) || teams.length !== 2) return ['Exactly two teams are required.'];
    const seen = new Set();
    teams.forEach((team, index) => {
      const label = TEAM_NAMES[team.id] || `Team ${index + 1}`;
      if (!Array.isArray(team.members) || team.members.length < 2 || team.members.length > 4) {
        errors.push(`${label} needs 2 to 4 members.`);
      }
      const uniqueMembers = new Set(team.members || []);
      if (uniqueMembers.size !== (team.members || []).length) errors.push(`${label} cannot contain duplicate members.`);
      (team.members || []).forEach((member) => {
        if (!PLAYERS.includes(member)) errors.push(`${member} is not in the player pool.`);
        if (seen.has(member)) errors.push(`${member} cannot be assigned to both teams.`);
        seen.add(member);
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

  function createActiveGame(teams, randomSource) {
    const errors = validateTeams(teams);
    if (errors.length) throw new Error(errors.join(' '));
    const firstPlayer = chooseFirstTeam(randomSource);
    return {
      teams: teams.map((team) => ({ id: team.id, members: [...team.members] })),
      lifeTotals: { a: 40, b: 40 },
      turnNumber: 1,
      activeTeamId: firstPlayer.teamId,
      firstPlayerTeamId: firstPlayer.teamId,
      usedRandomFallback: firstPlayer.usedFallback,
      status: 'active'
    };
  }

  function adjustLife(game, teamId, delta) {
    if (!game || game.status !== 'active' || !['a', 'b'].includes(teamId) || ![1, -1, 5, -5].includes(delta)) return game;
    return { ...game, lifeTotals: { ...game.lifeTotals, [teamId]: game.lifeTotals[teamId] + delta } };
  }

  function advanceTurn(game) {
    if (!game || game.status !== 'active') return game;
    const nextTeam = game.activeTeamId === 'a' ? 'b' : 'a';
    return {
      ...game,
      activeTeamId: nextTeam,
      turnNumber: nextTeam === game.firstPlayerTeamId ? game.turnNumber + 1 : game.turnNumber
    };
  }

  function createCompletedGame(game, winnerTeamId, now = new Date()) {
    if (!game || game.status !== 'active' || !['a', 'b'].includes(winnerTeamId)) return null;
    return {
      id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      teams: game.teams.map((team) => ({ id: team.id, members: [...team.members] })),
      winnerTeamId,
      winningTurnNumber: game.turnNumber,
      finalLifeTotals: { ...game.lifeTotals },
      completedAt: now.toISOString()
    };
  }

  function isValidState(value) {
    return Boolean(value && value.schemaVersion === 1 && Array.isArray(value.completedGames) && (value.activeGame === null || (value.activeGame && value.activeGame.status === 'active')));
  }

  function readState(storage = globalThis.localStorage) {
    if (!storage) return { state: emptyState(), warning: 'Local storage is unavailable. History may not persist.' };
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return { state: emptyState(), warning: '' };
      const parsed = JSON.parse(raw);
      if (!isValidState(parsed)) return { state: emptyState(), warning: 'Saved data was invalid, so a fresh game history was started.' };
      return { state: parsed, warning: '' };
    } catch (error) {
      return { state: emptyState(), warning: 'Saved game data could not be read. Current play can continue, but history may not persist.' };
    }
  }

  function writeState(state, storage = globalThis.localStorage) {
    if (!storage) return { ok: false, warning: 'Local storage is unavailable. History may not persist.' };
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { ok: true, warning: '' };
    } catch (error) {
      return { ok: false, warning: 'This game is still usable, but the device could not save history.' };
    }
  }

  const api = { PLAYERS, TEAM_NAMES, TEAM_COLORS, validateTeams, sortedMembers, playerResults, chooseFirstTeam, createActiveGame, adjustLife, advanceTurn, createCompletedGame, emptyState, isValidState, readState, writeState };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.MTGTracker = api;
  if (typeof document === 'undefined') return;

  const elements = {
    modeLabel: document.querySelector('#mode-label'),
    status: document.querySelector('#status-message'),
    history: document.querySelector('#history-list'),
    playerResults: document.querySelector('#player-results'),
    setupErrors: document.querySelector('#setup-errors'),
    confirmSetup: document.querySelector('#confirm-setup-button'),
    gameTeams: document.querySelector('#game-teams'),
    turnNumber: document.querySelector('#turn-number'),
    activeTeamLabel: document.querySelector('#active-team-label'),
    winnerOptions: document.querySelector('#winner-options'),
    confirmEnd: document.querySelector('#confirm-end-button')
  };
  const views = {
    between: document.querySelector('#between-games-view'),
    setup: document.querySelector('#setup-view'),
    game: document.querySelector('#in-game-view'),
    end: document.querySelector('#end-game-view')
  };
  let stored = readState();
  let state = stored.state;
  let mode = state.activeGame ? 'game' : 'between';
  let setupTeams = [{ id: 'a', members: [] }, { id: 'b', members: [] }];
  let selectedWinner = '';

  function showStatus(message) {
    elements.status.textContent = message;
    elements.status.hidden = !message;
  }

  function persist() {
    const result = writeState(state);
    if (!result.ok) showStatus(result.warning);
  }

  function setMode(nextMode) {
    mode = nextMode;
    Object.entries(views).forEach(([name, view]) => { view.hidden = name !== nextMode; });
    elements.modeLabel.textContent = nextMode === 'between' ? 'Between games' : nextMode === 'setup' ? 'Team setup' : nextMode === 'end' ? 'Declare a winner' : 'In game';
    render();
  }

  function renderSetup() {
    setupTeams.forEach((team) => {
      const container = document.querySelector(`#team-${team.id}-players`);
      const count = document.querySelector(`#team-${team.id}-count`);
      count.textContent = `${team.members.length} / 2-4`;
      const opposingTeam = setupTeams.find((item) => item.id !== team.id);
      container.replaceChildren(...sortedMembers(PLAYERS).map((player) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'player-choice';
        const input = document.createElement('input');
        input.type = 'checkbox'; input.id = `team-${team.id}-${player}`; input.checked = team.members.includes(player); input.dataset.team = team.id; input.dataset.player = player;
        input.disabled = opposingTeam.members.includes(player);
        const label = document.createElement('label'); label.htmlFor = input.id; label.textContent = player;
        wrapper.append(input, label); return wrapper;
      }));
    });
    const errors = validateTeams(setupTeams);
    elements.setupErrors.textContent = errors.join(' ');
    elements.setupErrors.hidden = errors.length === 0;
    elements.confirmSetup.disabled = errors.length > 0;
  }

  function renderHistory() {
    if (!state.completedGames.length) {
      elements.history.replaceChildren(Object.assign(document.createElement('div'), { className: 'empty-state', textContent: 'No completed games yet. Set up the first match when your teams are ready.' }));
      elements.playerResults.replaceChildren(Object.assign(document.createElement('p'), { className: 'player-results-empty', textContent: 'No player results yet.' }));
      return;
    }
    elements.history.replaceChildren(...state.completedGames.map((result, index) => {
      const card = document.createElement('article'); card.className = 'history-card';
      const header = document.createElement('header');
      const title = document.createElement('h3'); title.textContent = `Game ${state.completedGames.length - index}`;
      const meta = document.createElement('span'); meta.className = 'history-meta'; meta.textContent = `Turn ${result.winningTurnNumber}`;
      header.append(title, meta);
      const teams = document.createElement('div'); teams.className = 'history-teams';
      result.teams.forEach((team) => {
        const item = document.createElement('div'); item.className = `history-team${team.id === result.winnerTeamId ? ' winner' : ''}`; item.dataset.team = team.id;
        const label = document.createElement('strong'); label.textContent = `${TEAM_NAMES[team.id]}${team.id === result.winnerTeamId ? ' · Winner' : ''}`;
        const members = document.createElement('span'); members.textContent = `${sortedMembers(team.members).join(', ')} · ${result.finalLifeTotals[team.id]} life`;
        item.append(label, members); teams.append(item);
      });
      card.append(header, teams); return card;
    }));
    const results = playerResults(state.completedGames);
    if (!results.length) {
      elements.playerResults.replaceChildren(Object.assign(document.createElement('p'), { className: 'player-results-empty', textContent: 'No player results yet.' }));
      return;
    }
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th scope="col">Player</th><th scope="col">Games</th><th scope="col">Wins</th><th scope="col">Losses</th><th scope="col">Win %</th></tr></thead>';
    const body = document.createElement('tbody');
    results.forEach((result) => {
      const row = document.createElement('tr');
      [result.playerName, result.gamesPlayed, result.wins, result.losses, `${result.winPercentage.toFixed(1)}%`].forEach((value) => {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      });
      body.append(row);
    });
    table.append(body); elements.playerResults.replaceChildren(table);
  }

  function renderGame() {
    const game = state.activeGame; if (!game) return;
    elements.turnNumber.textContent = game.turnNumber;
    elements.activeTeamLabel.textContent = `${TEAM_NAMES[game.activeTeamId]} is active${game.activeTeamId === game.firstPlayerTeamId ? ' · first player' : ''}`;
    elements.gameTeams.replaceChildren(...game.teams.map((team) => {
      const card = document.createElement('article'); card.className = 'game-team'; card.dataset.team = team.id;
      const label = document.createElement('div'); label.className = 'team-label';
      const title = document.createElement('div'); const heading = document.createElement('h3'); heading.textContent = TEAM_NAMES[team.id];
      const first = document.createElement('span'); first.className = 'first-player'; first.textContent = team.id === game.firstPlayerTeamId ? 'First player' : '';
      title.append(heading, first); label.append(title);
      card.dataset.active = String(team.id === game.activeTeamId); card.dataset.color = TEAM_COLORS[team.id];
      const members = document.createElement('ul'); members.className = 'members'; sortedMembers(team.members).forEach((member) => { const li = document.createElement('li'); li.textContent = member; members.append(li); });
      const life = document.createElement('div'); life.className = 'life-total'; life.textContent = game.lifeTotals[team.id]; life.setAttribute('aria-label', `${TEAM_NAMES[team.id]} life total ${game.lifeTotals[team.id]}`);
      const controls = document.createElement('div'); controls.className = 'life-controls';
      [-5, -1, 1, 5].forEach((delta) => { const button = document.createElement('button'); button.className = 'life-button'; button.type = 'button'; button.dataset.action = 'life'; button.dataset.team = team.id; button.dataset.delta = delta; button.textContent = `${delta > 0 ? '+' : '−'}${Math.abs(delta)}`; button.setAttribute('aria-label', `${delta > 0 ? 'Increase' : 'Decrease'} ${TEAM_NAMES[team.id]} life by ${Math.abs(delta)}`); controls.append(button); });
      card.append(label, members, life, controls); return card;
    }));
  }

  function renderEndGame() {
    const game = state.activeGame; if (!game) return;
    elements.winnerOptions.replaceChildren(...game.teams.map((team) => {
      const label = document.createElement('label'); label.className = `winner-option${selectedWinner === team.id ? ' selected' : ''}`;
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'winner'; input.value = team.id; input.checked = selectedWinner === team.id;
      const text = document.createElement('span'); text.textContent = `${TEAM_NAMES[team.id]} · ${game.lifeTotals[team.id]} life`;
      label.append(input, text); return label;
    }));
    elements.confirmEnd.disabled = !selectedWinner;
  }

  function render() {
    Object.entries(views).forEach(([name, view]) => { view.hidden = name !== mode; });
    elements.modeLabel.textContent = mode === 'between' ? 'Between games' : mode === 'setup' ? 'Team setup' : mode === 'end' ? 'Declare a winner' : 'In game';
    if (mode === 'between') renderHistory();
    if (mode === 'setup') renderSetup();
    if (mode === 'game') renderGame();
    if (mode === 'end') renderEndGame();
  }

  document.addEventListener('change', (event) => {
    if (event.target.matches('.player-choice input')) {
      const team = setupTeams.find((item) => item.id === event.target.dataset.team);
      if (event.target.checked) team.members.push(event.target.dataset.player);
      else team.members = team.members.filter((player) => player !== event.target.dataset.player);
      renderSetup();
    }
    if (event.target.matches('input[name="winner"]')) { selectedWinner = event.target.value; renderEndGame(); }
  });

  document.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (event.target.id === 'new-game-button' || event.target.id === 'abandon-game-button') {
      if (state.activeGame && !window.confirm('Abandon the active game and start a new one?')) return;
      setupTeams = [{ id: 'a', members: [] }, { id: 'b', members: [] }]; setMode('setup'); return;
    }
    if (event.target.id === 'cancel-setup-button') { setMode('between'); return; }
    if (event.target.id === 'confirm-setup-button') {
      try {
        state.activeGame = createActiveGame(setupTeams);
        persist();
        if (state.activeGame.usedRandomFallback) showStatus('Secure randomness was unavailable. A browser fallback selected the first player; this choice may be less fair.');
        else showStatus('');
        setMode('game');
      } catch (error) { elements.setupErrors.textContent = error.message; elements.setupErrors.hidden = false; }
      return;
    }
    if (action === 'life') { state.activeGame = adjustLife(state.activeGame, event.target.dataset.team, Number(event.target.dataset.delta)); persist(); renderGame(); return; }
    if (event.target.id === 'advance-turn-button') { state.activeGame = advanceTurn(state.activeGame); persist(); renderGame(); return; }
    if (event.target.id === 'end-game-button') { selectedWinner = ''; setMode('end'); return; }
    if (event.target.id === 'cancel-end-button') { selectedWinner = ''; setMode('game'); return; }
    if (event.target.id === 'confirm-end-button' && selectedWinner) {
      const result = createCompletedGame(state.activeGame, selectedWinner);
      state.completedGames = [result, ...state.completedGames]; state.activeGame = null; persist(); selectedWinner = ''; setMode('between');
    }
  });

  if (stored.warning) showStatus(stored.warning);
  render();
})();
