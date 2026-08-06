/**
 * Sonda de layout — mede o que o jsdom não mede.
 *
 * ---
 *
 * O Vitest roda no jsdom, e o jsdom **não faz layout**: toda caixa mede zero.
 * Por isso `render` + `getByText` encontram um rótulo mesmo quando ele está
 * impresso por baixo de um desenho, e nenhum dos 1074 testes viu o `MILHAR`
 * escondido atrás do cubão, a reta numérica rolando na horizontal ou o sapinho
 * tapando o número que a pergunta manda ler.
 *
 * Esta sonda abre cada cena num Chromium real, na largura do aparelho da
 * criança, e mede três coisas que só existem quando há layout:
 *
 * 1. **vazamento** — algo passa da largura do aparelho (Padrão Ouro §6.16)
 * 2. **colisão** — dois textos ocupam o mesmo pixel (§6.28)
 * 3. **invisível** — texto sem contraste contra o fundo que ele pinta em cima
 * 4. **coberto** — o centro de um texto pertence, na tela, a outro elemento
 *
 * Uso:
 *   npm run sonda            # falha o processo se houver achado
 *   npm run sonda -- --fotos # salva também um .png por cena
 *
 * **Não edite arquivos com a sonda rodando.** O vite recarrega a página, a cena
 * troca no meio da medição e a corrida morre — ou, pior, mede o código velho.
 *
 * A sonda NÃO substitui olhar a tela. Ela pega a classe de defeito que já
 * escapou três vezes; julgamento pedagógico continua sendo trabalho humano.
 */
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORTA = 5199;
const BASE = `http://localhost:${PORTA}/sonda/`;
const CHROME = process.env.SONDA_CHROME
  || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const SALVAR_FOTOS = process.argv.includes("--fotos");

/**
 * O laço de trabalho, ao lado do portão.
 *
 * - `npm run sonda` → 54 cenas × 8 sementes. É o PORTÃO, e continua igual.
 * - `npm run sonda -- N1.03` → só as cenas do N1.03.
 * - `SONDA_SEMENTES=1 npm run sonda -- N1.03` → uma semente. Segundos.
 *
 * Isto existe porque o instrumento virou gargalo: onze minutos por conserto
 * empurra quem está construindo a rodar o portão só no fim — e aí os defeitos
 * chegam todos juntos, que é o oposto do que a sonda foi feita para evitar.
 * O portão continua sendo as oito sementes; o que mudou é poder olhar antes.
 */
const FILTRO = process.argv.slice(2).find(a => !a.startsWith("--")) ?? "";
const SEMENTES = process.env.SONDA_SEMENTES ?? "";
const PASTA_FOTOS = process.env.SONDA_FOTOS || "/tmp/sonda-saga";

/**
 * A medição, executada DENTRO da página.
 *
 * Roda no contexto do navegador, onde nada deste arquivo existe: por isso todo
 * ajuste entra por parâmetro em vez de fechar sobre uma constante do módulo.
 *
 * - `largura`: a do aparelho, lida da própria página para sonda e cena não
 *   repetirem o número
 * - `folga`: sobra tolerada em px; abaixo disso é subpixel, não defeito
 * - `invasaoMinima`: fração da menor caixa que precisa ser invadida para valer
 *   como colisão — sem ela, o encosto de duas linhas de texto viraria achado
 */
