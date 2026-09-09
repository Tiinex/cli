# cli

First-party Tiinex command-line host — portable Workspace, validation, Handoff, runtime and operator workflows over Tiinex Core and public integration contracts.

## Turn-2 boundary

This repository is the dedicated command-line host. It is intentionally small during Turn 2: command mechanics that already belong to Core portable Tooling must be reused through public contracts rather than copied into a second implementation core.

CLI may compose `runtime-native`, Providers and Interop as their public contracts stabilize. Provider-, environment-, editor- and browser-specific behavior remains in its owning package.

## Distribution

- npm: `@tiinex/cli`
- branch: `master`
- release policy: `.github/release-policy.json`
- bootstrap command after repository/package qualification: `npm run publish:bootstrap`

Publication remains separate from source readiness and technical qualification.
