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

/**
 * Exceção única e estreita: as fontes da identidade visual, hospedadas
 * localmente.
 *
 * O `@import` do Google Fonts em `src/index.css` já derrubou o CI mais de uma
 * vez — na W30 foram 27 HTTP 404 em 27 navegações da sonda F15, 100% de falha
 * da dependência naquela janela. E o dano maior não é o CI: é a criança em
 * wi-fi ruim de escola abrindo o app sem a tipografia.
 *
 * Hospedar o arquivo não muda um pixel do que a criança vê — `Fredoka` e
 * `Nunito` continuam sendo as famílias escolhidas pelo dono do projeto. Trocar
 * de família continua sendo decisão dele; de onde o byte vem é infraestrutura.
 *
 * A exceção é deliberadamente mínima: **só `public/fonts/`, só `.woff2`**.
 * Qualquer outro binário, em qualquer outro lugar, continua barrado — inclusive
 * `.ttf` e `.woff` dentro da própria pasta.
 */
const ehFonteLocal = (caminho) =>
  caminho.startsWith("public/fonts/") && extname(caminho).toLowerCase() === ".woff2";

const blocked = [];
for (const path of paths) {
  if (!existsSync(path)) continue;
  if (ehFonteLocal(path)) continue;
  const bytes = readFileSync(path);
  if (blockedExtensions.has(extname(path).toLowerCase()) || bytes.includes(0)) blocked.push(path);
}

if (blocked.length) {
  console.error("[PR TEXT GUARD] Arquivos binários incompatíveis com o criador de PR:");
  blocked.forEach(path => console.error(`- ${path}`));
  process.exit(1);
}

console.log(`[PR TEXT GUARD] Aprovado: ${paths.size} arquivo(s) alterado(s), nenhum binário.`);
