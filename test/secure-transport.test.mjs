import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  inspectRecipientFacingV2PackageV1,
  inspectRecipientV2PackageV1SealedBinding
} from '@tiinex/core/node';
import { packageFileByteView } from '@tiinex/core/export/package.bytes.js';
import { exportFileMapZipUint8Array } from '@tiinex/core/export/package.zip.js';
import { loadNodePortableInput } from '@tiinex/core/tooling/portable/input/node.input.js';

const cliPath = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const workspaceArtifactPath = fileURLToPath(new URL('../.topics/.workspaces/tiinex-cli.workspace.md', import.meta.url));
const fixtureHandoffPath = fileURLToPath(new URL('./fixtures/secure-transport-handoff.trace.md', import.meta.url));
const correctPassword = 'CLI-fixture-password-9bD!';
const secretRelativePath = '.topics/context/private-internal-fixture-name.trace.md';
const secretMarker = 'CLI-SEALED-CONTEXT-PLAINTEXT-MARKER-9f31';

async function invoke(args, stdin = '') {
  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd: fileURLToPath(new URL('../', import.meta.url)),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));
    child.on('error', reject);
    child.on('close', (code, signal) => resolve({
      code,
      signal,
      stdout: Buffer.concat(stdout).toString('utf8'),
      stderr: Buffer.concat(stderr).toString('utf8')
    }));
    child.stdin.end(stdin);
  });
}

function jsonLine(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  assert.equal(lines.length, 1, `expected one JSON line, got ${JSON.stringify(text)}`);
  return JSON.parse(lines[0]);
}

async function exists(target) {
  try { await stat(target); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

async function byteTree(root) {
  const out = new Map();
  async function walk(current, prefix = '') {
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute, relative);
      else if (entry.isFile()) out.set(relative, await readFile(absolute));
      else assert.fail(`unexpected non-file entry ${relative}`);
    }
  }
  await walk(root);
  return out;
}

function assertByteTreesEqual(actual, expected) {
  assert.deepEqual([...actual.keys()], [...expected.keys()]);
  for (const [name, bytes] of expected) assert.deepEqual(actual.get(name), bytes, name);
}

async function makeFixture(base) {
  const routeRoot = path.join(base, 'route');
  const sealedRoot = path.join(base, 'sealed');
  for (const root of [routeRoot, sealedRoot]) await mkdir(path.join(root, '.topics', '.workspaces'), { recursive: true });
  await cp(workspaceArtifactPath, path.join(routeRoot, '.topics', '.workspaces', 'tiinex-cli.workspace.md'));
  await cp(workspaceArtifactPath, path.join(sealedRoot, '.topics', '.workspaces', 'tiinex-cli.workspace.md'));
  await mkdir(path.join(routeRoot, '.topics', 'handoffs'), { recursive: true });
  await cp(fixtureHandoffPath, path.join(routeRoot, '.topics', 'handoffs', 'fixture.trace.md'));
  await mkdir(path.join(sealedRoot, '.topics', 'context'), { recursive: true });
  await writeFile(path.join(sealedRoot, ...secretRelativePath.split('/')), `${secretMarker}\n`, 'utf8');

  const plan = {
    routeWorkspace: {
      id: 'route',
      root: routeRoot,
      workspaceTargetPath: '.topics/.workspaces/tiinex-cli.workspace.md'
    },
    handoffPath: '.topics/handoffs/fixture.trace.md',
    requiredContextWorkspaces: [{
      id: 'sealed',
      root: sealedRoot,
      workspaceTargetPath: '.topics/.workspaces/tiinex-cli.workspace.md'
    }],
    sealedWorkspaceId: 'sealed',
    slotId: 'password',
    createdAt: '2026-09-10 10:00:00'
  };
  const planPath = path.join(base, 'seal-plan.json');
  await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
  return { routeRoot, sealedRoot, plan, planPath };
}

