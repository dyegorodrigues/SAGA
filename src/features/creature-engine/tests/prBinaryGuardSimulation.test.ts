import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const guardSource = join(process.cwd(), 'scripts/guard-pr-binaries.cjs');

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' });
}

function nodeGuard(cwd: string, base = 'main'): { status: number; output: string } {
  try {
    const output = execFileSync('node', ['scripts/guard-pr-binaries.cjs'], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, PR_BASE: base },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, output };
  } catch (error) {
    const failure = error as { status?: number; stdout?: Buffer | string; stderr?: Buffer | string };
    return {
      status: failure.status ?? 1,
      output: `${failure.stdout?.toString() ?? ''}${failure.stderr?.toString() ?? ''}`,
    };
  }
}

function createRepo(): string {
  const cwd = mkdtempSync(join(tmpdir(), 'saga-pmd-guard-'));
  mkdirSync(join(cwd, 'scripts'), { recursive: true });
  copyFileSync(guardSource, join(cwd, 'scripts/guard-pr-binaries.cjs'));
  git(cwd, ['init', '-b', 'main']);
  git(cwd, ['config', 'user.email', 'saga@example.test']);
  git(cwd, ['config', 'user.name', 'SAGA Test']);
  writeFileSync(join(cwd, 'README.md'), 'base textual\n');
  git(cwd, ['add', '.']);
  git(cwd, ['commit', '-m', 'base']);
  return cwd;
}

describe('PMD PR binary guard simulation', () => {
  it('passes when the branch adds only text files', () => {
    const cwd = createRepo();
    git(cwd, ['checkout', '-b', 'feature-text-only']);
    writeFileSync(join(cwd, 'creature-notes.md'), 'sem binarios\n');
    git(cwd, ['add', '.']);
    git(cwd, ['commit', '-m', 'text only']);

    const result = nodeGuard(cwd);

    expect(result.status).toBe(0);
    expect(result.output).toContain('nenhum PNG/JPG/GIF/WEBP/PDF/ZIP novo');
  });

  it('fails when a new commit contains a forbidden PNG path', () => {
    const cwd = createRepo();
    git(cwd, ['checkout', '-b', 'feature-with-png']);
    mkdirSync(join(cwd, 'public/assets/creatures/pokemon-pmd'), { recursive: true });
    writeFileSync(join(cwd, 'public/assets/creatures/pokemon-pmd/bulbasaur.png'), 'fake png payload');
    git(cwd, ['add', '.']);
    git(cwd, ['commit', '-m', 'add png']);

    const result = nodeGuard(cwd);

    expect(result.status).toBe(1);
    expect(result.output).toContain('arquivos binários proibidos');
    expect(result.output).toContain('public/assets/creatures/pokemon-pmd/bulbasaur.png');
  });
});
