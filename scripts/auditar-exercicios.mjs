/**
 * `node scripts/auditar-exercicios.mjs` — os exercícios funcionam MESMO?
 *
 * ## Por que este arquivo existe
 *
 * O `npm run passeio` diz 19/19 e ainda assim a criança trava. Não é
 * contradição: o passeio clica em tudo o que vê e só pergunta "a tela mudou?".
 * Está escrito lá dentro — "não tenta acertar; o que se mede é se o percurso
 * anda". É detector de tela morta, não auditoria de exercício.
 *
 * Um exercício pode estar podre de sete maneiras que o passeio aprova:
 *
 * 1. **Não dá para responder** — nenhum toque leva a um estado em que se
 *    avança. A tela muda (um destaque, um som), então o passeio fica contente.
 * 2. **Trava depois de responder** — a resposta entra e o "Avançar" nunca vem.
 * 3. **Palco vazio** — nada interativo renderiza.
 * 4. **Erro de JavaScript** no meio da questão.
 * 5. **Alvo pequeno demais** para o dedo de uma criança (piso de 44px, WCAG).
 * 6. **Botão sem nome** — quem usa leitor de tela não sabe o que é.
 * 7. **Sem áudio numa questão que exige leitura.** Esta é a mais grave e a
 *    mais invisível: uma criança de 1º ano NÃO LÊ. Se o enunciado é texto e
 *    não há um jeito de ouvir ANTES de responder, o exercício não é difícil —
 *    é impossível, e ela erra por analfabetismo, não por matemática.
 *
 * Este auditor entra em cada competência, em cada nível, e responde de
 * verdade: tenta todos os caminhos de resposta até achar um que avance.
 *
 * ## O ESTADO DELE, sem maquiagem
 *
 * **Ainda não é confiável para absolver ou condenar um exercício sozinho.**
 * Ele já provou o seu valor — foi com ele que se achou o beco em que a criança
 * travava, e ele joga duas competências inteiras do começo ao fim. Mas um
 * jogador genérico não sabe jogar noventa exercícios pedagogicamente
 * distintos, e três vezes nesta sessão ele acusou de travado um exercício que
 * funciona:
 *
 * 1. identificava controle pelo RÓTULO — três macacos iguais viravam um só;
 * 2. tocava UMA vez em cada — "estoure os balões" pede três tiros no canhão;
 * 3. reiniciava a varredura a cada mudança de tela — girava no botão de dica
 *    para sempre e nunca chegava ao exercício.
 *
 * As três foram corrigidas e estão registradas no próprio código. Sobram
 * outras: no nível 1 há demonstração guiada, e o auditor ainda não sabe
 * esperá-la.
 *
 * Por isso um `[TRAVOU]` daqui é **suspeita**, não veredicto: só vale depois
 * de reproduzido à mão no app. O que já está provado assim vira teste de
 * unidade, que é onde a prova fica — `errarNaoMataAQuestao.test.tsx` e
 * `aCriancaQueNaoLe.test.tsx` nasceram exatamente desse caminho.
 */
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.SAGA_URL ?? "http://localhost:3000";
const CHROMIUM = process.env.CHROME_BIN || "/opt/pw-browsers/chromium";
const SAIDA = process.env.SAGA_AUDITORIA ?? "/tmp/saga-auditoria";
/** Quantas competências auditar. As primeiras são as que a criança encontra. */
const QUANTAS = Number(process.env.SAGA_QUANTAS ?? 8);
/** Níveis por competência. */
const NIVEIS = (process.env.SAGA_NIVEIS ?? "1,2,3,4,5").split(",").map(Number);
/** Piso de alvo tocável — WCAG 2.5.5, e o dedo de uma criança é maior que o de adulto. */
const ALVO_MINIMO = 44;

const achados = [];
const relata = (competencia, nivel, tipo, detalhe) => {
  achados.push({ competencia, nivel, tipo, detalhe });
  console.log(`  [${tipo}] ${competencia} n${nivel}: ${detalhe}`);
};