test('headless Secure Transport V1 seals non-route context and opens exact bytes only after qualification', { timeout: 120_000 }, async () => {
  const base = await mkdtemp(path.join(os.tmpdir(), 'tiinex-cli-secure-'));
  try {
    const fixture = await makeFixture(base);
    const packagePath = path.join(base, 'carrier.zip');

    const seal = await invoke([
      'secure-transport', 'seal',
      '--plan', fixture.planPath,
      '--output', packagePath,
      '--password-stdin'
    ], correctPassword);
    assert.equal(seal.code, 0, seal.stderr);
    assert.equal(seal.stderr, '');
    const sealResult = jsonLine(seal.stdout);
    assert.equal(sealResult.state, 'sealed-qualified');
    assert.equal(sealResult.routeWorkspaceId, 'route');
    assert.equal(sealResult.sealedWorkspaceId, 'sealed');
    assert.ok(await exists(packagePath));

    const outerBytes = await readFile(packagePath);
    assert.equal(outerBytes.includes(Buffer.from(secretRelativePath, 'utf8')), false, 'protected internal path must not appear in outer carrier bytes');
    assert.equal(outerBytes.includes(Buffer.from(secretMarker, 'utf8')), false, 'protected plaintext must not appear in outer carrier bytes');
    assert.equal(outerBytes.includes(Buffer.from(correctPassword, 'utf8')), false, 'password must not appear in outer carrier bytes');

    const bundle = await loadNodePortableInput([packagePath]);
    const inspection = inspectRecipientFacingV2PackageV1(bundle);
    assert.equal(inspection.status, 'valid');
    const route = inspection.workspaces.find((workspace) => workspace.workspaceId === 'route');
    const sealed = inspection.workspaces.find((workspace) => workspace.workspaceId === 'sealed');
    assert.equal(route.bindingState, 'verified');
    assert.match(route.workspaceArchivePath, /\.workspace\.zip$/);
    assert.equal(sealed.bindingState, 'sealed');
    assert.equal(sealed.workspaceArchivePath, '');
    assert.equal(inspection.sealedWorkspaces.length, 1);
    const lockedBinding = inspectRecipientV2PackageV1SealedBinding(bundle, 'sealed');
    assert.equal(lockedBinding.state, 'locked-qualified');
    assert.equal(lockedBinding.providerActive, false);
    assert.equal(bundle.files.some((file) => String(file.path).includes(secretRelativePath)), false);

    const wrongDestination = path.join(base, 'wrong-open');
    const wrong = await invoke([
      'secure-transport', 'open', '--package', packagePath, '--workspace', 'sealed', '--output', wrongDestination, '--password-stdin'
    ], 'wrong-password');
    assert.equal(wrong.code, 1);
    assert.equal(jsonLine(wrong.stderr).state, 'locked');
    assert.equal(jsonLine(wrong.stderr).reason, 'wrong-password');
    assert.equal(await exists(wrongDestination), false);

    const emptyDestination = path.join(base, 'empty-open');
    const empty = await invoke([
      'secure-transport', 'open', '--package', packagePath, '--workspace', 'sealed', '--output', emptyDestination, '--password-stdin'
    ], '');
    assert.equal(empty.code, 1);
    assert.equal(jsonLine(empty.stderr).state, 'locked');
    assert.equal(await exists(emptyDestination), false);

    const protectedFile = bundle.files.find((file) => String(file.path).endsWith('.protected.bin'));
    assert.ok(protectedFile);
    const tamperedBytes = Uint8Array.from(packageFileByteView(protectedFile));
    tamperedBytes[Math.floor(tamperedBytes.length / 2)] ^= 0x01;
    const tamperedFiles = bundle.files.map((file) => file === protectedFile ? { ...file, data: tamperedBytes, content: undefined } : file);
    const tamperedPackage = path.join(base, 'tampered.zip');
    await writeFile(tamperedPackage, exportFileMapZipUint8Array(tamperedFiles));
    const tamperedDestination = path.join(base, 'tampered-open');
    const tampered = await invoke([
      'secure-transport', 'open', '--package', tamperedPackage, '--workspace', 'sealed', '--output', tamperedDestination, '--password-stdin'
    ], correctPassword);
    assert.equal(tampered.code, 1);
    assert.equal(await exists(tamperedDestination), false);

    const destination = path.join(base, 'opened');
    const opened = await invoke([
      'secure-transport', 'open', '--package', packagePath, '--workspace', 'sealed', '--output', destination, '--password-stdin'
    ], correctPassword);
    assert.equal(opened.code, 0, opened.stderr);
    assert.equal(opened.stderr, '');
    assert.equal(jsonLine(opened.stdout).state, 'opened-qualified');
    assertByteTreesEqual(await byteTree(destination), await byteTree(fixture.sealedRoot));

    const conflictDestination = path.join(base, 'conflict');
    await mkdir(conflictDestination);
    await writeFile(path.join(conflictDestination, 'sentinel.txt'), 'unchanged', 'utf8');
    const conflict = await invoke([
      'secure-transport', 'open', '--package', packagePath, '--workspace', 'sealed', '--output', conflictDestination, '--password-stdin'
    ], correctPassword);
    assert.equal(conflict.code, 1);
    assert.equal(jsonLine(conflict.stderr).code, 'open-destination-conflict');
    assert.equal(await readFile(path.join(conflictDestination, 'sentinel.txt'), 'utf8'), 'unchanged');
    assert.deepEqual(await readdir(conflictDestination), ['sentinel.txt']);

    const routePlanPath = path.join(base, 'route-seal-plan.json');
    await writeFile(routePlanPath, `${JSON.stringify({ ...fixture.plan, sealedWorkspaceId: 'route' }, null, 2)}\n`, 'utf8');
    const routePackagePath = path.join(base, 'route-sealed.zip');
    const routeSeal = await invoke([
      'secure-transport', 'seal', '--plan', routePlanPath, '--output', routePackagePath, '--password-stdin'
    ], correctPassword);
    assert.equal(routeSeal.code, 1);
    assert.equal(await exists(routePackagePath), false);
    assert.match(jsonLine(routeSeal.stderr).reason, /route-workspace-must-remain-clear|secure-workspace-preparation-blocked/);

    const argvSecret = 'must-not-be-echoed-from-argv';
    const argvRejected = await invoke([
      'secure-transport', 'open', '--package', packagePath, '--workspace', 'sealed', '--output', path.join(base, 'argv-open'), `--password=${argvSecret}`
    ]);
    assert.equal(argvRejected.code, 1);
    assert.equal(jsonLine(argvRejected.stderr).code, 'password-on-argv-forbidden');
    assert.equal(argvRejected.stderr.includes(argvSecret), false);

    const emptySealPackage = path.join(base, 'empty-seal.zip');
    const emptySeal = await invoke([
      'secure-transport', 'seal', '--plan', fixture.planPath, '--output', emptySealPackage, '--password-stdin'
    ], '');
    assert.equal(emptySeal.code, 1);
    assert.equal(await exists(emptySealPackage), false);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
});
