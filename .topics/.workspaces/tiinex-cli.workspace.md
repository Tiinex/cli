# Continuity Context

- Envelope Schema: tiinex.root.v1
- Current
  - Current Schema: tiinex.workspace.v1
  - Created At: 2026-09-09 18:21:56
  - Authors: Anchor
  - Why: Establish durable source identity for the CLI repository before implementation is delegated.
  - Summary: Portable Workspace entrypoint for the dedicated Tiinex command-line host.
  - Status: ready/local

---

# Tiinex CLI

## Schema Origins

- Tiinex Docs canonical schemas
  - Kind: github-tree
  - Repository: Tiinex/docs
  - Ref: master
  - Root Path: .topics/.schemas
  - Trust Role: canonical-core

## Workspace Entrypoints

### CLI source

- Source Kind: local-directory
- Repository: Tiinex/cli
- Root Path: .
- Repo Files Discovery: on

## Workspace Boundary

- First-party Tiinex command-line host over public Core, Runtime, Provider and Interop contracts.
- CLI composition and operator ergonomics are local responsibilities; semantic authority and shared implementation remain in their owning repositories.
- Initial Turn-2 source is intentionally small and package/release ready rather than a duplicated implementation of existing Core portable Tooling.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: v09_I8Ey3yzAUoodIRPE1zVFq-S4aRlUB4VE0Z3M5PY