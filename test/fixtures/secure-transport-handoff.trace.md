# Continuity Context

- Envelope Schema: [tiinex.root.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/tiinex.root.v1.schema.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-10 10:00:00
  - Authors: Fixture
  - Why: Exercise portable Handoff qualification.
  - Summary: CLI secure transport fixture handoff.
  - Status: local

---

# CLI secure transport fixture handoff

## Handoff Parties

- Purpose: prove a clear route with sealed required context
- From: Anchor
- From Kind: role
- To: Kodax
- To Kind: role


## Transfers

- fixture-transfer
  - Transfer Kind: work
  - Description: bounded fixture work
  - Boundary: fixture-only

## Required Context

- sealed-workspace
  - Material: required non-route Workspace context.
  - Material Reference: [Sealed Workspace](sealed::.topics/.workspaces/tiinex-cli.workspace.md)
  - Purpose: prove the required Workspace stays unavailable until authorized open.
  - Availability: available

## Reference Context

- none

## Retained Responsibilities

- none

## Exclusions And Dependencies

- none

## Completion Expectation

- Signal Kind: return
- Signal Meaning: return the bounded fixture result
- Return To: Anchor

## Interpretation Limits

- Does Not Mean: fixture routing grants semantic authority
- Must Not Be Used To Claim: package placement or filenames override Tiinex qualification
- Authority Limits: fixture only

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value:M3wUr8vFCG4dpXMXN_7YtNWs1c65LXL5FyYZfh3BrtA
