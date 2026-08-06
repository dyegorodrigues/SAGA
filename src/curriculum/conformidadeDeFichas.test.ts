/**
 * Conferência de conformidade: o que a FICHA manda × o que o app SERVE.
 *
 * ---
 *
 * **A pergunta que ninguém tinha feito.** As 92 fichas em
 * `AI_Studio_Lab/pedagogia/fichas/` são o cânone: cada uma declara a
 * competência, a primitiva obrigatória e as regras duras da tela. O runtime, no
 * entanto, cresceu por dois caminhos — o Padrão Ouro (que nasce da ficha) e os
 * geradores legados (escritos ANTES das fichas virarem runtime, sem ninguém
 * comparar depois).
 *
 * Ninguém tinha cruzado os dois lados. Este script cruza, e responde três
 * coisas que nenhum teste responde:
 *
 * 1. Quais competências têm ficha escrita mas nunca viraram runtime
 * 2. Quais fichas exigem uma primitiva que **não existe** no código
 * 3. Quais competências são servidas por legado apesar de ter ficha pronta
 *
 * O item 2 é o mais grave: uma ficha que pede `TouchCount` numa competência
 * servida por outra primitiva não está "parcialmente implementada" — está
 * ensinando outra coisa.
 *
 * Uso: `npm run fichas:conferir` imprime a tabela inteira. Rodando no conjunto
 * normal de testes, ele vira PORTÃO: uma competência no Padrão Ouro não pode
 * exigir primitiva inexistente, e a leitura das fichas não pode ficar cega.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ALL_MATH_TRACKS } from "./motores/curriculum";
import { COMPOSER_CANARIES } from "./motores/composerCanary";
import { JARDIM_FICHAS, JOURNEY_FICHAS } from "./fichas";

/**
 * As fichas de verdade.
 *
 * `AllFichas` mistura `FichaCompetencia` com `Track` — as quatro trilhas Sensei
 * do Dojo entram lá como trilha, sem `micros`. Iterar aquilo aqui rebenta com
 * TypeError em vez de reprovar a regra, que é pior que não ter regra.
 */
const FICHAS = [...JOURNEY_FICHAS, ...JARDIM_FICHAS];

const RAIZ = join(__dirname, "..", "..");
const PASTA_FICHAS = join(RAIZ, "AI_Studio_Lab/pedagogia/fichas");
const PASTA_PRIMITIVAS = join(RAIZ, "src/components/primitives");

interface Exigencia {
  ficha: string;
  competencia: string;
  primitivas: string[];
}

/**
 * Lê as exigências das fichas.
 *
 * O formato é estável no cânone inteiro:
 * `**Competência:** N1.01 (…) · **Primitiva:** \`DragGroup\` (modo parear) · …`
 *
 * O título da ficha (`# FICHA F07 — …`) vem antes, então basta lembrar o último
 * visto. Se a leitura devolver zero, o script FALHA em vez de dizer que está
 * tudo certo — extração vazia é o modo clássico de um auditor mentir.
 */
function exigenciasDasFichas(): Exigencia[] {
  const fora: Exigencia[] = [];
  for (const arquivo of readdirSync(PASTA_FICHAS).filter(a => a.endsWith(".md"))) {
    let fichaAtual = "?";
    for (const linha of readFileSync(join(PASTA_FICHAS, arquivo), "utf8").split("\n")) {
      // `JD1`…`JD5` também são fichas do cânone. Lendo só `F\d+`, o título
      // delas não casava e o relatório atribuía a competência à ficha ANTERIOR:
      // o N1.03 aparecia como "F27". Auditor que erra o nome do que auditou é
      // pior que auditor ausente — o número parecia certo.
      const titulo = linha.match(/^#\s*FICHA\s+((?:F|JD)\d+)/i);
      if (titulo) fichaAtual = titulo[1];
      // `N1.01` e `GM.03` convivem: o dígito do meio é opcional. Sem o `?`,
      // GE/GM/AL/PE inteiras sumiam da auditoria em silêncio.
      const decl = linha.match(/^\*\*Competência:\*\*\s*([A-Z]{1,2}\d?\.\d{2})/);
      if (!decl) continue;
      // Só o trecho DEPOIS de "**Primitiva:**" e antes do próximo separador. A
      // linha tem outras crases — `arranjo`, por exemplo, é campo-chave da ficha,
      // não primitiva, e entrava na conta como se fosse componente faltando.
      const trecho = linha.split(/\*\*Primitiva:\*\*/)[1]?.split(/\*\*[A-ZÀ-Ú]/)[0] ?? "";
      // O MODO conta como linguagem visual distinta. `ArrayGrid` para CONTAR e
      // `ArrayGrid (modo área)` para LER MEDIDAS são dois desenhos diferentes, e
      // tratá-los como o mesmo foi como o modelo de área estreou sem alfabeto.
      const primitivas = [...trecho.matchAll(/`([A-Za-z][A-Za-z0-9]*)`\s*(?:\(modo ([^)]+)\))?/g)]
        .map(m => (m[2] ? `${m[1]}#${m[2].trim()}` : m[1]));
      fora.push({ ficha: fichaAtual, competencia: decl[1], primitivas });
    }
  }
  if (fora.length === 0) {
    throw new Error("nenhuma ficha lida — o formato do cânone mudou e este script ficou cego");
  }
  return fora;
}