function medir({ largura, folga, invasaoMinima }) {
  const visivel = (el) => {
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none") return false;
    if (Number(s.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  /** Elementos que pintam texto diretamente — não os contêineres deles. */
  const folhasDeTexto = [...document.querySelectorAll("body *")].filter((el) => {
    if (!visivel(el)) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    return [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0,
    );
  });

  const achados = [];
  const texto = (el) => (el.textContent || "").trim().slice(0, 24);

  // 1. Vazamento: qualquer coisa visível além da largura do aparelho.
  for (const el of [...document.querySelectorAll("body *")].filter(visivel)) {
    const r = el.getBoundingClientRect();
    if (r.right > largura + folga || r.left < -folga) {
      // Um pai que rola escondendo o filho é o mesmo defeito, então não
      // perdoamos overflow-x: auto — foi exatamente assim que a reta numérica
      // cortou o fim da contagem sem ninguém ver.
      achados.push({
        tipo: "vazamento",
        alvo: `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""}`,
        texto: texto(el),
        detalhe: `x de ${Math.round(r.left)} a ${Math.round(r.right)}, aparelho tem ${largura}`,
      });
      break; // o primeiro basta: o resto costuma ser o mesmo pai vazando
    }
  }

  // 2. Colisão entre textos.
  for (let i = 0; i < folhasDeTexto.length; i += 1) {
    for (let j = i + 1; j < folhasDeTexto.length; j += 1) {
      const a = folhasDeTexto[i];
      const b = folhasDeTexto[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const larg = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const alt = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (larg <= folga || alt <= folga) continue;
      const invasao = (larg * alt) / Math.min(ra.width * ra.height, rb.width * rb.height);
      if (invasao < invasaoMinima) continue;
      achados.push({
        tipo: "colisão",
        alvo: `"${texto(a)}" × "${texto(b)}"`,
        texto: "",
        detalhe: `${Math.round(invasao * 100)}% da menor caixa`,
      });
    }
  }

  // 3. Texto invisível: contraste insuficiente contra o fundo que ele pinta em cima.
  //
  // Foi assim que o botão CONFIRMAR de N1.07 ficou branco no branco: o código
  // interpolava um TOKEN DE COR (`var(--cor-...)`) dentro do `className`, onde
  // ele não pinta nada. O TypeScript não vê — string é string — e o teste de
  // acessibilidade do jsdom também não, porque lá nada tem cor computada.
  const canal = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const luz = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);

  // Ler a cor com regex quebrou em `oklch(...)`, que o Tailwind 4 emite: os três
  // números saíam como se fossem RGB e o contraste vinha 1.03:1 em texto que a
  // olho nu está perfeito. Pintar num canvas de 1px devolve o RGBA final seja
  // qual for o formato — e o navegador é a autoridade sobre a própria cor dele.
  const tinta = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const emRGBA = (css) => {
    tinta.clearRect(0, 0, 1, 1);
    tinta.fillStyle = "#000";
    tinta.fillStyle = css;
    tinta.fillRect(0, 0, 1, 1);
    return [...tinta.getImageData(0, 0, 1, 1).data];
  };

  /** O primeiro ancestral que realmente pinta um fundo opaco. */
  const fundoDe = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = emRGBA(getComputedStyle(n).backgroundColor);
      if (c[3] > 128) return c;
    }
    return [255, 255, 255, 255];
  };

  // Emoji não obedece a `color`: o glifo já vem colorido pela fonte. Medir
  // contraste nele acusa o sapinho branco sobre azul e não quer dizer nada.
  const soEmoji = (t) => /^[\p{Extended_Pictographic}\p{Emoji_Component}\s]+$/u.test(t);

  for (const el of folhasDeTexto) {
    const s = getComputedStyle(el);
    const conteudo = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join("").trim();
    if (!conteudo || soEmoji(conteudo)) continue;
    const frente = emRGBA(s.color);
    if (frente[3] < 128) continue;
    const atras = fundoDe(el);
    const [a, b] = [luz(frente), luz(atras)].sort((x, y) => y - x);
    const contraste = (a + 0.05) / (b + 0.05);
    // Texto grande (≥24px, ou ≥18.66px em negrito) passa com 3:1 pela WCAG.
    const px = parseFloat(s.fontSize);
    const grande = px >= 24 || (px >= 18.66 && Number(s.fontWeight) >= 700);
    const minimo = grande ? 3 : 4.5;
    if (contraste >= minimo) continue;
    achados.push({
      tipo: "invisível",
      alvo: `"${texto(el)}"`,
      texto: "",
      detalhe: `contraste ${contraste.toFixed(2)}:1, mínimo ${minimo}:1 — rgb(${frente.slice(0, 3)}) sobre rgb(${atras.slice(0, 3)})`,
    });
  }

  // 4. Texto coberto: quem manda no pixel do centro não é o próprio texto.
  for (const el of folhasDeTexto) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > largura) continue;
    const dono = document.elementFromPoint(cx, cy);
    if (!dono) continue;
    if (dono === el || el.contains(dono) || dono.contains(el)) continue;
    achados.push({
      tipo: "coberto",
      alvo: `"${texto(el)}"`,
      texto: "",
      detalhe: `coberto por ${dono.tagName.toLowerCase()} "${(dono.textContent || "").trim().slice(0, 20)}"`,
    });
  }

  return achados;
}

/**
 * Sobe o vite num GRUPO de processos próprio.
 *
 * `npx vite` é um pai que gera o vite de verdade como filho. Matar só o pai
 * deixa a porta ocupada, e a execução seguinte morre com "vite saiu com 1" —
 * aconteceu, e o pior é que a sonda anterior ficou reportando os resultados
 * ANTIGOS enquanto eu achava que estava medindo o código novo. Um `detached`
 * mais um kill no grupo inteiro (o `-pid`) fecham os dois.
 */
