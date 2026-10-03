# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/302506f90537dc23d6f88ad0bd0bb9c97c6cf9f6/.topics/.schemas/tiinex.root.v1.schema.md)
- Current
  - Current Schema: [tiinex.reduction.v1](https://github.com/Tiinex/docs/blob/302506f90537dc23d6f88ad0bd0bb9c97c6cf9f6/.topics/.schemas/reduction/tiinex.reduction.v1.schema.md)
  - Created At: 2026-10-03 18:20:00
  - Authors: Anchor
  - Summary: Collapse stale cli execution lineage into one recoverable fresh-start boundary.
  - Status: ready/local

---

# Cli Fresh Start Reduction

## Source Context

- Reduced Workspace: `cli`
- Immutable Recovery Snapshot: `Tiinex/cli@030e66f5b03d11e14ac821b7015729b1c13930de`
- Exact Pre-Reduction Work Tree: `8c2bd954891674cf9c854ca4088fa5dd9237d297`
- Exact Candidate Manifest: 8 files / 23666 bytes; SHA-256 `cef803dae7db5e25a03d027088153e64e9d1009c7593711231d28c419d1b5679` over sorted `path<TAB>git-blob-sha<TAB>byte-length` rows.
- Reduced Source Scope: all files previously carried under `.topics/work/**`; all 3 pre-existing Workspace Reduction artifacts under `.topics/reductions/workspace/**`.
- Recovery Qualification: the pushed carrier baseline was Git-tree matched against the immutable repository snapshot before this reduction; the exact candidate scope is therefore recoverable without relying on chat history.

## Carry-Forward State

- CLI source and command/runtime contracts remain; no prior CLI execution Task is carried as active. Future CLI work starts from a new explicit Task.
- Repository implementation/source material, Workspace descriptor, and durable non-work authority outside the declared source scope remain in place.
- There is intentionally no claim that any historical Task is ongoing merely because it was previously labelled ready/local or was a lineage leaf.

## Loss And Uncertainty

- Detailed execution chronology, intermediate Handoffs, Tasks, Evidence, prior local Workspace Reductions, and other reduced work artifacts leave the current tree.
- Their exact bytes remain recoverable from `Tiinex/cli@030e66f5b03d11e14ac821b7015729b1c13930de`.
- This Reduction does not retroactively claim successful completion, acceptance, or correctness for every removed artifact; it records that the removed execution history is historical and is not the current continuation surface.
- Future work that needs an old detail should recover it from the immutable snapshot and start a new explicit Task rather than revive stale lineage by filename or status.

## Validation

- Pre-delete pushed recovery verification: qualified by exact Git tree match to `Tiinex/cli@030e66f5b03d11e14ac821b7015729b1c13930de`.
- Candidate manifest applied: 8/8 exact source files removed; the old `.topics/work` tree and pre-existing Workspace Reduction artifacts in scope no longer remain.
- Post-delete reference scan found no surviving local relative reference into the removed candidate set.
- This fresh-start Reduction passed the shared Core audit with verified c14n-v2 self-integrity.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:ad1ZBi4lkXSsF0aw8_5HiYCMCl1hNhuDVeM_KRQXKxY
