/**
 * `node scripts/gerar-icone-do-app.mjs` — o ícone do SAGA na tela do tablet.
 *
 * ## Por que existe
 *
 * Quando a criança usa "adicionar à tela de início", o sistema pede um PNG. Um
 * SVG não serve, e sem PNG o Android e o iPad desenham por conta própria: uma
 * letra num círculo cinza, ou uma miniatura borrada da página. Depois de todo
 * o trabalho para o app ter cara própria, o primeiro contato — o ícone na tela
 * do tablet, antes de qualquer toque — seria a única parte sem desenho nenhum.
 *
 * ## Por que um script, e não três PNGs comitados na mão
 *
 * O ícone é DERIVADO: raposa do `public/icones/tutor.svg` sobre o azul do app.
 * Comitar só o resultado faria a origem e a cópia se separarem no primeiro dia
 * em que alguém trocasse a arte. Aqui o PNG é gerado do mesmo arquivo que a
 * barra de abas usa, e regerar é um comando.
 *
 * Desenha no Chromium (o mesmo do `npm run passeio`) e fotografa. É o
 * conversor de SVG para PNG que esta máquina já tem, sem dependência nova.
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const CHROMIUM = process.env.CHROME_BIN || "/opt/pw-browsers/chromium";

/** Azul do SAGA. O mesmo do cartão principal da casa da criança. */
const FUNDO = "linear-gradient(145deg,#38BDF8 0%,#2563EB 55%,#4F46E5 100%)";

/**
 * Os tamanhos que os sistemas pedem.
 *
 * `margem` é a fração da caixa que sobra em volta da raposa. O ícone
 * "maskable" do Android pode ser recortado num círculo, num quadrado
 * arredondado ou numa gota, e o recorte come até 20% de cada lado: por isso o
 * de 512 respira mais que o de 192.
 */
const TAMANHOS = [
  { arquivo: "icone-192.png", lado: 192, margem: 0.16 },
  { arquivo: "icone-512.png", lado: 512, margem: 0.22 },
  { arquivo: "icone-apple-180.png", lado: 180, margem: 0.14 },
];

const raposa = readFileSync(resolve(RAIZ, "public/icones/tutor.svg"), "utf8");

const navegador = await chromium.launch({ executablePath: CHROMIUM });
for (const { arquivo, lado, margem } of TAMANHOS) {
  const pagina = await navegador.newPage({ viewport: { width: lado, height: lado } });
  const desenho = Math.round(lado * (1 - margem * 2));
  await pagina.setContent(`<!doctype html><meta charset="utf-8">
    <style>
      html,body{margin:0;padding:0;width:${lado}px;height:${lado}px;overflow:hidden}
      body{background:${FUNDO};display:grid;place-items:center}
      svg{width:${desenho}px;height:${desenho}px;filter:drop-shadow(0 ${Math.round(lado / 60)}px ${Math.round(lado / 30)}px rgba(8,17,40,.30))}
    </style>${raposa}`);
  await pagina.waitForTimeout(150);
  const png = await pagina.screenshot({ omitBackground: false });
  writeFileSync(resolve(RAIZ, "public", arquivo), png);
  console.log(`${arquivo}  ${lado}×${lado}  ${(png.length / 1024).toFixed(1)} KB`);
  await pagina.close();
}
await navegador.close();
