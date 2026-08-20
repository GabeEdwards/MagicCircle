<!--
Sync Impact Report
- Version change: unversioned scaffold -> 1.0.0
- Modified principles: template placeholders -> five initial project principles
- Added sections: Security and Quality Constraints; Development Workflow
- Removed sections: none
- Follow-up TODOs: establish the original ratification date
-->

# MagicCircle Constitution

## Core Principles

### I. User Value First
Every change MUST address a documented user or product need, and its acceptance criteria
MUST be observable through behavior, tests, or explicit review evidence. Unrequested
complexity MUST NOT be introduced. This keeps the project focused and makes scope
decisions auditable.

### II. Simplicity and Local Consistency
Implementations MUST use the repository's existing patterns and dependencies when they
fit the need. A new abstraction, dependency, or architectural boundary MUST have a
specific benefit that is recorded in the change rationale. This limits maintenance cost
and keeps the codebase understandable.

### III. Verification Is Mandatory
Every behavior change MUST include or update focused automated tests when the behavior
is testable. A change MUST pass the narrowest relevant validation before it is considered
complete; broader validation MUST be run when shared contracts or cross-module behavior
are affected. This prevents silent regressions while keeping feedback fast.

### IV. Explicit Contracts
Public APIs, persisted data, configuration, and user-facing behavior MUST have explicit
contracts. Changes that break a contract MUST document the impact, migration or
compatibility strategy, and affected consumers before implementation. This makes
integration risk visible and supports deliberate evolution.

### V. Secure and Observable Operation
Changes MUST protect sensitive data, validate untrusted input, and avoid exposing
credentials or personal information in logs, errors, or artifacts. Operationally
significant paths MUST provide actionable diagnostics consistent with the host platform's
logging conventions. These rules reduce security exposure and shorten diagnosis time.

## Security and Quality Constraints

Dependencies MUST be justified by need and kept current according to the repository's
supported toolchain. Validation MUST cover malformed input and failure paths for code
that handles external data. Secrets MUST come from approved runtime configuration and
MUST NOT be committed to the repository.

## Development Workflow

Work MUST proceed from a clear requirement to an implementation and focused validation.
Reviews MUST check acceptance criteria, contract compatibility, security implications,
test coverage, and unnecessary complexity. A change MUST NOT be marked complete while
known relevant validation is failing or omitted without a documented reason.

## Governance

This constitution governs project development practices and takes precedence over
conflicting local guidance. Amendments MUST describe the affected principles or sections,
the rationale, and any migration or follow-up work. The constitution MUST be reviewed
when a feature changes a shared contract, security boundary, or development workflow.

Versioning follows semantic versioning: MAJOR for incompatible governance changes or
removed principles, MINOR for new principles or materially expanded obligations, and
PATCH for clarifications and non-semantic corrections. Every amendment MUST update the
version and last-amended date, and reviewers MUST verify compliance with this document.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): establish original adoption date | **Last Amended**: 2026-08-20

## App Target

1) Prioritize simplicity.
2) Do not use 3rd party images or other artifacts. Prefer simple geometric rendering.
3) Maintain cross platform support for web interfaces, including touch based interfaces like tablets.
4) Minimize costs of hosting and operations.
5) Keep all logic and data on the client. No server-side data or execution allowed.
