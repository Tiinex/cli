import {
  buildRecipientFacingV2PackageV1Secure,
  manufactureRecipientRelativeHandoffPackage,
  openRecipientV2PackageV1SealedWorkspace
} from '@tiinex/core/node';
import { prepareNodeHandoffManufacturingInput } from '@tiinex/core/tooling/portable/adapters/node/handoff.manufacture.js';
import { packageFileByteView, sha256Hex } from '@tiinex/core/export/package.bytes.js';
import { exportFileMapZipUint8Array } from '@tiinex/core/export/package.zip.js';
import { handoffWorkspaceProviderForId, normalizeHandoffWorkspaceInnerPath } from '@tiinex/core/tooling/portable/handoff/workspaceByteProvider.js';
import { loadNodePortableInput } from '@tiinex/core/tooling/portable/input/node.input.js';
import {
  link,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  unlink,
  writeFile
} from 'node:fs/promises';
import path from 'node:path';

const MAX_PASSWORD_INPUT_BYTES = 64 * 1024;

export class CliFailure extends Error {
  constructor(code, reason = code, state = 'failed') {
    super(code);
    this.name = 'CliFailure';
    this.code = String(code || 'cli-failed');
    this.reason = String(reason || this.code);
    this.state = String(state || 'failed');
  }
}

export async function readPasswordInput(stream) {
  if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
    throw new CliFailure('password-stdin-unavailable');
  }
  const chunks = [];
  let total = 0;
  for await (const chunk of stream) {
    const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
    total += bytes.byteLength;
    if (total > MAX_PASSWORD_INPUT_BYTES) throw new CliFailure('password-stdin-too-large');
    chunks.push(bytes);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
  } catch {
    throw new CliFailure('password-stdin-invalid-utf8');
  }
}

export async function sealSecureTransportPackage(input = {}) {
  const planPath = requiredText(input.planPath, 'seal-plan-required');
  const outputPath = path.resolve(requiredText(input.outputPath, 'seal-output-required'));
  const password = String(input.password ?? '');
  const plan = await readPlan(planPath);
  const routeWorkspace = normalizeRouteWorkspace(plan.routeWorkspace);
  const contextWorkspaces = normalizeContextWorkspaces(plan.requiredContextWorkspaces);
  const sealedWorkspaceId = requiredText(plan.sealedWorkspaceId, 'seal-workspace-id-required');
  const slotId = optionalText(plan.slotId) || 'password';
  const recipientHint = optionalText(plan.recipientHint);

  const prepared = await prepareNodeHandoffManufacturingInput({
    workspaceRoot: routeWorkspace.root,
    workspaceId: routeWorkspace.id,
    workspaceTitle: routeWorkspace.title,
    workspaceTargetPath: routeWorkspace.workspaceTargetPath,
    handoffPath: requiredText(plan.handoffPath, 'seal-handoff-path-required'),
    additionalWorkspaces: contextWorkspaces.map((workspace) => ({
      id: workspace.id,
      root: workspace.root,
      title: workspace.title,
      workspaceTargetPath: workspace.workspaceTargetPath
    })),
    toolingBootstrap: 'embedded',
    verifyRoundtrip: true
  }, { verifyRoundtrip: true });

  const clear = manufactureRecipientRelativeHandoffPackage(prepared, { verifyRoundtrip: true });
  if (clear.status !== 'ready' || clear.inspection?.status !== 'valid') {
    throw new CliFailure('clear-carrier-manufacture-blocked', firstFindingCode(clear) || clear.status || 'blocked');
  }

  const sourceSurface = sourceSurfaceFromClearManufacture(clear);
  const secure = await buildRecipientFacingV2PackageV1Secure({
    sourceSurface,
    descriptor: clear.descriptor,
    carrierProjection: clear.carrierProjection,
    carrierProfile: clear.carrierProjection?.profile || null,
    bundle: { files: [...(prepared.additionalTransportFiles || []), ...(clear.bundle?.files || [])] },
    createdAt: optionalText(plan.createdAt) || utcTimestamp(),
    sealedWorkspaces: [{
      workspaceId: sealedWorkspaceId,
      recipients: [{ slotId, password, ...(recipientHint ? { recipientHint } : {}) }]
    }]
  });

  if (secure.status !== 'ready' || secure.inspection?.status !== 'valid' || !Array.isArray(secure.files)) {
    throw new CliFailure('secure-carrier-manufacture-blocked', firstFindingCode(secure) || secure.reason || secure.status || 'blocked');
  }

  const packageBytes = exportFileMapZipUint8Array(secure.files);
  await writeFileAtomicallyNoReplace(outputPath, packageBytes);
  return Object.freeze({
    state: 'sealed-qualified',
    outputPath,
    packageSha256: sha256Hex(packageBytes),
    packageBytes: packageBytes.byteLength,
    routeWorkspaceId: routeWorkspace.id,
    sealedWorkspaceId,
    slotId
  });
}

export async function openSecureTransportPackage(input = {}) {
  const packagePath = path.resolve(requiredText(input.packagePath, 'open-package-required'));
  const workspaceId = requiredText(input.workspaceId, 'open-workspace-id-required');
  const outputPath = path.resolve(requiredText(input.outputPath, 'open-output-required'));
  const password = String(input.password ?? '');
  const slotId = optionalText(input.slotId);

  await assertAbsent(outputPath, 'open-destination-conflict');
  const bundle = await loadNodePortableInput([packagePath]);
  const opened = await openRecipientV2PackageV1SealedWorkspace(bundle, {
    workspaceId,
    password,
    ...(slotId ? { slotId } : {})
  });

  if (opened.state !== 'opened-qualified') {
    throw new CliFailure('sealed-workspace-open-blocked', opened.reason || opened.state || 'blocked', opened.state || 'failed');
  }

  const workspace = handoffWorkspaceProviderForId(opened.provider, workspaceId);
  if (workspace.state !== 'qualified') {
    throw new CliFailure('opened-workspace-provider-unqualified', (workspace.reasons || [])[0] || workspace.state || 'blocked');
  }
  await landQualifiedWorkspace(outputPath, workspace.entries || []);
  return Object.freeze({
    state: 'opened-qualified',
    workspaceId,
    outputPath,
    workspaceArtifactSha256: String(opened.workspaceArtifactSha256 || ''),
    archiveSha256: String(opened.archiveSha256 || '')
  });
}

