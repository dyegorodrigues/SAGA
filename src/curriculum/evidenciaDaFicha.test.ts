import { describe, expect, it } from "vitest";
import { Evidencia } from "../constants/evidencias";
import { JOURNEY_FICHAS } from "./fichas";
import { evidenciasDe as daClassificacao } from "./procedimentos/classificacaoProcedure";
import { evidenciasDe as daContagem } from "./procedimentos/touchCountProcedure";
import { evidenciasDe as daEscuta } from "./procedimentos/audioChoiceProcedure";
import { evidenciasDe as daProducao } from "./procedimentos/producaoProcedure";
import { evidenciasDe as daForma } from "./procedimentos/formaProcedure";
import { evidenciasDe as daGrandeza } from "./procedimentos/grandezaProcedure";
import { evidenciasDe as daMoldura } from "./procedimentos/tenFrameProcedure";
import { evidenciasDe as daMedida } from "./procedimentos/medidasProcedure";
import { construirMaterialDouradoSpec } from "./procedimentos/materialDouradoContract";
import { evidenciasMaterialDourado as daDezena } from "./procedimentos/materialDouradoProcedure";

/**
 * O portão da P13: a regra extra da §9 chega mesmo ao motor?
 *
 * ---
 *
 * Uma evidência exigida por uma ficha e emitida por ninguém é **pior** que
 * nenhuma evidência: ela torna a coroa daquela competência inalcançável para
 * sempre, sem erro nenhum na tela, sem exceção no console, sem teste vermelho.
 * A criança acerta tudo e a coroa não vem.
 *
 * É o mesmo formato de defeito que este bloco já encontrou quatro vezes — a
 * primitiva órfã, a tag testada e nunca emitida, o distrator ausente do banco.
 * Declarado num lugar, esperado noutro, e nada ligando os dois.
 */

/** Cada emissor, com uma ação que DEVE produzir a evidência da ficha. */
const EMISSORES: { nome: string; evidencia: string; emitir: () => string[] }[] = [
  {
    nome: "F51 (classificação) — decisão correta de deixar uma peça fora",
    evidencia: Evidencia.NAO_PERTENCE,
    emitir: () => daClassificacao({
      forma: "um-laco",
      criterios: [{ atributo: "cor", valor: "vermelho" }],
      colocacoes: [
        {
          peca: { id: 1, cor: "vermelho", forma: "circulo", tamanho: "grande" },
          onde: [0], tentativas: [],
        },
        {
          peca: { id: 2, cor: "azul", forma: "quadrado", tamanho: "pequeno" },
          onde: [], tentativas: [],
        },
      ],
    }),
  },
  {
    nome: "F01 (touchcount) — acerto no arranjo disperso",
    evidencia: Evidencia.ARRANJO_DISPERSO,
    emitir: () => daContagem({ marcados: 5, total: 5, toquesRepetidos: 0, resposta: 5, arranjo: "disperso" }),
  },
  {
    nome: "F05 (audiochoice) — acerto na primeira audição",
    evidencia: Evidencia.PRIMEIRA_AUDICAO,
    emitir: () => daEscuta({ resposta: 3, alvo: 3, alternativas: [1, 3, 5], repeticoes: 0 }),
  },
  {
    nome: "F04 (touchplace) — acerto sem vaga fantasma",
    evidencia: Evidencia.SEM_ANDAIME,
    emitir: () => daProducao({ colocados: 4, alvo: 4, bandeja: 12, recusas: 0, comAndaime: false }),
  },
  {
    nome: "F48 (shapecanvas) — acerto com a forma girada",
    evidencia: Evidencia.FORMA_GIRADA,
    emitir: () => daForma({ pedida: "triangulo", escolhida: "triangulo", pedidaGirada: true, escolhidaEmPe: false }),
  },
  {
    nome: "F49 (grandeza) — acerto com diferença pequena",
    evidencia: Evidencia.DIFERENCA_PEQUENA,
    emitir: () => daGrandeza({
      escolhido: 0, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: true, antesDoChao: false,
    }),
  },
  {
    nome: "F50 (medidas) — acerto em caso contraintuitivo",
    evidencia: Evidencia.CASO_CONTRAINTUITIVO,
    emitir: () => daMedida({
      modo: "peso", escolhido: 0, certo: 0, ordemCerta: [0, 1], ordemVisual: [1, 0],
      contraintuitivo: true, formatosDiferentes: false, verificou: true, maiorVisual: 1,
    }),
  },
  {
    nome: "F02 (moldura) — acerto com seis ou mais, usando as duas fileiras",
    evidencia: Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS,
    emitir: () => daMoldura({ modo: "contar", nivel: 3, resposta: 7, alvo: 7, cheias: 7, casas: 10 }),
  },
  {
    nome: "JD5 (moldura) — acerto com mais de cinco guardados na cabeça",
    evidencia: Evidencia.TOTAL_ALEM_DE_CINCO,
    emitir: () => daMoldura({
      modo: "escondidos", nivel: 4, resposta: 3, alvo: 3, cheias: 8, casas: 10,
      total: 8, visiveis: 5,
    }),
  },
  {
    nome: "F21 (dezena) — L4 monta o material a partir do numeral",
    evidencia: Evidencia.MONTOU_DO_NUMERAL,
    emitir: () => {
      const spec = construirMaterialDouradoSpec(4, () => 0);
      return daDezena({
        modo: "montar",
        resposta: spec.total,
        dezenasProduzidas: spec.dezenas,
        unidadesProduzidas: spec.unidades,
        contouUmAUm: false,
        trocasConcluidas: 0,
      }, spec);
    },
  },
];