/** As primitivas que existem de verdade, pelo nome do arquivo. */
function primitivasExistentes(): Set<string> {
  return new Set(
    readdirSync(PASTA_PRIMITIVAS)
      .filter(a => a.endsWith(".tsx") && !a.includes(".test."))
      .map(a => a.replace(".tsx", "")),
  );
}

/**
 * As primitivas que o cânone exige e o código ainda não tem.
 *
 * Não é uma exceção: é a **dívida declarada**. Cada nome aqui bloqueia
 * competências reais, e enquanto ele estiver na lista aquelas competências não
 * podem subir para o Padrão Ouro — no máximo continuam servidas pelo legado,
 * que ensina outra coisa com o nome certo.
 *
 * A lista é comparada por igualdade, não por inclusão: uma primitiva sumir daqui
 * sem o arquivo aparecer em `src/components/primitives/` significa que alguém
 * apagou a dívida em vez de pagá-la.
 */
export const PRIMITIVAS_PENDENTES = ["Moedas", "Regua"];

/**
 * De que primitiva é feito cada `kind` que o runtime produz.
 *
 * A ficha manda a PRIMITIVA (`TenFrame`, `DragGroup`…); o gerador devolve um
 * `kind` (`tenframe`, `draggroup`…). Sem esta tradução não dá para perguntar a
 * única coisa que importa: *o exercício que a criança recebe é o exercício que a
 * ficha descreve?*
 *
 * A tabela é escrita à mão de propósito. Derivá-la do `FichaRenderer` por regex
 * pareceria mais esperto e seria pior: o renderer decide COMO desenhar, e o que
 * está em jogo aqui é o que a ficha PROMETE. Se os dois discordarem, é a
 * discordância que se quer ver — não uma tabela que se ajusta sozinha para
 * esconder o problema.
 */
const PRIMITIVA_DO_KIND: Record<string, string[]> = {
  count: ["EmojiRow"],
  emojirow: ["EmojiRow"],
  flash: ["EmojiRow"],
  scattered: ["ScatteredItems"],
  draggroup: ["DragGroup"],
  groups: ["DragGroup"],
  tenframe: ["TenFrame"],
  tens: ["Quadrado100"],
  bond: ["NumberBond"],
  numberline: ["NumberLine"],
  "numberline-interactive": ["InteractiveNumberLine"],
  vertical: ["InteractiveVertical", "MaterialDourado"],
  "visual-addition": ["VisualAddition"],
  "linking-cubes": ["LinkingCubes"],
  "take-apart": ["TakeApart"],
  array: ["ArrayGrid"],
  relogio: ["Relogio"],
  balanca: ["Balanca"],
  shape: ["ShapeCanvas"],
  "singapore-bars": ["SingaporeBars"],
  "story-bars": ["StoryPanel", "SingaporeBars"],
  audio: ["AudioChoice"],
  order: ["Grupo"],
  subvis: ["EmojiRow"],
  clock: ["Relogio"],
  picto: ["SingaporeBars"],
  pattern: ["EmojiRow"],
  "drag-group": ["DragGroup"],
  // Estes três não têm manipulativo nenhum: são pergunta e alternativas. Quando
  // a ficha pede uma primitiva e o runtime entrega um destes, a criança não
  // recebe a aula descrita — recebe um teste sobre ela.
  plain: [],
  math: [],
  money: [],
  // Os palcos do Padrão Ouro carregam a primitiva por dentro.
  tabuada: ["ArrayGrid"],
  decomposicao: ["ArrayGrid"],
  ancora: ["ArrayGrid"],
  familia: ["NumberBond"],
  deslocamento: ["MaterialDourado"],
  pareamento: ["DragGroup"],
  touchcount: ["TouchCount"],
  fileira: ["EmojiRow"],
  classificacao: ["DragGroup"],
};

