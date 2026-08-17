/**
 * Conferência de conformidade: o que a FICHA manda × o que o app SERVE.
 *
 * ---
 *
 * **A pergunta que ninguém tinha feito.** As 94 fichas em
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
      const titulo = linha.match(/^#\s*FICHA\s+((?:F|JD)\d+)/i);
      if (titulo) fichaAtual = titulo[1];
      const decl = linha.match(/^\*\*Competência:\*\*\s*([A-Z]{1,2}\d?\.\d{2})/);
      if (!decl) continue;
      const trecho = linha.split(/\*\*Primitiva:\*\*/)[1]?.split(/\*\*[A-ZÀ-Ú]/)[0] ?? "";
      const primitivas = [...trecho.matchAll(/`([A-Za-z][A-Za-z0-9]*)`\s*(?:\(modo ([^)]+)\))?/g)]
        .map(m => (m[2] ? `${m[1]}#${m[2].trim()}` : m[1]));
      fora.push({ ficha: fichaAtual, competencia: decl[1], primitivas });
    }
  }
  if (fora.length === 0) throw new Error("nenhuma ficha lida — o formato do cânone mudou e este script ficou cego");
  return fora;
}

function primitivasExistentes(): Set<string> {
  return new Set(
    readdirSync(PASTA_PRIMITIVAS)
      .filter(a => a.endsWith(".tsx") && !a.includes(".test."))
      .map(a => a.replace(".tsx", "")),
  );
}

export const PRIMITIVAS_PENDENTES = ["Moedas"];

const PRIMITIVA_DO_KIND: Record<string, string[]> = {
  count: ["EmojiRow"],
  emojirow: ["EmojiRow"],
  flash: ["EmojiRow"],
  scattered: ["ScatteredItems"],
  draggroup: ["DragGroup"],
  groups: ["DragGroup"],
  tenframe: ["TenFrame"],
  tens: ["Quadrado100"],
  "material-dourado": ["MaterialDourado", "TenFrame"],
  bond: ["NumberBond"],
  numberline: ["NumberLine"],
  "numberline-interactive": ["InteractiveNumberLine"],
  vertical: ["InteractiveVertical", "MaterialDourado"],
  "visual-addition": ["VisualAddition"],
  "linking-cubes": ["LinkingCubes"],
  "take-apart": ["TakeApart"],
  array: ["ArrayGrid"],
  "volume-vistas-f92": ["ArrayGrid"],
  relogio: ["Relogio"],
  balanca: ["Balanca"],
  medidas: ["Balanca", "Recipientes"],
  regua: ["Regua"],
  "regua-f61": ["Regua"],
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
  plain: [],
  math: [],
  money: [],
  tabuada: ["ArrayGrid", "Quadrado100", "NumberLine"],
  decomposicao: ["ArrayGrid"],
  ancora: ["ArrayGrid"],
  familia: ["NumberBond"],
  deslocamento: ["MaterialDourado"],
  pareamento: ["DragGroup"],
  touchcount: ["TouchCount"],
  fileira: ["EmojiRow"],
  classificacao: ["DragGroup"],
  audiochoice: ["AudioChoice"],
};

const MODO_DO_RUNTIME: Record<string, string> = {
  ritmico: "rítmico",
  toque: "toque",
  flash: "flash",
  "flash-mao": "flash, skin mão",
  padrao: "padrão",
  parear: "parear",
  duplas: "duplas",
  "caixas/laços": "caixas/laços",
  "vista-frontal": "3D",
  "tres-vistas": "3D",
  "reconstruir-vistas": "3D",
  "cubos-ocultos": "3D",
  "desenhar-vistas": "3D",
};

function primitivasDaQuestao(q: { kind: string; uiProps?: unknown }): string[] {
  const bases = PRIMITIVA_DO_KIND[q.kind] ?? [];
  const modoBruto = q.kind === "pareamento"
    ? "parear"
    : q.kind === "classificacao"
      ? "caixas/laços"
      : (q.uiProps as { modo?: string } | undefined)?.modo;
  const modo = modoBruto ? MODO_DO_RUNTIME[modoBruto] : undefined;
  return modo && bases.length
    ? [`${bases[0]}#${modo}`, ...bases.slice(1)]
    : bases;
}

function comoEServida(id: string): "padrao-ouro" | "legado" | "vazio" {
  const t: any = (ALL_MATH_TRACKS as any[]).find(x => x.id === id);
  if (!t || t.contentStatus === "fallback") return "vazio";
  return COMPOSER_CANARIES.has(id) ? "padrao-ouro" : "legado";
}

const exigencias = exigenciasDasFichas();
const existem = primitivasExistentes();
const NAO_E_PRIMITIVA = new Set(["plain"]);

const porCompetencia = new Map<string, Exigencia[]>();
for (const e of exigencias) porCompetencia.set(e.competencia, [...(porCompetencia.get(e.competencia) ?? []), e]);

const TODAS = (ALL_MATH_TRACKS as any[]).map(t => t.id as string);

function primitivasExigidas(id: string): string[] {
  const fichas = porCompetencia.get(id) ?? [];
  return [...new Set(fichas.flatMap(f => f.primitivas))].filter(p => !NAO_E_PRIMITIVA.has(p));
}

function primitivasAusentes(id: string): string[] {
  return [...new Set(primitivasExigidas(id).map(p => p.split("#")[0]))]
    .filter(base => !existem.has(base));
}

describe("conformidade entre as fichas e o que o app serve", () => {
  it("a leitura das fichas não está cega", () => {
    expect(exigencias.length, "nenhuma ficha lida").toBeGreaterThanOrEqual(40);
    expect(porCompetencia.size, "poucas competências mapeadas").toBeGreaterThanOrEqual(35);
  });

  const DIVIDA_DECLARADA: Record<string, string> = {};

  it("nenhuma competência JÁ no Padrão Ouro exige primitiva que não existe", () => {
    for (const id of TODAS.filter(x => COMPOSER_CANARIES.has(x))) {
      if (id in DIVIDA_DECLARADA) continue;
      expect(primitivasAusentes(id), `${id} exige primitiva inexistente`).toEqual([]);
    }
  });

  it("a dívida declarada ainda é dívida — entrada resolvida tem de sair da lista", () => {
    for (const [id, motivo] of Object.entries(DIVIDA_DECLARADA)) {
      expect(
        primitivasAusentes(id),
        `${id} não está mais quebrado — apague a entrada de DIVIDA_DECLARADA.\n${motivo}`,
      ).not.toEqual([]);
      expect(COMPOSER_CANARIES.has(id), `${id} nem é canário ativo`).toBe(true);
    }
  });

  it("toda primitiva citada por ficha ou existe, ou está na lista de pendências", () => {
    const ausentes = new Set(TODAS.flatMap(primitivasAusentes));
    expect([...ausentes].sort()).toEqual(PRIMITIVAS_PENDENTES);
  });

  it("imprime as competências cuja tela NÃO é a que a ficha descreve", () => {
    const divergentes: string[] = [];
    const naoAmostrados: string[] = [];
    for (const id of TODAS) {
      if (!porCompetencia.has(id) || comoEServida(id) === "vazio") continue;
      const track: any = (ALL_MATH_TRACKS as any[]).find(t => t.id === id);
      let questoes: { kind: string; uiProps?: unknown }[];
      try {
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
    const prereqsDe = new Map<string, string[]>(
      (ALL_MATH_TRACKS as any[]).map(t => [t.id as string, (t.prereqs ?? []) as string[]]),
    );

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