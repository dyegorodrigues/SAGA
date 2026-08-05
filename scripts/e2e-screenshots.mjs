// Verificacao visual E2E: sobe o app (npm run dev), abre no Chromium headless com ?e2e=1,
// clica pelo fluxo e salva screenshots. Requer: npm i -D playwright-core. Uso: node scripts/e2e-screenshots.mjs
import { chromium } from "playwright-core";
import fs from "node:fs";
const OUT = process.env.SHOTS_OUT ?? "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });
const seed = { kids: [{ id: "k1", name: "Heitor", avatar: "🦸", grade: "ano1", theme: "classico" }],
  progress: {}, coins: { k1: 20 }, album: {}, log: {}, sound: false, customTracks: [] };
const log = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 420, height: 820 }, deviceScaleFactor: 2 });
await ctx.addInitScript((s) => localStorage.setItem("mk-state-v1", JSON.stringify(s)), seed);
const page = await ctx.newPage();
page.on("pageerror", (e) => log.push("PAGE ERROR: " + String(e).slice(0, 160)));
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); log.push("shot " + n); };
const clickText = async (t, to=3000) => { const el=page.getByText(t,{exact:false}).first(); if(await el.count()>0){ await el.scrollIntoViewIfNeeded().catch(()=>{}); await el.click({timeout:to}); return true;} return false; };

await page.goto("http://localhost:3000/?e2e=1", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3500); // deixa o onAuthStateChanged disparar/falhar primeiro
// entrar como visitante (pós-auth, pra não ser resetado)
for (let i=0;i<4;i++){ if(await clickText("Começar sem Conta").catch(()=>false)){ log.push("visitor click "+i); } await page.waitForTimeout(1500);
  if((await page.getByText("Heitor",{exact:false}).count())>0){ log.push("reached pick"); break; } }
await shot("02-pick");
if(await clickText("Heitor",4000).catch(()=>false)) log.push("clicked kid"); else log.push("kid not found");
await page.waitForTimeout(1800); await shot("03-home");
await page.mouse.wheel(0,780); await page.waitForTimeout(500); await shot("04-home-tracks");
let track=null;
for (const name of ["Formas","Gráficos","Dinheiro","Probleminhas","Padrões","Somar","Dezenas","Contar"]) {
  if(await clickText(name).catch(()=>false)){ track=name; log.push("track "+name); break; } }
await page.waitForTimeout(2200); await shot("05-exercise");
try { const btns=page.locator("button"); const n=await btns.count(); log.push("btns "+n);
  for (let i=0;i<n;i++){ const b=btns.nth(i); const box=await b.boundingBox();
    if (box && box.y>430 && box.height>44){ await b.click({timeout:2000}); log.push("answered idx "+i+" y="+Math.round(box.y)); break; } } } catch(e){ log.push("ans "+e.message.slice(0,50)); }
await page.waitForTimeout(1600); await shot("06-after-answer");
await browser.close();
fs.writeFileSync(`${OUT}/log.txt`, log.join("\n")); console.log("TRACK="+track+"\n"+log.join("\n"));
