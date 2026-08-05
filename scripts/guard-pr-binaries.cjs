const { execFileSync } = require('node:child_process');
const { extname } = require('node:path');

const base = process.env.PR_BASE || 'origin/main';
const blockedExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.zip']);

function gitLines(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function assertNoBlocked(label, paths) {
  const blocked = paths.filter((filePath) => blockedExtensions.has(extname(filePath).toLowerCase()));
  if (blocked.length > 0) {
    console.error(`[PMD BINARY GUARD] ${label} contém arquivos binários proibidos:`);
    for (const filePath of blocked) console.error(`- ${filePath}`);
    process.exit(1);
  }
}

const diffPaths = gitLines(['diff', '--name-only', `${base}...HEAD`]);
assertNoBlocked(`Diff ${base}...HEAD`, diffPaths);

const commits = gitLines(['rev-list', `${base}..HEAD`]);
for (const commit of commits) {
  const commitPaths = gitLines(['diff-tree', '--no-commit-id', '--name-only', '-r', commit]);
  assertNoBlocked(`Commit ${commit}`, commitPaths);
}

console.log(`[PMD BINARY GUARD] Aprovado: ${diffPaths.length} arquivo(s), ${commits.length} commit(s), nenhum PNG/JPG/GIF/WEBP/PDF/ZIP novo.`);
