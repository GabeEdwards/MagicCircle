# Research: Session Reset and Winner Default

## Decision: Reset the existing local state envelope after explicit confirmation

**Rationale**: The app already represents all owned data as `activeGame` and
`completedGames`, with player statistics derived from completed games. Writing the existing
empty state to the same key clears the session without changing storage schema or touching
unrelated browser data.

**Alternatives considered**: Removing the storage key has less explicit semantics and can
complicate storage errors. Clearing individual fields risks leaving stale state behind.
Deleting all browser storage would exceed the feature scope and affect unrelated sites.

## Decision: Use a dedicated New session action separate from New game

**Rationale**: New game starts setup while preserving history; New session is destructive
and must communicate that distinction before confirmation. Keeping separate actions reduces
accidental history loss.

**Alternatives considered**: Making the existing New game button destructive would violate
current behavior and create an unsafe surprise. A hidden reset in settings would make the
workflow harder to discover during a play session.

## Decision: Require an explicit confirmation before clearing non-empty state

**Rationale**: The action erases active and historical game data. The confirmation message
must name the data categories so users can understand the consequence before committing.
Cancel must be a no-op.

**Alternatives considered**: A one-click reset is too easy to trigger accidentally. A typed
confirmation is unnecessary friction for a small shared-tablet tool.

## Decision: Derive the winner default from a strict numeric comparison

**Rationale**: When the end-game view opens, select Team Blue if its life total is greater,
Team Green if its life total is greater, and nothing if equal. This handles negative and
above-40 values naturally and leaves the final selection user-overridable.

**Alternatives considered**: Always selecting the first team is biased. Selecting the team
with the lower life total contradicts the requested likely-winner default. Choosing randomly
for ties would hide an unresolved result.

## Decision: Compute the default when the end-game view opens

**Rationale**: The default must reflect the current final life totals and should not become
persisted game data. Computing it at view entry keeps the completed-game schema unchanged.

**Alternatives considered**: Persisting a suggested winner adds redundant state. Computing
at game start would become stale as life changes.