const textoDe = (p) => p.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim());

/** O estado que interessa: a criança consegue seguir em frente? */
const podeAvancar = async (p) => p.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  return [...document.querySelectorAll("button")].filter(vis).some(e =>
    !e.disabled && /^(Avançar|Continuar|Próxim\w*|Ver Resultado)$/i.test((e.innerText || "").trim()));
});

const terminou = async (p) => /de \d+ acertos|Aventura Conclu|Parabéns/i.test(await textoDe(p));

/**
 * Tudo em que uma criança poderia tocar para responder.
 *
 * Cada elemento ganha um `data-auditoria` PRÓPRIO na primeira vez que é visto,
 * e o mantém entre as releituras. A primeira versão deste arquivo identificava
 * candidato pelo rótulo — e três macacos idênticos ("Este ainda está sem")
 * viravam um só: o auditor tocava em um, dava os outros dois por tocados e
 * acusava seis competências de travadas. Falsa acusação do instrumento, não
 * defeito do app.
 */
const candidatos = async (p) => p.evaluate(() => {
  const w = window;
  if (w.__auditoriaSeq === undefined) w.__auditoriaSeq = 0;
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  // Moldura e AJUDA ficam fora do caminho de resposta. A ajuda ("Como faz?",
  // "Vem ver a aulinha", o botão de ouvir) reinicia a demonstração e zera o
  // que a criança já fez: um auditor que insiste nela nunca termina uma
  // questão — e acusa de travado um exercício que funciona.
  const CHROME = /^(Fechar|Sair da missão|Avançar|Continuar|Ver Resultado|Sair|Voltar|TUTOR|JORNADA|DOJO|OFICINA)$/i;
  // Só o que REINICIA a narração fica de fora. "Como faz?" e "a aulinha" são
  // andaime: no nível 1 a demonstração faz parte do caminho, e excluí-los fez
  // o auditor estacionar antes de chegar ao exercício.
  const AJUDA = /ouvir de novo|escutar|repetir|ligar o som|desligar o som/i;
  const saida = [];
  document.querySelectorAll("button, [role=button], [draggable=true], input[type=radio], input[type=text], input[type=number], select").forEach((e, i) => {
    if (!vis(e)) return;
    const nome = (e.getAttribute("aria-label") || e.innerText || e.value || "").replace(/\s+/g, " ").trim();
    if (CHROME.test(nome) || AJUDA.test(nome)) return;
    // O botão de ouvir se reconhece pela ARTE que mostra, não por chute de
    // CSS — a primeira tentativa usou a classe do contêiner e levou junto os
    // controles do próprio exercício. Ele também reinicia a narração, então
    // fica fora do caminho de resposta; a falta de nome é denunciada à parte.
    const arte = e.querySelector("img")?.getAttribute("src") || "";
    if (nome === "" && /som(-baixo|-mudo)?\.svg|som%|ouvido/.test(arte)) return;
    if (!e.getAttribute("data-auditoria")) e.setAttribute("data-auditoria", String(w.__auditoriaSeq++));
    const i2 = e.getAttribute("data-auditoria");
    const r = e.getBoundingClientRect();
    saida.push({ id: i2, nome: nome.slice(0, 50), tag: e.tagName, arrastavel: e.getAttribute("draggable") === "true",
                 desabilitado: !!e.disabled, w: Math.round(r.width), h: Math.round(r.height) });
  });
  return saida;
});

/** Há como OUVIR o enunciado, e esse botão tem nome? */
const afericaoDeAudio = async (p) => p.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const botoes = [...document.querySelectorAll("button")].filter(vis);
  const ehAudio = e => {
    const nome = (e.getAttribute("aria-label") || "").toLowerCase();
    if (/ouvir|escut|som|áudio|audio|repetir|falar/.test(nome)) return true;
    // Sem nome: reconhece pela arte de som embutida no botão.
    const img = e.querySelector("img");
    const src = img?.getAttribute("src") || "";
    return /som(-baixo|-mudo)?\.svg|data:image\/svg/.test(src) && /som/.test(src);
  };
  const audio = botoes.filter(ehAudio);
  const semNome = botoes.filter(e => {
    const nome = (e.getAttribute("aria-label") || e.innerText || "").replace(/\s+/g, " ").trim();
    return nome === "";
  }).map(e => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), html: e.innerHTML.slice(0, 80) }; });
  return { temAudio: audio.length > 0, semNome };
});

