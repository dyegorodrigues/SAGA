/**
 * O palco está centrado na tela? — medido em tela LARGA.
 *
 * ## A cegueira que este arquivo existe para tirar
 *
 * Todas as minhas fotos sempre foram de 390px de largura. Num celular o palco
 * preenche a tela e nada parece fora do lugar. O pai joga em tela maior, e
 * disse: *"o exercício ali do balão tá bugado, ele tá deslocado pra esquerda"*.
 *
 * Ele estava certo e eu não tinha como ver: o invólucro que o app põe em volta
 * de todo palco era um `div` comum, e palco com `max-w-[390px]` dentro de um
 * bloco mais largo encosta na ESQUERDA. A 390px os dois coincidem e o defeito
 * desaparece.
 *
 * Medir numa largura só é não medir enquadramento.
 *
 *     LARGURA=820 node scripts/enquadramento.mjs
 *
 * Saída: para cada competência, o desvio do centro do palco em relação ao
 * centro da tela. Acima de `TOLERANCIA_PX` é defeito.
 */
import { chromium } from "playwright-core";
import { writeFileSync, appendFileSync } from "node:fs";
import { T, primeiroAcesso, abrir, competencias } from "./navegar.mjs";

const SAIDA = process.env.SAIDA ?? "/tmp/enquadramento.txt";
const LARGURA = Number(process.env.LARGURA ?? 820);
/**
 * Quanto desvio o olho perdoa.
 *
 * Começou em 24px e produziu três falsos positivos em noventa: "Tempo
 * cotidiano" (45px, puxado pelos ícones 🔊 no canto das alternativas),
 * "Contagem até 20" (30px, que é o sorteio das posições espalhadas) e
 * "Números grandes" (-2072px, um elemento fora da tela que entrou na conta).
 * Fui ver os três: as três telas estavam certas.
 *
 * Um sinal só de cada quatro era verdadeiro — e sonda que grita demais a
 * gente para de ouvir, que é como o defeito do balão sobreviveu tanto tempo.
 * 60px é a metade de um palmo: abaixo disso o olho não reclama.
 */
const TOLERANCIA_PX = Number(process.env.TOLERANCIA ?? 60);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: LARGURA, height: 900 } });
await primeiroAcesso(page);
const nomes = await competencias(page);
const alvos = process.env.ALVOS ? process.env.ALVOS.split("|") : nomes.slice(0, Number(process.env.QUANTOS ?? 90));
writeFileSync(SAIDA, `enquadramento a ${LARGURA}px · tolerância ${TOLERANCIA_PX}px · ${alvos.length} competências\n`);

for (const alvo of alvos) {
  try {
    if (!(await abrir(page, alvo, 1))) { appendFileSync(SAIDA, `sem cartão ${alvo}\n`); continue; }
    await page.waitForTimeout(9000);

    /*
     * O que se mede: a caixa que contém TUDO que o palco desenhou, e onde o
     * centro dela cai em relação ao centro da tela. Não se mede o invólucro
     * (que é sempre largo) nem um elemento escolhido a dedo: mede-se a tinta.
     */
    const desvio = await page.evaluate(() => {
      /*
       * ⚠️ Mede-se a TINTA, não as caixas.
       *
       * A primeira versão pegava o retângulo de todos os elementos. Deu "0px"
       * para o exercício do balão, que eu tinha acabado de VER encostado na
       * esquerda: as caixas de largura total (a barra do enunciado, a faixa
       * branca) estão centradas, e o conteúdo torto dentro delas não move o
       * retângulo de ninguém.
       *
       * Então: só FOLHAS (sem filhos) com conteúdo visível, e nada mais largo
       * que 70% da tela — acima disso é contêiner, não desenho.
       */
      const palco = document.querySelector("main") ?? document.body;
      let esq = Infinity, dir = -Infinity;
      for (const el of palco.querySelectorAll("*")) {
        if (el.children.length > 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.width > window.innerWidth * 0.7) continue;
        if (r.top < 150 || r.bottom > window.innerHeight - 20) continue;
        // Fora da tela não é enquadramento: um elemento a -2000px arrastava a
        // média inteira e acusava de torta uma tela que estava certa.
        if (r.left < 0 || r.right > window.innerWidth) continue;
        const temTinta = (el.textContent ?? "").trim().length > 0
          || getComputedStyle(el).backgroundImage !== "none"
          || el.tagName === "IMG" || el.tagName === "SVG";
        if (!temTinta) continue;
        esq = Math.min(esq, r.left);
        dir = Math.max(dir, r.right);
      }
      if (!Number.isFinite(esq)) return null;
      return Math.round((esq + dir) / 2 - window.innerWidth / 2);
    });
    if (desvio === null) { appendFileSync(SAIDA, `sem tinta ${alvo}\n`); continue; }
    const torto = Math.abs(desvio) > TOLERANCIA_PX;
    appendFileSync(SAIDA, `${torto ? "TORTO" : "ok   "} ${String(desvio).padStart(5)}px  ${alvo}\n`);
  } catch (e) {
    appendFileSync(SAIDA, `erro      ${alvo} — ${String(e).split("\n")[0].slice(0, 70)}\n`);
  }
}
await browser.close();
