/**
 * Prints das cenas da sonda.
 *
 * Reaproveita o mesmo palco que a sonda de layout mede — `window.sonda.ir(n)` —
 * em vez de montar um segundo harness. Duas montagens divergiriam, e aí o print
 * mostraria uma tela que a sonda não mediu.
 *
 * Uso: node scripts/prints.mjs "N1.04"   (filtra pelo nome da cena)
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "playwright-core";

const PORTA = 5198;
const BASE = `http://localhost:${PORTA}/sonda/`;
const OUT = process.env.PRINTS_OUT ?? "/tmp/prints";
const filtro = process.argv[2] ?? "";
fs.mkdirSync(OUT, { recursive: true });

const vite = spawn("npx", ["vite", "--port", String(PORTA), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"], detached: true,
});
await new Promise((ok, no) => {
  const t = setTimeout(() => no(new Error("vite não subiu")), 60000);
  vite.stdout.on("data", d => { if (String(d).includes("ready in")) { clearTimeout(t); ok(); } });
});

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
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

// A página da sonda já expõe TODOS os nomes de tomada de uma vez. Usá-los aqui
// é a diferença entre "filtrar antes de medir" e visitar centenas de tomadas
// para só então descobrir que não eram da competência pedida. Além de lento,
// o caminho antigo tornava o laço print→olhar→corrigir impraticável conforme o
// catálogo crescia. A sonda continua intacta; só deixamos de renderizar o que
// sabemos de antemão que será descartado.
const nomes = await page.evaluate(() => window.sonda.nomes());
const vistos = new Set();
const alvos = [];
for (let i = 0; i < nomes.length; i += 1) {
  const nome = nomes[i];
  if (filtro && !nome.includes(filtro)) continue;
  if (vistos.has(nome)) continue; // um print por cena: a primeira semente basta para olhar
  vistos.add(nome);
  alvos.push({ indice: i, nome });
}

const feitos = [];
for (const { indice, nome } of alvos) {
  await page.evaluate(n => window.sonda.ir(n), indice);
  await page.waitForTimeout(320);
  const arq = `${OUT}/${nome.replace(/[^\w.]+/g, "_")}.png`;
  await page.screenshot({ path: arq });
  feitos.push({ nome, arq });
  console.log("print", arq);
}
await browser.close();
try { process.kill(-vite.pid, "SIGKILL"); } catch { vite.kill("SIGKILL"); }
console.log(`${feitos.length} print(s)`);
