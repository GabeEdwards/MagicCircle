# Research: Team Display and Player Statistics

## Decision: Keep Team Blue and Team Green as fixed domain identities

**Rationale**: The feature explicitly replaces generic team labels with two stable names.
Fixed IDs keep existing completed-game records compatible while allowing all views to
render canonical names and matching colors.

**Alternatives considered**: User-editable team names would add setup complexity and
make historical comparisons less consistent. Creating new team records would require a
migration without user value.

## Decision: Derive player statistics from completed games

**Rationale**: Completed games already contain the team rosters, winner, and final state.
A pure aggregation recalculates accurate games, wins, losses, and percentage without
introducing duplicate persisted data or migration risk.

**Alternatives considered**: Persisting player totals would require synchronization and
repair rules whenever history is deleted or changed. A server-side aggregate violates the
client-only hosting constraint.

## Decision: Sort roster displays at render time with case-insensitive ordering

**Rationale**: Sorting at the display boundary preserves the existing roster selection
state while guaranteeing consistent alphabetical order in setup, active play, history,
and statistics labels.

**Alternatives considered**: Mutating stored roster order would create unnecessary data
churn and could affect older records. Sorting only during setup would leave history and
active-game displays inconsistent.

## Decision: Disable opposing selections rather than silently remove selected players

**Rationale**: A disabled, greyed-out option communicates why the player cannot be chosen
and preserves the selected team roster. Re-enabling on removal supports correction without
hidden state changes.

**Alternatives considered**: Hiding the player would obscure the conflict. Showing an
error only after a duplicate click would allow a confusing invalid interaction.

## Decision: Use explicit +/-1 and +/-5 controls

**Rationale**: Four labeled controls are direct, touch-friendly, and preserve exact life
changes for both small adjustments and common combat totals. They work without bounds so
they remain compatible with the baseline rules.

**Alternatives considered**: A free-form number input is slower and more error-prone on a
tablet. A single step-size selector adds an extra interaction.

## Decision: Use a visually distinct active-team treatment in addition to color

**Rationale**: Color identifies teams, while an active highlight identifies turn ownership.
A second visual cue reduces ambiguity and supports users who do not distinguish colors
reliably.

**Alternatives considered**: Color-only emphasis risks accessibility failures and makes
active status less obvious when both team colors are present.
