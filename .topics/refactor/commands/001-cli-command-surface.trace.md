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
  - Created At: 2026-09-09 18:23:12
  - Authors: Anchor
  - Why: Keep operator ergonomics local to CLI without duplicating shared command mechanics.
  - Summary: Small host-level command routing over public Tiinex contracts.
  - Status: ready/local

---

# CLI command surface

## Objective
Expose a small coherent command surface for Workspace, validation, grounding and Handoff operator flows without duplicating Core command mechanics.

## Scope
Command naming/routing, help, exit behavior and stable host-level composition over public contracts.

## Dependencies
Parent CLI host foundation Task; public Core portable Tooling and command contracts.

## Done Criteria
The CLI can delegate mechanics to owning packages while keeping a predictable operator-facing surface and machine-readable failure behavior.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-cli-host-foundation.trace.md](../001-cli-host-foundation.trace.md)
  - Value: ByYNBXJJxB3ZVUC6MAKOgB0aMg-dJXcr9aCUjEDjHdc

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: I8N4Ic7x1IKWaBCVxuwKhgRjml6oGCH8vZDqWkjrGjg