#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const { readFileSync, existsSync } = require("node:fs");
const { extname } = require("node:path");

const base = process.env.PR_BASE || "origin/main";
const blockedExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip",
  ".gz", ".mp3", ".wav", ".mp4", ".mov", ".woff", ".woff2", ".ttf",
]);

function gitNames(args) {
  try {
    return execFileSync("git", args, { encoding: "buffer" })
      .toString("utf8")
      .split("\0")
      .filter(Boolean);
  } catch {
    return [];
  }
}

const paths = new Set([
  ...gitNames(["diff", "--name-only", "-z", `${base}...HEAD`]),
  ...gitNames(["diff", "--name-only", "-z"]),
  ...gitNames(["diff", "--cached", "--name-only", "-z"]),
  ...gitNames(["ls-files", "--others", "--exclude-standard", "-z"]),
]);

const blocked = [];
for (const path of paths) {
  if (!existsSync(path)) continue;
  const bytes = readFileSync(path);
  if (blockedExtensions.has(extname(path).toLowerCase()) || bytes.includes(0)) blocked.push(path);
}

if (blocked.length) {
  console.error("[PR TEXT GUARD] Arquivos binários incompatíveis com o criador de PR:");
  blocked.forEach(path => console.error(`- ${path}`));
  process.exit(1);
}

console.log(`[PR TEXT GUARD] Aprovado: ${paths.size} arquivo(s) alterado(s), nenhum binário.`);
