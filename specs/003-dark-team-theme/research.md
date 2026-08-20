# Research: Dark Theme and Team Shading

## Decision: Use CSS variables for a default dark theme

**Rationale**: The existing app is a static client-only page with centralized CSS tokens.
Replacing page, surface, text, control, table, dialog, and status colors through variables
keeps the change small, preserves markup behavior, and avoids theme-state persistence.

**Alternatives considered**: A runtime theme switcher adds scope and storage requirements
not requested by the feature. Per-selector color edits would make missed light surfaces and
future maintenance more likely.

## Decision: Use dark team shades derived from canonical blue and green identities

**Rationale**: Team Blue and Team Green must remain recognizable in the dark interface.
Deep tinted surfaces with lighter borders or accents provide team identity while preserving
foreground contrast against the dark page background.

**Alternatives considered**: Neutral panels would lose team association. Bright saturated
panels would conflict with the requested dark theme and risk poor text contrast.

## Decision: Preserve active state as a separate non-color visual cue

**Rationale**: Team shading communicates identity, not turn ownership. A border, outline,
shadow, label, or weight change can identify the active team without relying on color alone
and remains visible over either team shade.

**Alternatives considered**: Reusing team color as the active state would be ambiguous.
A page-level banner alone would be less immediate than highlighting the active panel.

## Decision: Validate forced-contrast and reduced-motion behavior with browser checks

**Rationale**: The constitution requires cross-platform touch support and verification. The
feature is presentation-only, so browser checks at tablet sizes can verify readability,
state distinction, overflow, and unchanged interaction behavior without a new test stack.

**Alternatives considered**: Desktop-only screenshots would not cover the primary iPad
workflow. Adding a UI framework would violate the simplicity and low-cost constraints.

## Decision: Do not persist theme preference or alter game records

**Rationale**: The dark theme is the only required theme and is the default. No preference
or migration is needed, and existing local game records remain compatible because the
change affects presentation only.

**Alternatives considered**: Persisting a preference is unnecessary for a single default
mode and adds storage failure and migration concerns.