function sourceSurfaceFromClearManufacture(clear) {
  const workspaces = (clear.inspection?.workspaces || []).map((workspace) => {
    const workspaceId = requiredText(workspace.workspaceId, 'clear-workspace-id-unresolved');
    const archivePath = requiredText(workspace.workspaceArchivePath, 'clear-workspace-archive-unresolved');
    const sourceWorkspaceTargetInnerPath = requiredText(workspace.sourceWorkspaceTargetInnerPath, 'clear-workspace-target-unresolved');
    if (String(workspace.coverage || '') !== 'complete' || String(workspace.bindingState || '') !== 'verified') {
      throw new CliFailure('clear-workspace-binding-unqualified');
    }
    return Object.freeze({ workspaceId, coverage: 'complete', archivePath, sourceWorkspaceTargetInnerPath });
  });
  if (!workspaces.length) throw new CliFailure('clear-workspace-set-empty');
  return Object.freeze({
    status: 'ready',
    topology: Object.freeze({ workspaces: Object.freeze(workspaces) }),
    files: Object.freeze([...(clear.bundle?.files || [])])
  });
}

async function readPlan(planPath) {
  let parsed;
  try {
    parsed = JSON.parse(await readFile(path.resolve(planPath), 'utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) throw new CliFailure('seal-plan-invalid-json');
    throw new CliFailure('seal-plan-unavailable');
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new CliFailure('seal-plan-invalid');
  return parsed;
}

function normalizeRouteWorkspace(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CliFailure('route-workspace-required');
  return normalizeWorkspace(value, 'route');
}

function normalizeContextWorkspaces(value) {
  if (!Array.isArray(value) || !value.length) throw new CliFailure('required-context-workspaces-required');
  return Object.freeze(value.map((workspace) => normalizeWorkspace(workspace, 'context')));
}

function normalizeWorkspace(value, kind) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new CliFailure(`${kind}-workspace-invalid`);
  return Object.freeze({
    id: requiredText(value.id, `${kind}-workspace-id-required`),
    root: path.resolve(requiredText(value.root, `${kind}-workspace-root-required`)),
    workspaceTargetPath: requiredText(value.workspaceTargetPath, `${kind}-workspace-target-required`),
    title: optionalText(value.title)
  });
}

async function landQualifiedWorkspace(destination, entries) {
  const parent = path.dirname(destination);
  await mkdir(parent, { recursive: true });
  await assertAbsent(destination, 'open-destination-conflict');
  const tempRoot = await mkdtemp(path.join(parent, `.${path.basename(destination)}.tiinex-open-`));
  let committed = false;
  try {
    const seen = new Set();
    for (const entry of entries) {
      const normalized = normalizeHandoffWorkspaceInnerPath(entry.path || entry.innerPath || '');
      if (normalized.state !== 'qualified') throw new CliFailure('opened-workspace-path-unsafe');
      if (seen.has(normalized.path)) throw new CliFailure('opened-workspace-path-ambiguous');
      seen.add(normalized.path);
      const absolute = path.resolve(tempRoot, ...normalized.path.split('/'));
      if (absolute !== tempRoot && !absolute.startsWith(`${tempRoot}${path.sep}`)) throw new CliFailure('opened-workspace-path-unsafe');
      await mkdir(path.dirname(absolute), { recursive: true });
      await writeFile(absolute, packageFileByteView({ data: entry.data }), { flag: 'wx' });
    }
    await assertAbsent(destination, 'open-destination-conflict');
    await rename(tempRoot, destination);
    committed = true;
  } finally {
    if (!committed) await rm(tempRoot, { recursive: true, force: true });
  }
}

async function writeFileAtomicallyNoReplace(destination, bytes) {
  const parent = path.dirname(destination);
  await mkdir(parent, { recursive: true });
  await assertAbsent(destination, 'seal-output-conflict');
  const tempRoot = await mkdtemp(path.join(parent, `.${path.basename(destination)}.tiinex-seal-`));
  const tempFile = path.join(tempRoot, 'package.zip');
  let linked = false;
  try {
    await writeFile(tempFile, bytes, { flag: 'wx' });
    try {
      await link(tempFile, destination);
      linked = true;
    } catch (error) {
      if (error && error.code === 'EEXIST') throw new CliFailure('seal-output-conflict');
      throw error;
    }
  } finally {
    if (linked) await unlink(tempFile).catch(() => {});
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function assertAbsent(target, failureCode) {
  try {
    await lstat(target);
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw new CliFailure(`${failureCode}-check-failed`);
  }
  throw new CliFailure(failureCode);
}

function firstFindingCode(result) {
  const finding = (result?.findings || []).find((item) => String(item?.severity || '') === 'error') || (result?.findings || [])[0];
  return optionalText(finding?.context?.reason) || optionalText(finding?.code);
}

function requiredText(value, code) {
  const text = String(value ?? '').trim();
  if (!text) throw new CliFailure(code);
  return text;
}

function optionalText(value) {
  return String(value ?? '').trim();
}

function utcTimestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
