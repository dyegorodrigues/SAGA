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
import { construirReta20Spec } from "./procedimentos/reta20Contract";
import { evidenciasReta20 as daReta } from "./procedimentos/reta20Procedure";

/**
 * O portão da P13: a regra extra da §9 chega mesmo ao motor?
 *
 * Uma evidência exigida por uma ficha e emitida por ninguém torna a coroa
 * inalcançável em silêncio. Por isso ficha, catálogo e procedure se encontram
 * explicitamente aqui.
 */
const EMISSORES: { nome: string; evidencia: string; emitir: () => string[] }[] = [
  {
    nome: "F51 (classificação) — decisão correta de deixar uma peça fora",
    evidencia: Evidencia.NAO_PERTENCE,
    emitir: () => daClassificacao({
      forma: "um-laco",
      criterios: [{ atributo: "cor", valor: "vermelho" }],
      colocacoes: [
        { peca: { id: 1, cor: "vermelho", forma: "circulo", tamanho: "grande" }, onde: [0], tentativas: [] },
        { peca: { id: 2, cor: "azul", forma: "quadrado", tamanho: "pequeno" }, onde: [], tentativas: [] },
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
    emitir: () => daGrandeza({ escolhido: 0, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: true, antesDoChao: false }),
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
    emitir: () => daMoldura({ modo: "escondidos", nivel: 4, resposta: 3, alvo: 3, cheias: 8, casas: 10, total: 8, visiveis: 5 }),
  },
  {
    nome: "F21 (dezena) — L4 monta o material a partir do numeral",
    evidencia: Evidencia.MONTOU_DO_NUMERAL,
    emitir: () => {
      const spec = construirMaterialDouradoSpec(4, () => 0);
      return daDezena({
        modo: "montar", resposta: spec.total, dezenasProduzidas: spec.dezenas,
        unidadesProduzidas: spec.unidades, contouUmAUm: false, trocasConcluidas: 0,
      }, spec);
    },
  },
  {
    nome: "F19 (reta) — acerto em salto para trás",
    evidencia: Evidencia.SALTO_PARA_TRAS,
    emitir: () => {
      const spec = construirReta20Spec(3, () => 0);
      return daReta({
        escolhido: spec.alvo,
        posicaoInicial: spec.posicaoInicial,
        alvo: spec.alvo,
        salto: spec.salto,
        gesto: "toque",
        contouMarcaInicial: false,
      }, spec);
    },
  },
];

describe("P13 — a evidência declarada existe do lado de quem emite", () => {
  it.each(EMISSORES.map(e => [e.nome, e] as const))("%s", (_n, caso) => {
    expect(caso.emitir()).toContain(caso.evidencia);
  });

  it("⚠️ toda evidência EXIGIDA por uma ficha tem um emissor", () => {
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
    expect(daClassificacao({
      forma: "um-laco",
      criterios: [{ atributo: "cor", valor: "vermelho" }],
      colocacoes: [
        { peca: { id: 1, cor: "vermelho", forma: "circulo", tamanho: "grande" }, onde: [0], tentativas: [] },
        { peca: { id: 2, cor: "azul", forma: "quadrado", tamanho: "pequeno" }, onde: [0], tentativas: [[0]] },
      ],
    })).toEqual([]);
    expect(daContagem({ marcados: 4, total: 5, toquesRepetidos: 0, resposta: 4, arranjo: "disperso" })).toEqual([]);
    expect(daEscuta({ resposta: 4, alvo: 3, alternativas: [3, 4], repeticoes: 0 })).toEqual([]);
    expect(daProducao({ colocados: 3, alvo: 4, bandeja: 12, recusas: 0, comAndaime: false })).toEqual([]);
    expect(daForma({ pedida: "triangulo", escolhida: "circulo", pedidaGirada: true, escolhidaEmPe: true })).toEqual([]);
    expect(daGrandeza({ escolhido: 1, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: true, antesDoChao: false })).toEqual([]);
    expect(daMedida({
      modo: "peso", escolhido: 1, certo: 0, ordemCerta: [0, 1], ordemVisual: [1, 0],
      contraintuitivo: true, formatosDiferentes: false, verificou: true, maiorVisual: 1,
    })).toEqual([]);

    const dezena = construirMaterialDouradoSpec(4, () => 0);
    expect(daDezena({
      modo: "montar", resposta: dezena.total - 1, dezenasProduzidas: Math.max(0, dezena.dezenas - 1),
      unidadesProduzidas: dezena.unidades, contouUmAUm: false, trocasConcluidas: 0,
    }, dezena)).toEqual([]);

    const reta = construirReta20Spec(3, () => 0);
    expect(daReta({
      escolhido: reta.alvo + 1,
      posicaoInicial: reta.posicaoInicial,
      alvo: reta.alvo,
      salto: reta.salto,
      gesto: "toque",
      contouMarcaInicial: false,
    }, reta)).toEqual([]);
  });
});