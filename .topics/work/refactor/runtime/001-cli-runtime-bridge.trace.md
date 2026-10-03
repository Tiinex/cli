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
  - Created At: 2026-09-09 18:23:14
  - Authors: Anchor
  - Why: Keep one portable runtime while making CLI a first-class host.
  - Summary: Host runtime-native from CLI without forking runtime semantics.
  - Status: ready/local

---

# CLI runtime bridge

## Objective
Allow CLI to invoke `runtime-native` as a host when portable runtime contracts are stable, without making CLI own runtime semantics.

## Scope
Runtime construction/invocation, capability injection and operator lifecycle controls at the host boundary.

## Dependencies
Parent CLI host foundation Task; runtime-native public contract once qualified.

## Done Criteria
The same runtime contract can be invoked from CLI and at least one non-CLI host without forks or host-specific execution semantics.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-cli-host-foundation.trace.md](../001-cli-host-foundation.trace.md)
  - Value: W9Q3zHPEOP2gpQe80llz1dbsyLhoXYaXVnMT0OnU9GA

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: DfjtCWOUwwTKUTFEUoKguBg_6U-vvq6MN_gfwPckrgw