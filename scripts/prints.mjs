/**
 * Prints das cenas da sonda.
 *
 * Reaproveita o mesmo palco que a sonda de layout mede — `window.sonda.ir(n)` —
 * em vez de montar um segundo harness. Duas montagens divergiriam, e aí o print
 * mostraria uma tela que a sonda não mediu.
 *
 * Uso:
 *   node scripts/prints.mjs "N1.04"
 *   PRINTS_CLICK='[data-recipientes-verify]' PRINTS_SUFFIX='_verificado' \
 *     node scripts/prints.mjs "GM.12 F50 massa/capacidade (nível 3)"
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "playwright-core";

const PORTA = 5198;
const BASE = `http://localhost:${PORTA}/sonda/`;
const OUT = process.env.PRINTS_OUT ?? "/tmp/prints";
const filtro = process.argv[2] ?? "";
const CLICK_SELECTOR = process.env.PRINTS_CLICK ?? "";
const CLICK_WAIT_MS = Number(process.env.PRINTS_CLICK_WAIT_MS ?? 1100);
const SUFFIX = process.env.PRINTS_SUFFIX ?? (CLICK_SELECTOR ? "_apos_interacao" : "");
fs.mkdirSync(OUT, { recursive: true });

const vite = spawn("npx", ["vite", "--port", String(PORTA), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"], detached: true,
});
await new Promise((ok, no) => {
  const t = setTimeout(() => no(new Error("vite não subiu")), 60000);
  vite.stdout.on("data", d => { if (String(d).includes("ready in")) { clearTimeout(t); ok(); } });
});

// Nunca congele a revisão do navegador neste script. `playwright-core` sabe qual
// Chromium é compatível com a versão instalada; um caminho fixo virou uma
// armadilha silenciosa quando o projeto avançou da revisão 1194 para a 1234.
// `PRINTS_CHROME` continua disponível para uma bancada que precise apontar para
// um executável específico sem alterar o repositório.
const CHROME = process.env.PRINTS_CHROME || chromium.executablePath();
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  // A largura é escolhível: `PRINTS_LARGURA=320 node scripts/prints.mjs "..."`.
  // Olhar a mesma cena em 320 e em 900 é o que mostra o que a sonda mede e o
  // que ela não mede — ela acusa vazamento, não acusa "ficou pequeno demais".
  viewport: { width: Number(process.env.PRINTS_LARGURA ?? 390), height: 640 }, deviceScaleFactor: 2,
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.sonda?.total > 0, { timeout: 30000 });

// A página da sonda expõe TODOS os nomes de tomada de uma vez. Filtramos antes
// de renderizar, porque cada visita custa animação + espera. E o nome inclui a
// semente: para INSPEÇÃO humana queremos uma imagem por CENA, não oito cópias
// quase iguais do mesmo estado. A sonda continua medindo todas as sementes; o
// print é a lupa humana, não o portão estatístico.
const nomes = await page.evaluate(() => window.sonda.nomes());
const vistos = new Set();
const alvos = [];
for (let i = 0; i < nomes.length; i += 1) {
  const nomeCompleto = nomes[i];
  if (filtro && !nomeCompleto.includes(filtro)) continue;
  const nomeDaCena = nomeCompleto.replace(/ \[semente .*/, "");
  if (vistos.has(nomeDaCena)) continue;
  vistos.add(nomeDaCena);
  alvos.push({ indice: i, nome: nomeDaCena });
}

const feitos = [];
for (const { indice, nome } of alvos) {
  await page.evaluate(n => window.sonda.ir(n), indice);
  await page.waitForTimeout(320);

  // Estados intermediários eram um ponto cego do QA: a tela inicial podia estar
  // impecável e o feedback que ENSINA ficar quebrado. A opção é genérica para
  // qualquer palco: se o seletor existir e estiver visível, clica antes do print.
  let interagiu = false;
  if (CLICK_SELECTOR) {
    const alvo = page.locator(CLICK_SELECTOR).first();
    if (await alvo.count() && await alvo.isVisible()) {
      await alvo.click();
      await page.waitForTimeout(CLICK_WAIT_MS);
      interagiu = true;
    }
  }

  const sufixo = interagiu ? SUFFIX : "";
  const arq = `${OUT}/${nome.replace(/[^\w.]+/g, "_")}${sufixo}.png`;
  await page.screenshot({ path: arq });
  feitos.push({ nome, arq, interagiu });
  console.log("print", arq, interagiu ? `(clicou ${CLICK_SELECTOR})` : "");
}
await browser.close();
try { process.kill(-vite.pid, "SIGKILL"); } catch { vite.kill("SIGKILL"); }
console.log(`${feitos.length} print(s)`);