describe("P13 — a evidência declarada existe do lado de quem emite", () => {
  it.each(EMISSORES.map(e => [e.nome, e] as const))("%s", (_n, caso) => {
    expect(caso.emitir()).toContain(caso.evidencia);
  });

  it("⚠️ toda evidência EXIGIDA por uma ficha tem um emissor", () => {
    // A falha que este teste impede é silenciosa: a coroa daquela competência
    // fica inalcançável para sempre e nada acusa.
    const emitidas = new Set(EMISSORES.map(e => e.evidencia));
    for (const ficha of JOURNEY_FICHAS) {
      for (const micro of ficha.micros) {
        const exigida = micro.dominio.exige?.evidencia;
        if (!exigida) continue;
        expect(emitidas, `${ficha.id}/${micro.id} exige "${exigida}"`).toContain(exigida);
      }
    }
  });

  it("toda evidência exigida está no catálogo — nada de string solta", () => {
    const catalogo = new Set<string>(Object.values(Evidencia));
    for (const ficha of JOURNEY_FICHAS) {
      for (const micro of ficha.micros) {
        const exigida = micro.dominio.exige?.evidencia;
        if (!exigida) continue;
        expect(catalogo, `${ficha.id}/${micro.id}`).toContain(exigida);
      }
    }
  });

  it("a descrição do que falta é uma frase para o PAI ler, não um id", () => {
    for (const ficha of JOURNEY_FICHAS) {
      for (const micro of ficha.micros) {
        const exige = micro.dominio.exige;
        if (!exige) continue;
        expect(exige.descricao.length, `${ficha.id}/${micro.id}`).toBeGreaterThan(20);
        expect(exige.descricao, `${ficha.id}/${micro.id}`).not.toContain("-");
      }
    }
  });

  it("⚠️ nenhuma evidência é emitida por resposta ERRADA", () => {
    // Evidência é prova de competência. Emitida no erro, ela coroaria quem não
    // demonstrou nada — o oposto exato do que a §9 pede.
    expect(daClassificacao({
      forma: "um-laco",
      criterios: [{ atributo: "cor", valor: "vermelho" }],
      colocacoes: [
        {
          peca: { id: 1, cor: "vermelho", forma: "circulo", tamanho: "grande" },
          onde: [0], tentativas: [],
        },
        {
          peca: { id: 2, cor: "azul", forma: "quadrado", tamanho: "pequeno" },
          onde: [0], tentativas: [[0]],
        },
      ],
    })).toEqual([]);
    expect(daContagem({ marcados: 4, total: 5, toquesRepetidos: 0, resposta: 4, arranjo: "disperso" })).toEqual([]);
    expect(daEscuta({ resposta: 4, alvo: 3, alternativas: [3, 4], repeticoes: 0 })).toEqual([]);
    expect(daProducao({ colocados: 3, alvo: 4, bandeja: 12, recusas: 0, comAndaime: false })).toEqual([]);
    expect(daForma({ pedida: "triangulo", escolhida: "circulo", pedidaGirada: true, escolhidaEmPe: true })).toEqual([]);
    expect(daGrandeza({
      escolhido: 1, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: true, antesDoChao: false,
    })).toEqual([]);
    expect(daMedida({
      modo: "peso", escolhido: 1, certo: 0, ordemCerta: [0, 1], ordemVisual: [1, 0],
      contraintuitivo: true, formatosDiferentes: false, verificou: true, maiorVisual: 1,
    })).toEqual([]);

    const spec = construirMaterialDouradoSpec(4, () => 0);
    expect(daDezena({
      modo: "montar",
      resposta: spec.total - 1,
      dezenasProduzidas: Math.max(0, spec.dezenas - 1),
      unidadesProduzidas: spec.unidades,
      contouUmAUm: false,
      trocasConcluidas: 0,
    }, spec)).toEqual([]);
  });
});
