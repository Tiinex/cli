# cli

First-party Tiinex command-line host — portable Workspace, validation, Handoff, runtime and operator workflows over Tiinex Core and public integration contracts.

## Current command surface

The first qualified headless workflow is Secure Transport V1 for password-sealed non-route Workspace transport. CLI remains a host over public `@tiinex/core` contracts; cryptography, Handoff package semantics, Workspace archive qualification, and secure-envelope semantics remain owned by Core.

### Seal one non-route Required Context Workspace

Create a non-secret JSON plan:

```json
{
  "routeWorkspace": {
    "id": "route",
    "root": "/absolute/path/to/route-workspace",
    "workspaceTargetPath": ".topics/.workspaces/tiinex-cli.workspace.md"
  },
  "handoffPath": ".topics/example/handoff.trace.md",
  "requiredContextWorkspaces": [
    {
      "id": "context",
      "root": "/absolute/path/to/context-workspace",
      "workspaceTargetPath": ".topics/.workspaces/tiinex-context.workspace.md"
    }
  ],
  "sealedWorkspaceId": "context",
  "slotId": "password"
}
```

Pass the password only through standard input, not argv:

```sh
printf %s 'correct horse battery staple' | tiinex secure-transport seal \
  --plan ./seal-plan.json \
  --output ./handoff.secure.zip \
  --password-stdin
```

The selected route Workspace remains a clear complete Workspace snapshot. The selected non-route Workspace is carried as a visible Workspace artifact plus a password-sealed protected payload and Transport Envelope; its complete `.workspace.zip` and internal filename/tree inventory are absent from the outer carrier.

### Open and qualify a sealed Workspace

```sh
printf %s 'correct horse battery staple' | tiinex secure-transport open \
  --package ./handoff.secure.zip \
  --workspace context \
  --output ./opened-context \
  --password-stdin
```

CLI writes a destination only after Core authenticates the password, safely recovers the archive, correlates exactly one Workspace artifact, and completes ordinary Workspace qualification. Wrong/empty credentials, package tamper, unsafe recovered paths, ambiguity, and existing destination conflicts fail closed without a qualified plaintext landing.

Operational commands emit one bounded JSON object on success or failure. Password, derived keys, wrapping/content keys, and pre-open decrypted inventory are never emitted. `--password`, `--password=...`, and equivalent password-text argv forms are rejected.

## Boundary

Command mechanics that already belong to Core portable Tooling are reused through public package exports rather than copied into the CLI. Provider-, environment-, editor- and browser-specific behavior remains in its owning package.

## Distribution

- npm: `@tiinex/cli`
- executable: `tiinex`
- branch: `master`
- release policy: `.github/release-policy.json`
- bootstrap command after repository/package qualification: `npm run publish:bootstrap`

Publication remains separate from source readiness and technical qualification.
