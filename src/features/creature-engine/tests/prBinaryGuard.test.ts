import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('PR binary guard wiring', () => {
  it('keeps PMD binary assets ignored and checked before PR preparation', () => {
    const gitignore = readFileSync('.gitignore', 'utf8');
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

    expect(gitignore).toContain('public/assets/creatures/pokemon-pmd/*.png');
    expect(gitignore).toContain('public/assets/creatures/pokemon-pmd/*.webp');
    expect(packageJson.scripts['pr:prepare']).toBe(
      'npm run assets:pokemon-pmd:clean && npm run pr:check && npm run assets:pokemon-pmd:verify',
    );
    expect(packageJson.scripts['assets:pokemon-pmd:verify']).toBe('node scripts/guard-pr-binaries.cjs');
  });
});
