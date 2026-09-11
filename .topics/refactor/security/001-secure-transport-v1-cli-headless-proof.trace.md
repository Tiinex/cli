# Continuity Context

- Envelope Schema: tiinex.root.v1
- Parent
  - Parent Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-09 23:48:32
  - Trace: [001-secure-transport-recipient-encryption.trace.md](../../../business::.topics/initiatives/refactor/security/001-secure-transport-recipient-encryption.trace.md)
  - Origin:
    - [relative](../../../business::.topics/initiatives/refactor/security/001-secure-transport-recipient-encryption.trace.md)
- Current
  - Current Schema: [tiinex.task.v1](https://github.com/Tiinex/docs/blob/053d46ce082d4ec261b82abc44ecca403d61e240/.topics/.schemas/core/task/tiinex.task.v1.schema.md)
  - Created At: 2026-09-10 11:27:10
  - Authors: Anchor
  - Why: Exercise the accepted shared Secure Transport mechanics through an independent headless host before VS Code, App or Site exposes the capability to operators.
  - Summary: First dedicated CLI host proof of password-sealed Workspace transport over the qualified public Core V1 contract.
  - Status: active/local

---

# Secure Transport V1 CLI headless proof

## Objective

Provide the first independent host-level proof that the accepted Secure Transport V1 Core mechanics can be consumed through the dedicated `@tiinex/cli` host without reimplementing cryptography, package semantics, Workspace qualification, or Handoff authority.

## Scope

Implementation is owned only by the CLI Workspace.

- Add the smallest useful headless command surface needed to exercise password-sealed Workspace transport over qualified public `@tiinex/core` / `@tiinex/core/node` APIs.
- Prove a real multi-Workspace Handoff/package flow in which the authoritative selected Handoff route Workspace remains clear and at least one non-route Required Context Workspace is password-sealed.
- Keep protected Workspace filenames/directories/internal `.topics` inventory absent from the outer carrier representation and recover the exact original Workspace byte tree only after successful authenticated open.
- Password material must not be accepted as ordinary command-line argument text that would be retained in shell history/process argv. Prefer an explicit stdin/input-channel contract suitable for automation and later host reuse.
- Wrong or empty password, tamper, malformed/unsupported envelope state, unsafe recovered paths, ambiguous Workspace correlation, and existing destination conflicts must fail closed without partial landing or silent plaintext downgrade.
- Machine-readable CLI output may report bounded state/reason/paths/digests but must never print passwords, derived keys, wrapping keys, plaintext content keys, or decrypted internal file inventory before qualified open.
- Preserve current clear-carrier/ordinary CLI behavior and package boundary.

If the current public Core surface is insufficient for a faithful implementation, return a precise blocker to Refactor Anchor instead of importing private Core files or duplicating Core mechanics.

## Dependencies

- [Secure Transport & Recipient Encryption](business::.topics/initiatives/refactor/security/001-secure-transport-recipient-encryption.trace.md) as the cross-repository outcome.
- Accepted Docs/Axiom `tiinex.transport.envelope.v1` and concrete V1 password profile semantics.
- Current qualified Core Secure Transport V1 mechanics, including the accepted empty-password and plain-schema-id conformance corrections.
- Existing CLI host foundation, command surface, Handoff/Workspace workflow and qualification Tasks.

## Done Criteria

- A caller can use the CLI headlessly to create/prepare one password-sealed non-route Workspace transport using only public Core contracts and a non-argv password input channel.
- A caller can open the protected Workspace with the correct password and obtains the exact original qualified Workspace byte tree only after Core authentication + ordinary Workspace qualification succeeds.
- The same proof demonstrates that wrong and empty passwords fail locked/closed without partial output.
- At least one test inspects the produced outer carrier/package representation and proves protected internal filenames/tree entries are absent while allowed outer routing/Workspace disclosure remains available.
- At least one multi-Workspace fixture proves the selected Handoff route Workspace cannot be sealed in V1 while a non-route Required Context Workspace can be sealed and remains unavailable to providers until open/qualification.
- CLI tests cover only the public host boundary and the security-sensitive use cases above; they must not clone Core's existing 57-test regression surface.
- `npm test`, CLI package/pack qualification and an installed-package or equivalent no-source-private-import consumer proof pass against the exact current Core candidate.
- No Core, Docs, Business, VS Code, App, Site, Provider, Verse, Interop or Runtime source is mutated.
- No npm/GitHub publication or remote write occurs.

---

# Continuity Integrity

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: [001-secure-transport-recipient-encryption.trace.md](../../../business::.topics/initiatives/refactor/security/001-secure-transport-recipient-encryption.trace.md)
  - Value: mE5p0IRNHqTZSCit6271ytohhQB8ly1yCGlOpgkPPw8

- [sha256-base64url-c14n-v2](https://github.com/Tiinex/docs/blob/3988951208eb9a8926e84ab42625d4b42fa00c2d/.topics/.validators/sha256-base64url-c14n-v2.validator.md)
  - Towards: self
  - Value: w20uDpP2MLi_jOaOOA3RFjiGT4-Jn3bSK2lqWCr7C9c