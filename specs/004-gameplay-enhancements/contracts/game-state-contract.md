# Contract: Game State Schema

**Feature**: [spec.md](../spec.md) | **Version**: 1.0 | **Date**: 2026-08-30

This contract defines the schema for the extended Active Game and Completed Game state structures, including new fields for undo history, team timers, and audit logging.

---

## Active Game State Schema (Serialized)

### JSON Structure

```json
{
  "teams": [
    {
      "id": "a",
      "members": ["Gabe", "Phil"]
    },
    {
      "id": "b",
      "members": ["Tung", "Siu"]
    }
  ],
  "lifeTotals": {
    "a": 42,
    "b": -3
  },
  "turnNumber": 5,
  "activeTeamId": "b",
  "firstPlayerTeamId": "a",
  "firstPlayerSelectionMethod": "team-size-fairness",
  "usedRandomFallback": false,
  "status": "active",
  "undoHistory": [
    {
      "turnNumber": 4,
      "activeTeamId": "a",
      "lifeTotals": { "a": 40, "b": -3 },
      "timers": {
        "a": { "elapsedMs": 200000, "lastStartTime": null },
        "b": { "elapsedMs": 150000, "lastStartTime": 1693398225000 }
      }
    }
  ],
  "timers": {
    "a": { "elapsedMs": 225000, "lastStartTime": null },
    "b": { "elapsedMs": 150000, "lastStartTime": 1693398235000 }
  },
  "auditLog": [
    {
      "eventType": "GameStarted",
      "timestamp": 1693398000000,
      "details": {
        "teamA": { "members": ["Gabe", "Phil"] },
        "teamB": { "members": ["Tung", "Siu"] },
        "firstPlayerTeamId": "a",
        "firstPlayerSelectionMethod": "team-size-fairness"
      }
    }
  ]
}
```

### Field Specifications

#### `teams` (required, array of 2)
- **Type**: Array with exactly 2 Team objects
- **Constraint**: Each team has `id` (string: "a" or "b") and `members` (array of 2-4 player names)
- **Validation**: No duplicate player names across teams

#### `lifeTotals` (required, object)
- **Type**: Object with keys "a" and "b", each mapping to an integer
- **Range**: Unbounded (may be negative or exceed 40)
- **Constraint**: Must have entries for both team IDs

#### `turnNumber` (required, integer)
- **Type**: Positive integer ≥ 1
- **Constraint**: Starts at 1, increments only when first-player team resumes active status

#### `activeTeamId` (required, string)
- **Type**: String, one of "a" or "b"
- **Constraint**: Must reference one of the two teams in the game

#### `firstPlayerTeamId` (required, string)
- **Type**: String, one of "a" or "b"
- **Constraint**: Immutable after game start; selected by team size or random choice
- **Selection Logic**:
  - If team member counts differ: Smaller team selected
  - If team member counts equal: Random selection with equal probability

#### `firstPlayerSelectionMethod` (required, string)
- **Type**: Enum: `"random"`, `"team-size-fairness"`, `"fallback-random"`
- **Values**:
  - `"random"`: Teams have equal size; random selection used
  - `"team-size-fairness"`: Teams have unequal size; smaller team automatically selected
  - `"fallback-random"`: Secure random unavailable; weaker random fallback used
- **Constraint**: Immutable after game start

#### `usedRandomFallback` (required, boolean)
- **Type**: Boolean
- **Values**: `true` if secure randomness unavailable, `false` otherwise
- **Constraint**: Immutable after game start

#### `status` (required, string)
- **Type**: Fixed string
- **Values**: `"active"` (game in progress)
- **Constraint**: Must be "active" for Active Game records

#### `undoHistory` (required, array)
- **Type**: Array of state snapshots
- **Structure**: Each element is a complete game state from a prior turn:
  ```json
  {
    "turnNumber": <integer>,
    "activeTeamId": <"a" or "b">,
    "lifeTotals": { "a": <integer>, "b": <integer> },
    "timers": {
      "a": { "elapsedMs": <integer>, "lastStartTime": <integer or null> },
      "b": { "elapsedMs": <integer>, "lastStartTime": <integer or null> }
    }
  }
  ```
- **Constraint**: Empty array at game start; grows with each turn advance
- **Max length**: Implementation may enforce a maximum depth (e.g., last 100 turns)

#### `timers` (required, object)
- **Type**: Object with keys "a" and "b"
- **Structure**: Each value is a Timer State object:
  ```json
  {
    "elapsedMs": <non-negative integer>,
    "lastStartTime": <epoch milliseconds (integer) or null>
  }
  ```
- **Semantics**:
  - `elapsedMs`: Cumulative milliseconds accumulated while this team was active
  - `lastStartTime`: Epoch timestamp (via `performance.now()`) when the timer was resumed; null when paused
- **Constraint**: Both timers must be present; one actively running, one paused

#### `auditLog` (required, array)
- **Type**: Array of Audit Log Event objects
- **Structure**: See Audit Log Contract (separate document)
- **Constraint**: Empty array at game start; grows chronologically

---

## Completed Game State Schema (Serialized)

### JSON Structure

