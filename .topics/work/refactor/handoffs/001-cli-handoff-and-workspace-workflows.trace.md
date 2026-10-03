# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 18:22:46
  - Trace: [001-cli-host-foundation.trace.md](../001-cli-host-foundation.trace.md)
  - Origin:
    - [relative](../001-cli-host-foundation.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 18:23:13
  - Authors: Anchor
  - Why: Reduce manual transport work while preserving one shared Handoff contract.
  - Summary: Canonical Handoff and Workspace operator flows from the dedicated CLI host.
  - Status: ready/local

---

# CLI Handoff and Workspace workflows

## Objective
Make receive/orient/ground/manufacture and Workspace-oriented workflows available from the dedicated CLI host using the canonical Tiinex transport conventions.

## Scope
Host exposure and operator ergonomics only; Handoff/package semantics and manufacture mechanics remain in Core.

## Dependencies
Parent CLI host foundation Task; canonical Core Handoff/Workspace mechanics and transport contracts.

## Done Criteria
CLI Handoff flows produce the same qualified transport/result semantics as the shared portable Tooling path rather than a CLI-specific format.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-cli-host-foundation.trace.md](../001-cli-host-foundation.trace.md)
  - Value: W9Q3zHPEOP2gpQe80llz1dbsyLhoXYaXVnMT0OnU9GA

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: CQi8bviVqCb7bEVYlbZo7wk-ZXdrYq8ftkV2qk7ekZw