async function subirServidor() {
  const p = spawn("npx", ["vite", "--port", String(PORTA), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  const saida = [];
  p.stderr.on("data", (d) => saida.push(String(d)));
  await new Promise((ok, falha) => {
    const prazo = setTimeout(() => falha(new Error("vite não subiu em 40s")), 40000);
    p.stdout.on("data", (d) => {
      saida.push(String(d));
      if (String(d).includes("ready in")) { clearTimeout(prazo); ok(); }
    });
    p.on("exit", (c) => {
      clearTimeout(prazo);
      falha(new Error(`vite saiu com ${c}. Porta ${PORTA} ocupada?\n${saida.join("").slice(-400)}`));
    });
  });
  return p;
}

function derrubarServidor(p) {
  try { process.kill(-p.pid, "SIGKILL"); } catch { p.kill("SIGKILL"); }
}

const servidor = await subirServidor();
const navegador = await chromium.launch({ executablePath: CHROME });

let total = 0;
try {
  const pagina = await navegador.newPage({
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 2,
  });
  const erros = [];
  pagina.on("pageerror", (e) => erros.push(String(e).slice(0, 160)));

  await pagina.goto(BASE + (SEMENTES ? `?sementes=${SEMENTES}` : ""), { waitUntil: "networkidle" });
  await pagina.waitForFunction(() => window.sonda?.total > 0, { timeout: 30000 });
  const quantas = await pagina.evaluate(() => window.sonda.total);
  const largura = await pagina.evaluate(() => document.documentElement.clientWidth);

  if (SALVAR_FOTOS) fs.mkdirSync(PASTA_FOTOS, { recursive: true });

  // Quais tomadas visitar. Sem filtro, todas — é o portão.
  //
  // Com filtro, só as que interessam: `npm run sonda -- N1.03` mede uma
  // competência em segundos em vez de onze minutos. O filtro é escolhido ANTES
  // do laço, e não dentro dele, porque o custo da tomada é a espera de 1,5s
  // pela tela parar — visitar para depois descartar não economizaria nada.
  const nomes = await pagina.evaluate(() => window.sonda.nomes?.() ?? []);
  const alvos = [];
  for (let i = 0; i < quantas; i += 1) {
    if (FILTRO && !(nomes[i] ?? "").toLowerCase().includes(FILTRO.toLowerCase())) continue;
    alvos.push(i);
  }
  if (FILTRO && alvos.length === 0) {
    console.log(`nenhuma cena casa com "${FILTRO}". Cenas disponíveis:`);
    console.log([...new Set(nomes.map(n => n.replace(/ \[semente .*/, "")))].map(n => "  " + n).join("\n"));
    throw new Error(`filtro "${FILTRO}" não casou com cena nenhuma`);
  }
  if (FILTRO) console.log(`filtro "${FILTRO}": ${alvos.length} de ${quantas} tomadas\n`);

  for (const i of alvos) {
    await pagina.evaluate((n) => window.sonda.ir(n), i);
    // As peças entram escalonadas (0.1s por peça, até nove peças). Medir aos
    // 650ms fotografava o material no MEIO da animação: barras de alturas
    // diferentes, caixas ainda crescendo. A medida tem que ser da tela parada.
    await pagina.waitForTimeout(1500);
    const nome = await pagina.evaluate(() => window.sonda.nome());
    const achados = await pagina.evaluate(medir, { largura, folga: 1, invasaoMinima: 0.25 });

    if (SALVAR_FOTOS) {
      const arquivo = path.join(PASTA_FOTOS, `${String(i).padStart(2, "0")}-${nome.replace(/[^\w.]+/g, "_")}.png`);
      await pagina.screenshot({ path: arquivo, fullPage: true });
    }

    if (achados.length === 0) {
      console.log(`  ok   ${nome}`);
    } else {
      total += achados.length;
      console.log(`  FALHA ${nome}`);
      for (const a of achados) {
        console.log(`        ${a.tipo}: ${a.alvo} ${a.texto ? `(${a.texto}) ` : ""}— ${a.detalhe}`);
      }
    }
  }

  if (erros.length) {
    console.log("\nerros de página:\n" + erros.slice(0, 5).map((e) => "  " + e).join("\n"));
    total += erros.length;
  }
} finally {
  await navegador.close();
  derrubarServidor(servidor);
}

console.log(total === 0
  ? "\nSonda de layout: nenhuma cena com vazamento, colisão, texto invisível ou coberto."
  : `\nSonda de layout: ${total} achado(s).`);
process.exit(total === 0 ? 0 : 1);