/**
 * O MODO que a ficha nomeia, traduzido para o que o runtime chama.
 *
 * ### O defeito que isto corrige
 *
 * A tabela `PRIMITIVA_DO_KIND` traduz `kind → primitiva`, sem modo. Então a
 * conferência comparava `EmojiRow#flash` (o que a JD1 pede) com `EmojiRow` (o
 * que ela conseguia ver) e **contava como divergente uma competência correta**.
 * Depois da ativação do bloco F0, cinco das 35 "divergências" eram isso: N1.01,
 * N1.02, N1.03, N1.08 e AL.02 servem exatamente o modo que a ficha manda.
 *
 * Um auditor que acusa quem está certo é pior que um auditor ausente: ele
 * esconde os erros de verdade no meio do barulho, e treina quem lê a ignorar a
 * lista. Aqui o runtime **declara** o modo — `uiProps.modo` — e a comparação
 * passa a ser a que importa.
 *
 * A tabela é escrita à mão, como a das primitivas, e pela mesma razão: se a
 * ficha e o runtime discordarem do nome do modo, é a discordância que se quer
 * ver, não uma normalização que a esconde.
 */
const MODO_DO_RUNTIME: Record<string, string> = {
  ritmico: "rítmico",
  toque: "toque",
  flash: "flash",
  "flash-mao": "flash, skin mão",
  padrao: "padrão",
  parear: "parear",
  "caixas/laços": "caixas/laços",
};

/**
 * A primitiva que uma questão entrega, COM o modo quando ele existe.
 *
 * `pareamento` não carrega `modo` no spec porque só tem um: a F07 §1 diz
 * `DragGroup (modo parear)` e o palco não faz outra coisa. Declarado aqui em
 * vez de inventado no spec — o componente não precisa de um campo que nunca
 * varia só para satisfazer um auditor.
 */
function primitivasDaQuestao(q: { kind: string; uiProps?: unknown }): string[] {
  const bases = PRIMITIVA_DO_KIND[q.kind] ?? [];
  const modoBruto = q.kind === "pareamento"
    ? "parear"
    : q.kind === "classificacao"
      ? "caixas/laços"
      : (q.uiProps as { modo?: string } | undefined)?.modo;
  const modo = modoBruto ? MODO_DO_RUNTIME[modoBruto] : undefined;
  // O modo qualifica a primeira primitiva — a que o palco é. Um palco composto
  // (`story-bars` = StoryPanel + SingaporeBars) não tem modo declarado, e
  // espalhar o modo por todas mentiria sobre as outras.
  return modo && bases.length
    ? [`${bases[0]}#${modo}`, ...bases.slice(1)]
    : bases;
}

/** Como cada competência é servida hoje. */
function comoEServida(id: string): "padrao-ouro" | "legado" | "vazio" {
  const t: any = (ALL_MATH_TRACKS as any[]).find(x => x.id === id);
  if (!t || t.contentStatus === "fallback") return "vazio";
  return COMPOSER_CANARIES.has(id) ? "padrao-ouro" : "legado";
}

const exigencias = exigenciasDasFichas();
const existem = primitivasExistentes();
/** `plain` não é primitiva: é a ausência de uma. */
const NAO_E_PRIMITIVA = new Set(["plain"]);

const porCompetencia = new Map<string, Exigencia[]>();
for (const e of exigencias) {
  porCompetencia.set(e.competencia, [...(porCompetencia.get(e.competencia) ?? []), e]);
}

const TODAS = (ALL_MATH_TRACKS as any[]).map(t => t.id as string);

/** As primitivas que a ficha de uma competência exige, sem repetir. */
function primitivasExigidas(id: string): string[] {
  const fichas = porCompetencia.get(id) ?? [];
  return [...new Set(fichas.flatMap(f => f.primitivas))].filter(p => !NAO_E_PRIMITIVA.has(p));
}

/**
 * As que ela exige e o código não tem.
 *
 * A comparação é pela BASE, sem o modo: o arquivo chama-se `NumberBond.tsx`,
 * não `NumberBond#triângulo.tsx`. O modo importa para a PROGRESSÃO (um modo novo
 * é um desenho novo) e não para a existência do componente.
 */
