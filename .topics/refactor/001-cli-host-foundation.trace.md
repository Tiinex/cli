# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.topic.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/topic/tiinex.topic.v1.schema.md)
  - Created At: 2026-09-09 18:20:58
  - Trace: [001-command-line-host-frontier.trace.md](../../business::.topics/initiatives/refactor/cli/001-command-line-host-frontier.trace.md)
  - Origin:
    - [relative](../../business::.topics/initiatives/refactor/cli/001-command-line-host-frontier.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 18:22:46
  - Authors: Anchor
  - Why: Give the CLI repository its own decomposed executable frontier tied to the controlling Business objective.
  - Summary: Dedicated command-line host over public Tiinex contracts.
  - Status: ready/local

---

# CLI host foundation

## Objective

Establish a small independently versioned command-line host that reuses public Tiinex mechanics and can later host runtime/provider/interop capabilities without copying them.

## Scope

- public CLI entrypoint and command composition boundary
- Workspace/operator commands
- validation and Handoff command exposure through public contracts
- optional runtime invocation through `runtime-native` when that contract stabilizes
- package/release qualification
- failure and exit-code behavior suitable for automation

## Non-goals

- no duplicated Core portable Tooling implementation
- no GitHub/OpenAI/VS Code/Chrome-specific command branches
- no new semantic authority
- no speculative runtime scheduler inside CLI

## Dependencies

- Controlling Business command-line host frontier.
- Public Core contracts for Workspace, validation, grounding and Handoff mechanics.
- Runtime/Provider/Interop public contracts only as those frontiers stabilize.

## Done Criteria

- package identity and release policy are independently qualified
- CLI can expose the required operator flows through public package contracts
- provider/runtime/interop integrations remain replaceable and separately diagnosable
- failures are explicit and machine-usable without hiding degraded qualification

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-command-line-host-frontier.trace.md](../../business::.topics/initiatives/refactor/cli/001-command-line-host-frontier.trace.md)
  - Value: JhilZJBE9iabLvOhmc8s8Ky20N7t25C3B1YLxkIvKoA

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: ByYNBXJJxB3ZVUC6MAKOgB0aMg-dJXcr9aCUjEDjHdc