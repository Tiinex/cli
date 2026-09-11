import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('package identity, executable, runtime Core dependency, and public exports are qualified', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const policy = JSON.parse(await readFile(new URL('../.github/release-policy.json', import.meta.url), 'utf8'));
  assert.equal(pkg.name, '@tiinex/cli');
  assert.equal(pkg.repository.url, 'git+https://github.com/Tiinex/cli.git');
  assert.equal(policy.repository, 'Tiinex/cli');
  assert.equal(pkg.bin.tiinex, './src/cli.js');
  assert.equal(pkg.dependencies['@tiinex/core'], '0.1.1');
  assert.equal(pkg.devDependencies, undefined);

  const publicModule = await import('../src/index.js');
  assert.deepEqual(Object.keys(publicModule).sort(), [
    'CliFailure',
    'openSecureTransportPackage',
    'readPasswordInput',
    'runCli',
    'sealSecureTransportPackage'
  ]);
});

test('CLI source imports Core only through package-exported public subpaths', async () => {
  const corePackage = JSON.parse(await readFile(new URL('../node_modules/@tiinex/core/package.json', import.meta.url), 'utf8'));
  const srcDir = new URL('../src/', import.meta.url);
  const names = (await readdir(srcDir)).filter((name) => name.endsWith('.js'));
  const specifiers = new Set();
  for (const name of names) {
    const source = await readFile(new URL(name, srcDir), 'utf8');
    for (const match of source.matchAll(/from\s+['"](@tiinex\/core[^'"]*)['"]/g)) specifiers.add(match[1]);
  }
  assert.ok(specifiers.size > 0);
  for (const specifier of specifiers) {
    const suffix = specifier.slice('@tiinex/core'.length);
    const exportKey = suffix ? `.${suffix}` : '.';
    assert.ok(Object.hasOwn(corePackage.exports, exportKey), `${specifier} must be a declared @tiinex/core package export`);
  }
});