```json
{
  "id": "20260830-152345-abc123",
  "teams": [
    {
      "id": "a",
      "members": ["Gabe", "Phil"]
    },
    {
      "id": "b",
      "members": ["Tung", "Siu"]
    }
  ],
  "winnerTeamId": "a",
  "winningTurnNumber": 5,
  "finalLifeTotals": {
    "a": 42,
    "b": -3
  },
  "completedAt": "2026-08-30T15:23:45Z",
  "teamTimers": {
    "a": 225000,
    "b": 150000
  },
  "auditLog": [
    {
      "eventType": "GameStarted",
      "timestamp": 1693398000000,
      "details": { ... }
    }
  ]
}
```

### Field Specifications

#### `id` (required, string)
- **Type**: Unique string identifier
- **Format**: Recommended: ISO timestamp + random suffix (e.g., `"20260830-152345-abc123"`)
- **Constraint**: Must be unique within the completed games list

#### `teams` (required, array of 2)
- **Type**: Array with exactly 2 Team objects (snapshot from active game)
- **Constraint**: Same as Active Game; frozen snapshot at game completion

#### `winnerTeamId` (required, string)
- **Type**: String, one of "a" or "b"
- **Constraint**: Must reference one of the two saved teams

#### `winningTurnNumber` (required, integer)
- **Type**: Positive integer ≥ 1
- **Constraint**: The turn number at which the winner was declared

#### `finalLifeTotals` (required, object)
- **Type**: Object with keys "a" and "b", each mapping to an integer
- **Constraint**: Snapshot of life totals at game end (may be negative or > 40)

#### `completedAt` (required, string)
- **Type**: ISO 8601 timestamp string
- **Format**: `"YYYY-MM-DDTHH:mm:ssZ"` (UTC with Z suffix)
- **Constraint**: Used for sorting and display

#### `teamTimers` (required, object)
- **Type**: Object with keys "a" and "b", each mapping to a non-negative integer
- **Semantics**: Elapsed milliseconds for each team at game end
- **Example**: `{ "a": 225000, "b": 150000 }` represents 3:45 for Team A, 2:30 for Team B
- **Constraint**: Must match final timer state from Active Game

#### `auditLog` (required, array)
- **Type**: Array of Audit Log Event objects (complete log from the game)
- **Constraint**: Snapshot of entire audit log at game completion; immutable

---

## Backward Compatibility

### Schema Versioning

The persisted state container uses a `schemaVersion` field (currently `1`). Future incompatible changes will increment this version.

**Feature 004 Compatibility**: Games created with Feature 004 will have all new fields (undoHistory, timers, auditLog). Games created with Feature 001 and loaded in Feature 004 will:
- Display correctly in between-games view (new fields are absent)
- Not show audit logs or timer data for old games (graceful degradation)
- Allow creation of new games with full Feature 004 functionality

### Serialization Guarantees

- **Numeric precision**: All timestamps and millisecond values must use IEEE 754 double-precision floating point (standard JSON number type)
- **String encoding**: All strings must be UTF-8
- **Array ordering**: Order of entries in `undoHistory` and `auditLog` is semantically significant (most recent first for undo, chronological for audit)

---

## Validation Rules

### Active Game Validation

1. `teams.length === 2`
2. Each team has `id ∈ {"a", "b"}` and `members` with 2-4 distinct player names
3. No player appears in both teams
4. `lifeTotals` has keys "a" and "b" with integer values
5. `turnNumber ≥ 1`
6. `activeTeamId ∈ {"a", "b"}`
7. `firstPlayerTeamId ∈ {"a", "b"}`
8. `firstPlayerSelectionMethod ∈ {"random", "team-size-fairness", "fallback-random"}`
9. `status === "active"`
10. `undoHistory` is an array of valid state snapshots (each snapshot validates like a minimal Active Game)
11. `timers` has keys "a" and "b"; each timer has `elapsedMs ≥ 0` and `lastStartTime` is null or a positive integer
12. `auditLog` is an array of valid Audit Log Events

### Completed Game Validation

1. `id` is a unique non-empty string
2. `teams.length === 2` (same as Active Game)
3. Team membership validation (same as Active Game)
4. `winnerTeamId ∈ {"a", "b"}` and must reference a saved team
5. `winningTurnNumber ≥ 1`
6. `finalLifeTotals` has keys "a" and "b" with integer values
7. `completedAt` is a valid ISO 8601 timestamp string
8. `teamTimers` has keys "a" and "b"; each value is a non-negative integer ≤ 600000 (10 hours, practical upper bound for casual game)
9. `auditLog` is an array of valid Audit Log Events

### Storage Validation

- Invalid or unparseable persisted data must be ignored
- If `magic-circle-state-v1` is malformed, reset to empty state and provide user warning
- If `schemaVersion` is unrecognized, provide warning and attempt to use if structure looks compatible

---

## Reserved Fields and Extension Points

Future versions may add fields to Active Game and Completed Game. Consumers must:
- Ignore unknown fields during deserialization
- Preserve unknown fields during round-trip serialization (pass-through)
- Not assume a fixed set of fields; use property existence checks

This ensures forward compatibility if Feature 005 or later add new fields.