/** O enunciado exige leitura? Número e símbolo não; palavra sim. */
const exigeLeitura = (texto) => {
  const limpo = texto.replace(/[^\p{L}\s]/gu, " ").trim();
  const palavras = limpo.split(/\s+/).filter(w => w.length > 2);
  return palavras.length >= 3;
};

async function responderUmaQuestao(p, competencia, nivel, rodada) {
  const enunciado = (await textoDe(p)).slice(0, 120);
  const audio = await afericaoDeAudio(p);

  if (!audio.temAudio && exigeLeitura(enunciado)) {
    relata(competencia, nivel, "SEM-AUDIO", `q${rodada}: enunciado de texto e nenhum jeito de ouvir — "${enunciado.slice(0, 70)}"`);
  }
  for (const b of audio.semNome) {
    if (b.w >= 30) relata(competencia, nivel, "BOTAO-SEM-NOME", `q${rodada}: botão ${b.w}×${b.h} sem nome acessível`);
  }

  const alvos = await candidatos(p);
  if (alvos.length === 0) {
    relata(competencia, nivel, "PALCO-VAZIO", `q${rodada}: nenhum elemento em que a criança possa tocar`);
    return false;
  }
  for (const a of alvos) {
    if (a.w > 0 && (a.w < ALVO_MINIMO || a.h < ALVO_MINIMO)) {
      relata(competencia, nivel, "ALVO-PEQUENO", `q${rodada}: "${a.nome || a.tag}" mede ${a.w}×${a.h} (piso ${ALVO_MINIMO})`);
    }
  }

  // Tenta responder, relendo a tela a cada toque E podendo repetir o mesmo
  // controle.
  //
  // Duas armadilhas já derrubaram este trecho, as duas acusando o app de
  // travado quando o travado era o auditor:
  //
  // 1. Identificar candidato pelo RÓTULO — três macacos com o mesmo rótulo
  //    viravam um só.
  // 2. Tocar em cada controle UMA vez — "Estoure os balões" pede três tiros no
  //    mesmo canhão, e "conte tocando" pede um toque por objeto.
  //
  // Agora a regra é a da criança: insista enquanto a tela responder. Uma
  // passagem inteira sem nada mudar é o que encerra — e aí sim é travamento.
  // Uma PASSADA percorre todos os controles habilitados, em ordem, sem parar
  // no meio. Passadas se repetem enquanto a tela reagir.
  //
  // Três armadilhas já derrubaram este trecho, as três acusando o app de
  // travado quando o travado era o auditor:
  //
  // 1. Identificar candidato pelo RÓTULO — três macacos iguais viravam um só.
  // 2. Tocar em cada controle UMA vez — "Estoure os balões" pede três tiros no
  //    mesmo canhão.
  // 3. Reiniciar a varredura a cada mudança de tela — o primeiro controle é o
  //    de ouvir/dica, que SEMPRE muda o texto: o auditor girava nele para
  //    sempre e nunca chegava nos objetos do exercício.
  //
  // A passada inteira resolve as três: cobre todos, repete quem precisa de
  // repetição, e não deixa um controle falante monopolizar a vez.
  for (let passada = 0; passada < 14; passada += 1) {
    const antes = await textoDe(p);
    const agora = (await candidatos(p)).filter(x => !x.desabilitado);
    if (!agora.length) break;
    for (const a of agora) {
      const el = p.locator(`[data-auditoria="${a.id}"]`).first();
      if (!(await el.count())) continue;
      if (a.tag === "INPUT") {
        await el.fill(String(Math.floor(Math.random() * 9) + 1)).catch(() => {});
        await p.keyboard.press("Enter").catch(() => {});
      } else if (a.arrastavel) {
        for (const d of agora.filter(x => x.id !== a.id && !x.arrastavel).slice(0, 4)) {
          await el.dragTo(p.locator(`[data-auditoria="${d.id}"]`).first(), { timeout: 2500 }).catch(() => {});
          if (await podeAvancar(p)) break;
        }
      } else {
        await el.click({ timeout: 2000 }).catch(() => {});
      }
      await p.waitForTimeout(420);
      if (await podeAvancar(p) || await terminou(p)) return true;
    }
    if ((await textoDe(p)) === antes && passada > 0) break;
  }
  await p.waitForTimeout(1200);
  return (await podeAvancar(p)) || (await terminou(p));
}