function primitivasAusentes(id: string): string[] {
  return [...new Set(primitivasExigidas(id).map(p => p.split("#")[0]))]
    .filter(base => !existem.has(base));
}

describe("conformidade entre as fichas e o que o app serve", () => {
  it("a leitura das fichas não está cega", () => {
    // Extração vazia é o jeito clássico de um auditor dizer que está tudo bem.
    expect(exigencias.length, "nenhuma ficha lida").toBeGreaterThanOrEqual(40);
    expect(porCompetencia.size, "poucas competências mapeadas").toBeGreaterThanOrEqual(35);
  });

  /**
   * Dívida declarada: nó ativo cuja ficha exige primitiva que ainda não existe.
   *
   * Uma entrada aqui **não** é perdão — é a recusa a fingir. Cada uma vem com o
   * que a criança recebe hoje, o que a ficha manda, e onde a correção está
   * agendada. E o teste logo abaixo apaga a própria lista: uma entrada que
   * deixou de estar quebrada **falha**, de modo que ela não pode envelhecer no
   * repositório depois de resolvida.
   */
  const DIVIDA_DECLARADA: Record<string, string> = {
    // Vazio. A entrada do N1.04 saiu daqui quando `TouchCount` passou a existir
    // — foi o teste logo abaixo que exigiu a remoção, e é para isso que ele é
    // escrito ao contrário.
  };

  it("nenhuma competência JÁ no Padrão Ouro exige primitiva que não existe", () => {
    // Este é o portão de verdade: subir um nó para o Padrão Ouro sem a primitiva
    // que a ficha manda é entregar outra aula com o nome da certa.
    for (const id of TODAS.filter(x => COMPOSER_CANARIES.has(x))) {
      if (id in DIVIDA_DECLARADA) continue;
      expect(primitivasAusentes(id), `${id} exige primitiva inexistente`).toEqual([]);
    }
  });

  it("a dívida declarada ainda é dívida — entrada resolvida tem de sair da lista", () => {
    // Sem isto, a lista acima vira anistia permanente: alguém constrói a
    // primitiva, ninguém apaga a linha, e o portão segue desligado para um nó
    // que já estava são. Aqui a linha morta grita.
    for (const [id, motivo] of Object.entries(DIVIDA_DECLARADA)) {
      expect(
        primitivasAusentes(id),
        `${id} não está mais quebrado — apague a entrada de DIVIDA_DECLARADA.\n${motivo}`,
      ).not.toEqual([]);
      expect(COMPOSER_CANARIES.has(id), `${id} nem é canário ativo`).toBe(true);
    }
  });

  it("toda primitiva citada por ficha ou existe, ou está na lista de pendências", () => {
    // A lista é o compromisso explícito. Uma primitiva sumir dela sem o arquivo
    // aparecer no código significa que alguém apagou a dívida em vez de pagá-la.
    const ausentes = new Set(TODAS.flatMap(primitivasAusentes));
    expect([...ausentes].sort()).toEqual(PRIMITIVAS_PENDENTES);
  });

  it("imprime as competências cuja tela NÃO é a que a ficha descreve", () => {
    // Não falha: é levantamento. Falhar aqui pararia o projeto inteiro, já que
    // 40 nós foram escritos antes de as fichas virarem runtime. O portão de
    // verdade é o teste acima, que cobre quem JÁ subiu para o Padrão Ouro.
    const divergentes: string[] = [];
    const naoAmostrados: string[] = [];
    for (const id of TODAS) {
      if (!porCompetencia.has(id) || comoEServida(id) === "vazio") continue;
      const track: any = (ALL_MATH_TRACKS as any[]).find(t => t.id === id);
      let questoes: { kind: string; uiProps?: unknown }[];
      try {
        // Cinco níveis: uma competência pode trocar de primitiva NA ESCADA, e
        // também de modo — o N1.08 vira `fileira` no 1-2 e `tenframe` no 3-5.
        questoes = [1, 2, 3, 4, 5].map(n => track.gen(n));
      } catch {
        naoAmostrados.push(id);
        continue;
      }
      const kinds = [...new Set(questoes.map(q => String(q.kind)))];
      const desconhecidos = kinds.filter(k => !(k in PRIMITIVA_DO_KIND));
      if (desconhecidos.length) {
        naoAmostrados.push(`${id} (kind sem tradução: ${desconhecidos.join(", ")})`);
        continue;
      }
      // A entrega inclui a forma SEM modo: uma ficha que pede `TenFrame` puro
      // continua satisfeita por `TenFrame#flash` — o modo é um detalhe a mais,
      // não uma primitiva diferente. O contrário é que não vale.
      const entregues = new Set(questoes.flatMap(q => {
        const comModo = primitivasDaQuestao(q);
        return [...comModo, ...comModo.map(p => p.split("#")[0])];
      }));
      const pedidas = primitivasExigidas(id);
      const faltou = pedidas.filter(p => !entregues.has(p));
      if (faltou.length) {
        const oQueVem = entregues.size ? [...entregues].join(", ") : "NADA (só pergunta e alternativas)";
        divergentes.push(`${id}\tficha pede ${pedidas.join(" + ")}\t→ entrega ${oQueVem}`);
      }
    }
    console.log(`\n=== TELA DIVERGE DA FICHA (${divergentes.length} de ${TODAS.length}) ===`);
    console.log(divergentes.join("\n"));
    if (naoAmostrados.length) console.log(`\n(não amostradas: ${naoAmostrados.join(", ")})`);
  });

  it("imprime a LINGUAGEM VISUAL que estreia sem alfabeto", () => {
    // A causa-raiz dos erros pedagógicos (§6.36): cada tela era verificada
    // contra a própria ficha, isolada, e nunca contra a HISTÓRIA da criança.
    // Assim qualquer competência podia estrear um desenho novo com cara de
    // continuidade — correto, testado, acessível e incompreensível.
    //
    // Aqui a pergunta que faltava vira conta: *a linguagem visual desta tela
    // apareceu antes, na cadeia de pré-requisitos?*
    //
    // Não falha: é levantamento. Falhar pararia o projeto, já que o cânone
    // inteiro foi escrito sem esta verificação existir.
    const prereqsDe = new Map<string, string[]>(
      (ALL_MATH_TRACKS as any[]).map(t => [t.id as string, (t.prereqs ?? []) as string[]]),
    );

    /** Toda competência que vem ANTES desta, transitivamente. */
    function ancestrais(id: string): Set<string> {
      const vistos = new Set<string>();
      const fila = [...(prereqsDe.get(id) ?? [])];
      while (fila.length) {
        const atual = fila.shift()!;
        if (vistos.has(atual)) continue;
        vistos.add(atual);
        fila.push(...(prereqsDe.get(atual) ?? []));
      }
      return vistos;
    }

    const trocaDeModo: string[] = [];
    const ferramentaNova: string[] = [];
    const raizes: string[] = [];

    for (const id of TODAS) {
      if (!porCompetencia.has(id)) continue;
      const antes = ancestrais(id);
      const jaVistas = new Set([...antes].flatMap(a => primitivasExigidas(a)));
      const basesVistas = new Set([...jaVistas].map(p => p.split("#")[0]));
      const estreando = primitivasExigidas(id).filter(p => !jaVistas.has(p));
      if (estreando.length === 0) continue;

      for (const p of estreando) {
        const [base, modo] = p.split("#");
        const linha = `${id}\t${p}\t(${antes.size} pré-requisitos)`;
        if (antes.size === 0) { raizes.push(linha); continue; }
        // A classe perigosa: a criança JÁ CONHECE a ferramenta e o desenho
        // mudou de idioma sem aviso. Ela acha que sabe ler, e não sabe.
        if (modo && basesVistas.has(base)) trocaDeModo.push(`${id}\t${base} vira "${modo}"\t(vinha de ${antes.size} nós usando ${base})`);
        else ferramentaNova.push(linha);
      }
    }

    console.log(`\n=== TROCA DE MODO SEM AVISO — a classe mais perigosa (${trocaDeModo.length}) ===`);
    console.log("A criança já viu a ferramenta e o desenho mudou de idioma. Ela acha que sabe ler.");
    console.log(trocaDeModo.join("\n"));

    console.log(`\n=== FERRAMENTA NOVA SEM PRECEDENTE (${ferramentaNova.length}) ===`);
    console.log("Estreia legítima quando a ferramenta É o assunto; grave quando o assunto também é novo.");
    console.log(ferramentaNova.join("\n"));

    console.log(`\n=== ESTREIAS NA RAIZ (${raizes.length}) ===`);
    console.log(raizes.join("\n"));
  });

  it("micros de fichas DIFERENTES não compartilham a mesma voz — pendência P5", () => {
    // `FichaCompetencia` tem UMA voz, e várias competências vêm de DUAS fichas
    // do cânone: N1.08 de F02 + JD2, N1.04 de F01 + F03, N1.11 de F28 + JD3.
    // As §7 delas podem se contradizer — o explain da F02 manda "continue
    // contando" e a JD2 proíbe em negrito dizer "conte" na tela dela.
    //
    // Este é o portão: quando uma micro declara de que ficha veio, duas fontes
    // distintas não podem falar com a mesma boca.
    for (const ficha of FICHAS) {
      const porFonte = new Map<string, string[]>();
      for (const micro of ficha.micros) {
        if (!micro.fonte) continue;
        const voz = String((micro.params as Record<string, unknown>).explain ?? ficha.explain ?? "");
        porFonte.set(micro.fonte, [...(porFonte.get(micro.fonte) ?? []), voz]);
      }
      if (porFonte.size < 2) continue;
      const vozes = [...porFonte.entries()].map(([fonte, vs]) => [fonte, vs[0]] as const);
      const distintas = new Set(vozes.map(([, v]) => v));
      expect(
        distintas.size,
        `${ficha.id}: fichas ${vozes.map(([f]) => f).join(" + ")} falam com a mesma voz.\n`
        + `Declare o explain da micro em params.explain — ver P5 em schema.ts.`,
      ).toBe(vozes.length);
    }
  });

  it("imprime as competências de DUAS fichas que ainda têm uma voz só", () => {
    // Levantamento, não portão: a maioria das competências antigas nunca
    // declarou `fonte`, e falhar aqui pararia o projeto. O portão acima cobre
    // quem já declarou.
    const pendentes: string[] = [];
    for (const [id, fichas] of porCompetencia) {
      const nomes = [...new Set(fichas.map(f => f.ficha))];
      if (nomes.length < 2) continue;
      const runtime = FICHAS.find(f => f.id === id);
      if (!runtime) continue;
      if (runtime.micros.every(m => m.fonte)) continue;
      pendentes.push(`${id}\tfichas ${nomes.join(" + ")}\tmicros sem fonte declarada`);
    }
    console.log(`\n=== DUAS FICHAS, UMA VOZ (${pendentes.length}) ===`);
    console.log("Cada uma pode estar servindo a §7 da ficha errada. Ver P5.");
    console.log(pendentes.join("\n"));
  });

  it("imprime o quadro completo", () => {
    const linhas: string[] = [];
    const faltando = new Map<string, string[]>();
    const contagem: Record<string, number> = { "padrao-ouro": 0, legado: 0, vazio: 0, "sem ficha": 0 };

    for (const id of TODAS) {
      const servida = comoEServida(id);
      if (!porCompetencia.has(id)) {
        contagem["sem ficha"] += 1;
        linhas.push(`${id}\t—\t${servida}\tSEM FICHA`);
        continue;
      }
      contagem[servida] += 1;
      const ausentes = primitivasAusentes(id);
      for (const p of ausentes) faltando.set(p, [...(faltando.get(p) ?? []), id]);
      const fichas = porCompetencia.get(id)!.map(f => f.ficha).join("+");
      linhas.push(`${id}\t${fichas}\t${servida}\t${primitivasExigidas(id).join(", ")}\t${ausentes.length ? "FALTA " + ausentes.join(", ") : "ok"}`);
    }

    console.log("\ncompetência\tficha\tcomo é servida\tprimitivas da ficha\tconformidade");
    console.log(linhas.join("\n"));

    console.log("\n=== RESUMO ===");
    console.log(`competências no grafo: ${TODAS.length}`);
    for (const [k, v] of Object.entries(contagem)) console.log(`  ${k}: ${v}`);

    console.log("\n=== PRIMITIVAS QUE A FICHA EXIGE E NÃO EXISTEM ===");
    for (const [p, ids] of faltando) console.log(`  ${p} → bloqueia ${ids.length}: ${ids.join(", ")}`);

    const comFicha = (estado: string) => TODAS.filter(id => porCompetencia.has(id) && comoEServida(id) === estado);
    console.log(`\n=== FICHA PRONTA, SERVIDA POR LEGADO (${comFicha("legado").length}) ===\n  ${comFicha("legado").join(", ")}`);
    console.log(`\n=== FICHA PRONTA, SEM CONTEÚDO (${comFicha("vazio").length}) ===\n  ${comFicha("vazio").join(", ")}`);
  });
});
