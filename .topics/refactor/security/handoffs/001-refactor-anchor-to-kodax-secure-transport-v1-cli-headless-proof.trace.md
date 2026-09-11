# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-10 11:27:10
  - Trace: [001-secure-transport-v1-cli-headless-proof.trace.md](../001-secure-transport-v1-cli-headless-proof.trace.md)
  - Origin:
    - [relative](../001-secure-transport-v1-cli-headless-proof.trace.md)
- Current
  - Current Schema: [tiinex.handoff.v1](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.schemas/coordination/handoff/tiinex.handoff.v1.schema.md)
  - Created At: 2026-09-10 11:27:53
  - Authors: Anchor
  - Why: Delegate the first independent host consumer after Core mechanics and Docs semantics qualified, while keeping shared source and graphical hosts out of scope.
  - Summary: Bounded CLI implementation and headless qualification of the accepted public Secure Transport V1 Core contract.
  - Status: ready/local

---

# Refactor Anchor → Kodax: Secure Transport V1 CLI headless proof

## Handoff Parties

- Purpose: implement and qualify the first independent `@tiinex/cli` headless consumer of the accepted Secure Transport V1 Core contract, without widening crypto semantics or mutating shared authority/source Workspaces.
- From: Anchor
- From Kind: role
- From Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
- To: Kodax
- To Kind: role
- To Reference: [Kodax Role](business::.topics/roles/001-6-kodax-role.trace.md)

## Transfers

- cli-secure-transport-implementation
  - Transfer Kind: work
  - Description: implement the controlling CLI Task using only qualified public `@tiinex/core` / `@tiinex/core/node` contracts. Keep password input out of ordinary argv, preserve fail-closed behavior, and produce a real multi-Workspace clear-route + sealed-context proof.
  - Controlling Artifact: [Secure Transport V1 CLI headless proof](../001-secure-transport-v1-cli-headless-proof.trace.md)
  - Boundary: CLI Workspace only; if public Core is insufficient, return a blocker instead of importing private source or reimplementing crypto/package mechanics.

- cli-security-qualification
  - Transfer Kind: work
  - Description: add only fast host-boundary tests needed to prove password secrecy at the CLI boundary, exact-byte open, name-tree non-disclosure, wrong/empty-password fail-closed behavior, route-Workspace V1 prohibition, and package/installability boundaries.
  - Controlling Artifact: [CLI qualification frontier](../../qualification/001-cli-qualification-frontier.trace.md)
  - Boundary: do not clone Core's internal regression suite or turn this into broad CLI product completion.

## Required Context

- cli-workspace
  - Material: complete current CLI source including the new Secure Transport headless-proof Task.
  - Material Reference: [CLI Workspace](cli::.topics/.workspaces/tiinex-cli.workspace.md)
  - Purpose: sole writable implementation Workspace.
  - Availability: available

- core-workspace
  - Material: exact current Core source after accepted Secure Transport V1 profile-conformance corrections.
  - Material Reference: [Core Workspace](core::.topics/.workspaces/tiinex-core.workspace.md)
  - Purpose: public implementation/mechanics dependency and executable qualification context.
  - Availability: available

- docs-workspace
  - Material: accepted Transport Envelope V1 and concrete password-profile semantic authority.
  - Material Reference: [Docs Workspace](docs::.topics/.workspaces/tiinex-docs.workspace.md)
  - Purpose: read-only semantic authority; implementation must conform rather than reinterpret.
  - Availability: available

- business-workspace
  - Material: Secure Transport outcome, Anchor/Kodax Roles and organizational continuity.
  - Material Reference: [Business Workspace](business::.topics/.workspaces/tiinex-business.workspace.md)
  - Purpose: controlling cross-repository outcome and role authority.
  - Availability: available

## Reference Context

- core-return
  - Material: accepted Loom conformance-return Handoff and its focused/full qualification evidence in the current Core Workspace.
  - Purpose: establish the exact mechanics baseline being consumed by CLI.
  - Availability: available

## Retained Responsibilities

- integration-and-promotion
  - Retained By: Anchor
  - Retained By Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)
  - Responsibility: three-way reconcile the returned CLI source, independently qualify it against current Core, decide downstream VS Code/App/Site adoption, and own any shared-contract follow-up.
  - Boundary: Kodax PASS is technical return evidence, not automatic acceptance or publication.

- semantic-profile
  - Retained By: Axiom / Docs authority and Anchor
  - Responsibility: any future change to KDF/crypto profile, envelope meaning, disclosure semantics or canonical schema coordinates.
  - Boundary: Kodax must not redesign the accepted Secure Transport V1 profile.

## Exclusions And Dependencies

- shared-source-mutation
  - Kind: excluded-scope
  - Description: no Core, Docs, Business, extension-vscode, App, Site, Provider, Verse, Interop or Runtime source mutation.
  - Responsible Party Or Role: owning roles / Refactor Anchor.

- private-core-imports
  - Kind: excluded-scope
  - Description: do not reach into unexported/private Core implementation paths or duplicate encryption/package logic. Return a precise Core public-surface blocker if necessary.
  - Responsible Party Or Role: Anchor / Loom for any later shared-mechanics adjustment.

- graphical-ux
  - Kind: excluded-scope
  - Description: no VS Code prompts, App/Site UI, Windows credential integration, Passkeys, signing, ZipCrypto or carrier-sealed V2 work.
  - Responsible Party Or Role: future bounded host lanes.

- publication
  - Kind: excluded-scope
  - Description: no npm/GitHub publication, commit, push or deployment.
  - Responsible Party Or Role: Anchor / Sigma after later integration qualification.

## Completion Expectation

- Signal Kind: return
- Signal Meaning: return one normal Tiinex Handoff carrying complete changed CLI source, exact test/package evidence, any explicit public-Core blocker, and no sibling source mutation; Anchor will reconcile it against this exact input and current frontier.
- Return To: Anchor
- Return To Reference: [Anchor Role](business::.topics/roles/001-1-anchor-role.trace.md)

## Interpretation Limits

- Does Not Mean: Secure Transport is exposed in VS Code/App/Site, Core is published, CLI is feature-complete, or human/operator acceptance has occurred.
- Must Not Be Used To Claim: new crypto semantics, recipient identity, signing authority, carrier-sealed routing, or permission to mutate shared Workspaces.
- Authority Limits: bounded CLI implementation/qualification only under the controlling Task and supplied public contracts.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-secure-transport-v1-cli-headless-proof.trace.md](../001-secure-transport-v1-cli-headless-proof.trace.md)
  - Value: w20uDpP2MLi_jOaOOA3RFjiGT4-Jn3bSK2lqWCr7C9c

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: vPWO8wbsbGnGgmO9gzR4Khw4_Kvw9VAZd9EfLGKJlBc