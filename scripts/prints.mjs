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
  viewport: { width: 390, height: 640 }, deviceScaleFactor: 2,
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.sonda?.total > 0, { timeout: 30000 });

const total = await page.evaluate(() => window.sonda.total);
const feitos = [];
for (let i = 0; i < total; i += 1) {
  await page.evaluate(n => window.sonda.ir(n), i);
  await page.waitForTimeout(320);
  const nome = await page.evaluate(() => window.sonda.nome());
  if (filtro && !nome.includes(filtro)) continue;
  if (feitos.some(f => f.nome === nome)) continue; // uma semente por cena
  const arq = `${OUT}/${nome.replace(/[^\w.]+/g, "_")}.png`;
  await page.screenshot({ path: arq });
  feitos.push({ nome, arq });
  console.log("print", arq);
}
await browser.close();
try { process.kill(-vite.pid, "SIGKILL"); } catch { vite.kill("SIGKILL"); }
console.log(`${feitos.length} print(s)`);