async function auditarNivel(p, competencia, nivel, erros) {
  const marcaDeErro = erros.length;
  for (let rodada = 1; rodada <= 10; rodada += 1) {
    if (await terminou(p)) return { ok: true, rodadas: rodada - 1 };
    const conseguiu = await responderUmaQuestao(p, competencia, nivel, rodada);
    if (!conseguiu) {
      relata(competencia, nivel, "TRAVOU", `q${rodada}: esgotei todos os toques possíveis e não houve como avançar`);
      return { ok: false, rodadas: rodada - 1 };
    }
    const avancar = p.getByRole("button", { name: /^(Avançar|Continuar|Próxim\w*|Ver Resultado)$/i }).first();
    if (await avancar.count()) { await avancar.click().catch(() => {}); await p.waitForTimeout(900); }
  }
  if (erros.length > marcaDeErro) relata(competencia, nivel, "ERRO-JS", erros.slice(marcaDeErro).join(" | ").slice(0, 200));
  return { ok: true, rodadas: 10 };
}

async function main() {
  mkdirSync(SAIDA, { recursive: true });
  console.log(`SAGA — AUDITORIA DOS EXERCÍCIOS\n- alvo: ${BASE}\n- ${QUANTAS} competência(s) × níveis ${NIVEIS.join(",")}\n`);
  const browser = await chromium.launch({ executablePath: CHROMIUM });
  const ctx = await browser.newContext({ viewport: { width: 480, height: 940 } });
  const p = await ctx.newPage();
  const erros = [];
  p.on("pageerror", e => erros.push(String(e).slice(0, 160)));

  const clicar = async (re, esperar) => {
    const a = p.getByRole("button", { name: re }).first();
    if (!(await a.count())) return false;
    await a.click().catch(() => {});
    if (esperar) await p.waitForFunction(s => new RegExp(s, "i").test(document.body.innerText), esperar, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(500); return true;
  };

  await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(1200);
  await clicar(/Começar sem Conta/i, "Monte seus Perfis");
  await clicar(/Criar Primeiro Perfil|Criar Perfil|Novo Perfil/i, "Configurar Perfil");
  await p.locator('input[type="text"]').first().fill("Teo");
  await clicar(/1º Ano EF/i);
  await clicar(/Começar Aventura/i, "JOGAR");
  await clicar(/JOGAR/i, "Sensei|Aventura");
  await p.waitForTimeout(700);

  /**
   * Volta para a Jornada de onde quer que esteja.
   *
   * Três situações: dentro da missão (a barra de abas não existe, a saída é o
   * × ), na tela de recompensa (a missão acabou e a barra voltou), ou já na
   * casa. A primeira versão só tentava a aba — e ao terminar uma missão ficava
   * presa na recompensa, acusando as seis competências seguintes de "não
   * abre". Instrumento, de novo, não app.
   */
  const irParaJornada = async () => {
    for (let tentativa = 0; tentativa < 4; tentativa += 1) {
      const aba = p.locator("button", { hasText: /^Jornada$/i });
      if (await aba.count()) {
        await aba.first().click().catch(() => {});
        await p.waitForTimeout(1300);
        if (await p.getByRole("button", { name: /: disponível$/ }).count()) return;
      }
      // A tela de fim de missão não tem barra de abas: a saída dela é o botão
      // "Ver Outros Jogos" (`onExit`). Dentro da missão, é o × ("Sair da
      // missão"). Sem conhecer os dois, o auditor fica preso na recompensa.
      const voltar = p.getByRole("button", { name: /^Ver Outros Jogos$/ }).first();
      if (await voltar.count()) { await voltar.click().catch(() => {}); await p.waitForTimeout(1100); continue; }
      const sair = p.getByRole("button", { name: /^Sair da missão$/ }).first();
      if (await sair.count()) { await sair.click().catch(() => {}); await p.waitForTimeout(900); }
      const conf = p.getByRole("button", { name: /^(Sair|Sim|Confirmar)$/i }).first();
      if (await conf.count()) { await conf.click().catch(() => {}); await p.waitForTimeout(900); }
      await p.waitForTimeout(600);
    }
  };
  await irParaJornada();

  /**
   * Relê a lista de competências abertas a cada volta.
   *
   * Depois de jogar uma missão o progresso muda, e com ele o mapa: um nó pode
   * ganhar coroa, outro pode abrir. Guardar a lista do começo e procurar por
   * nome fazia o auditor acusar "o cartão sumiu" em tudo o que vinha depois da
   * primeira missão — terceira falsa acusação do instrumento nesta sessão.
   */
  const disponiveis = async () => {
    const out = [];
    for (const a of await p.getByRole("button", { name: /: dispon[ií]vel$/ }).all()) {
      const r = await a.getAttribute("aria-label");
      if (r) out.push(r.replace(/: dispon[ií]vel$/, ""));
    }
    return out;
  };

  const feitos = new Set();
  for (let volta = 0; volta < QUANTAS * NIVEIS.length + 4; volta += 1) {
    await irParaJornada();
    const abertas = await disponiveis();
    if (!abertas.length) { console.log("!! a Jornada não mostra competência aberta nenhuma"); break; }
    const pendente = abertas.map(n => NIVEIS.map(l => [n, l])).flat()
      .find(([n, l]) => !feitos.has(`${n}|${l}`) && abertas.indexOf(n) < QUANTAS);
    if (!pendente) break;
    const [nome, nivel] = pendente;
    feitos.add(`${nome}|${nivel}`);

    const cartao = p.getByRole("button", { name: `${nome}: disponível` }).first();
    if (!(await cartao.count())) { relata(nome, nivel, "NAO-ABRE", "o cartão sumiu da Jornada"); continue; }
    await cartao.click(); await p.waitForTimeout(1100);
    const botaoNivel = p.getByRole("button", { name: new RegExp(`^${nivel} N[ií]vel ${nivel}`) }).first();
    if (!(await botaoNivel.count())) { relata(nome, nivel, "NIVEL-AUSENTE", "o seletor não oferece este nível"); continue; }
    await botaoNivel.click(); await p.waitForTimeout(1600);
    const t = await textoDe(p);
    if (/Nível \d+ ·/.test(t) && /Ex:/.test(t)) { relata(nome, nivel, "NAO-ABRE", "escolher o nível não abriu a missão"); continue; }
    const r = await auditarNivel(p, nome, nivel, erros);
    console.log(`${r.ok ? "ok " : "FALHA"} ${nome} n${nivel} (${r.rodadas} questões)`);
  }

  const porTipo = {};
  for (const a of achados) porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1;
  console.log("\n" + "─".repeat(64));
  console.log("RESUMO DA AUDITORIA");
  for (const [t, n] of Object.entries(porTipo).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)} × ${t}`);
  if (!achados.length) console.log("  nenhum achado");
  writeFileSync(`${SAIDA}/achados.json`, JSON.stringify(achados, null, 1));
  console.log(`\nDetalhe em ${SAIDA}/achados.json`);
  await browser.close();
}

main();
