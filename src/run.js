import { CliFailure, openSecureTransportPackage, readPasswordInput, sealSecureTransportPackage } from './secure-transport.js';

const HELP = `Tiinex CLI

Usage:
  tiinex secure-transport seal --plan <plan.json> --output <package.zip> --password-stdin
  tiinex secure-transport open --package <package.zip> --workspace <id> --output <directory> --password-stdin [--slot <id>]
  tiinex --help

Password input:
  --password-stdin reads the exact UTF-8 bytes from standard input. Password text is never accepted as a command-line argument.
  Use a non-echoing producer or printf without a trailing newline when the newline is not part of the password.

Seal plan fields:
  routeWorkspace: { id, root, workspaceTargetPath, title? }
  handoffPath: route-Workspace-relative Handoff path
  requiredContextWorkspaces: [{ id, root, workspaceTargetPath, title? }, ...]
  sealedWorkspaceId: exactly one non-route Workspace id to password-seal
  slotId?: password recipient slot id (default: password)
  recipientHint?: non-secret recipient hint
  createdAt?: package artifact timestamp; current UTC is used when omitted
`;

export async function runCli(argv = [], io = {}) {
  const stdin = io.stdin || process.stdin;
  const stdout = io.stdout || process.stdout;
  const stderr = io.stderr || process.stderr;
  try {
    const args = [...argv].map(String);
    rejectPasswordArgv(args);
    if (!args.length || args[0] === '--help' || args[0] === '-h' || args[0] === 'help') {
      stdout.write(HELP);
      return 0;
    }
    if (args[0] !== 'secure-transport') throw new CliFailure('command-unrecognized');
    const operation = args[1] || '';
    if (operation === '--help' || operation === '-h' || operation === 'help') {
      stdout.write(HELP);
      return 0;
    }
    if (operation === 'seal') {
      const options = parseOptions(args.slice(2), new Set(['--plan', '--output']), new Set(['--password-stdin']));
      requirePasswordStdin(options);
      const password = await readPasswordInput(stdin);
      const result = await sealSecureTransportPackage({
        planPath: options.values.get('--plan'),
        outputPath: options.values.get('--output'),
        password
      });
      writeJson(stdout, result);
      return 0;
    }
    if (operation === 'open') {
      const options = parseOptions(args.slice(2), new Set(['--package', '--workspace', '--output', '--slot']), new Set(['--password-stdin']));
      requirePasswordStdin(options);
      const password = await readPasswordInput(stdin);
      const result = await openSecureTransportPackage({
        packagePath: options.values.get('--package'),
        workspaceId: options.values.get('--workspace'),
        outputPath: options.values.get('--output'),
        slotId: options.values.get('--slot'),
        password
      });
      writeJson(stdout, result);
      return 0;
    }
    throw new CliFailure('secure-transport-operation-unrecognized');
  } catch (error) {
    const failure = sanitizeFailure(error);
    writeJson(stderr, failure);
    return 1;
  }
}

function rejectPasswordArgv(args) {
  for (const token of args) {
    if (/^--(?:authorization-)?password(?:=|$)/i.test(token) || /^--password-(?:value|text)(?:=|$)/i.test(token)) {
      throw new CliFailure('password-on-argv-forbidden');
    }
  }
}

function parseOptions(tokens, valueOptions, flagOptions) {
  const values = new Map();
  const flags = new Set();
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (flagOptions.has(token)) {
      if (flags.has(token)) throw new CliFailure('option-duplicate');
      flags.add(token);
      continue;
    }
    const equals = token.indexOf('=');
    const key = equals > 0 ? token.slice(0, equals) : token;
    if (!valueOptions.has(key)) throw new CliFailure('option-unrecognized');
    if (values.has(key)) throw new CliFailure('option-duplicate');
    const value = equals > 0 ? token.slice(equals + 1) : tokens[++index];
    if (value === undefined || value === '' || value.startsWith('--')) throw new CliFailure('option-value-required');
    values.set(key, value);
  }
  return { values, flags };
}

function requirePasswordStdin(options) {
  if (!options.flags.has('--password-stdin')) throw new CliFailure('password-stdin-required');
}

function sanitizeFailure(error) {
  if (error instanceof CliFailure) return Object.freeze({ state: error.state || 'failed', reason: error.reason || error.code, code: error.code });
  return Object.freeze({ state: 'failed', reason: 'unexpected-cli-failure', code: 'unexpected-cli-failure' });
}

function writeJson(stream, value) {
  stream.write(`${JSON.stringify(value)}\n`);
}
