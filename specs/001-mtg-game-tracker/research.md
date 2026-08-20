# Research: MTG Game Tracker

## Decision: Use a dependency-free static web application

**Rationale**: The feature is a single-page client-only tool with no account system,
server execution, or remote data requirement. HTML, CSS, and browser JavaScript can be
served directly by GitHub Pages and keep hosting, build, and maintenance costs low.

**Alternatives considered**: A framework-based single-page application would add a
build pipeline and runtime dependencies without solving a stated requirement. A hosted
backend would violate the client-only constitution target and add operational cost.

## Decision: Store active and completed games in browser local storage

**Rationale**: The app must preserve recent history and recover an active game across a
normal reload while keeping all data on the client. Local storage is available to the
static page and is sufficient for the small, bounded data set.

**Alternatives considered**: Session-only state would lose history on reload. A remote
database would require a server and account or synchronization design that is outside
scope. Export/import files can be a future enhancement but are not required for the MVP.

## Decision: Use browser-native cryptographic randomness for first-player selection

**Rationale**: There are exactly two equally likely team choices. A browser-native
cryptographic random value provides an unbiased choice without a library or service.
If the required browser random source is unavailable, the app will use a documented
browser fallback and visibly warn the group that the selection may be less fair.

**Alternatives considered**: `Math.random()` is simpler but provides weaker guarantees
for a fairness-sensitive choice. User-selected first player would remove the requested
randomization. A server-side draw would violate offline and client-only constraints.

## Decision: Model turns as shared round numbers

**Rationale**: The required sequence is first team Turn 1, second team Turn 1, first team
Turn 2, second team Turn 2. The active team and shared turn number can be represented
without storing a separate turn number for each team: increment the shared number when
the selected first team becomes active again.

**Alternatives considered**: Incrementing after every team action would show Turn 1 and
Turn 2 on alternating teams and contradict the specification. Separate per-team turn
counters would duplicate state and add reconciliation risk.

## Decision: Use explicit state transitions for setup, active play, and completion

**Rationale**: The app has two user-facing modes but needs to protect the active game
from accidental replacement and record a complete result. Explicit transitions make
validation, persistence, and focused tests straightforward.

**Alternatives considered**: Mutating screen-specific fields without a state boundary
would make reload recovery and abandoned-game confirmation harder to reason about.

## Decision: Validate tablet touch usability with portrait and landscape acceptance checks

**Rationale**: The iPad is the primary target, and the main risk is not server scale but
clear, reliable use at the table. Acceptance checks will verify visible values, stable
control sizing, touch target usability, and no overlap in both orientations.

**Alternatives considered**: Desktop-only validation would miss the primary device.
Responsive behavior without explicit orientation checks would leave a key requirement
unverified.
