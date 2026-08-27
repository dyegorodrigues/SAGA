import { afterEach, describe, expect, it } from "vitest";
import { JOURNEY_FICHAS } from "./fichas";
import { generateRegisteredFichaQuestion, hasComposerFicha } from "./motores/composerCanary";
import { applyJourneyAnswer } from "./motores/progressEngine";
import { evidenciasDaResposta } from "../components/gameloop/answerPolicy";
import { evidenciaDeFamilia, prefixoDeFamilia } from "./procedimentos/familiaIntegradora";
import type { FichaCompetencia } from "./schema";
import type { Progress } from "../types";

/**
 * CLASS-008 — um nível que integra famílias não pode coroar uma família só.
 *
 * A definição operacional da classe: um nível declara integrar duas ou mais
 * famílias conceitualmente distinguíveis, o gerador escolhe entre elas ao
 * produzir as tentativas, e a regra de domínio conta somente acertos, janela e
 * sessões. A criança satisfaz o mastery tendo demonstrado UMA das famílias que
 * o nível existe para integrar, e a coroa afirma que ela integrou.
 *
 * O mecanismo de reparo já existia — `evidenciasDistintas` no domínio da micro,
 * e o `progressEngine` já sabia segurar a evidência da ficha até o mínimo
 * aparecer. Faltava o caminho: ninguém EMITIA a identidade da família, e os
 * builders genéricos não TRANSPORTAVAM o requisito até a questão.
 *
 * Este gate prova as três coisas separadas, porque cada uma quebra sozinha:
 * emissão, transporte e aplicação.
 *
 * Ele é por descoberta (D068): quem decide se um nível integra é o COMPORTAMENTO
 * do gerador — quantas famílias distintas ele produz —, não uma lista de nomes.
 * Nível novo que sortear famílias e esquecer a regra reprova sem ninguém
 * inscrever nada; nível que parou de sortear e manteve a regra também.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}

const microDoNivel = (ficha: FichaCompetencia, nivel: number) => {
  const id = ficha.niveis?.[nivel]?.micro;
  return id ? ficha.micros.find(micro => micro.id === id) : undefined;
};

/** As famílias que o gerador realmente produz naquele nível. */
function familiasGeradas(id: string, nivel: number): Set<string> {
  const familias = new Set<string>();
  semear(0x51c3a7f);
  for (let i = 0; i < AMOSTRAS; i += 1) {
    const evidencia = generateRegisteredFichaQuestion(id, nivel).evidenciaDeFamilia;
    if (evidencia) familias.add(evidencia);
  }
  Math.random = original;
  return familias;
}

const servidas = () => JOURNEY_FICHAS.filter(ficha => hasComposerFicha(ficha.id));

const noUltimoNivel = (): Progress => ({ lvl: 5, maxLvl: 5, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 });

/** Todos os níveis integradores, achados pelo comportamento do gerador. */
function integradores(): Array<{ id: string; nivel: number; familias: string[] }> {
  const achados: Array<{ id: string; nivel: number; familias: string[] }> = [];
  for (const ficha of servidas()) {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const familias = [...familiasGeradas(ficha.id, nivel)];
      if (familias.length > 1) achados.push({ id: ficha.id, nivel, familias });
    }
  }
  return achados;
}

describe("CLASS-008 — o nível integrador exige mais de uma família", () => {
  it("a varredura cobre todas as fichas servidas pelo Composer", () => {
    expect(servidas().length).toBeGreaterThanOrEqual(75);
  });

  it("transporte: o que a ficha declara chega à questão", { timeout: 180000 }, () => {
    const perdidos: string[] = [];
    for (const ficha of servidas()) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const declarado = microDoNivel(ficha, nivel)?.dominio?.evidenciasDistintas;
        if (!declarado) continue;
        const transportado = generateRegisteredFichaQuestion(ficha.id, nivel).masteryRule?.evidenciasDistintas;
        if (JSON.stringify(transportado) !== JSON.stringify(declarado)) {
          perdidos.push(`${ficha.id} L${nivel}: declarado ${JSON.stringify(declarado)}, transportado ${JSON.stringify(transportado)}`);
        }
      }
    }
    expect(perdidos, `requisito de diversidade perdido no caminho:\n${perdidos.join("\n")}`).toEqual([]);
  });

  it("emissão e aplicação: quem sorteia família exige família, e quem exige sorteia", { timeout: 300000 }, () => {
    const semRegra: string[] = [];
    const semFamilias: string[] = [];

    for (const ficha of servidas()) {
      for (let nivel = 1; nivel <= 5; nivel += 1) {
        const familias = familiasGeradas(ficha.id, nivel);
        const regra = generateRegisteredFichaQuestion(ficha.id, nivel).masteryRule?.evidenciasDistintas;
        const daFicha = regra?.prefixo === prefixoDeFamilia(ficha.id) ? regra : undefined;

        // Ida: o gerador sorteia entre famílias e a regra é cega a isso.
        if (familias.size > 1 && !daFicha) {
          semRegra.push(`${ficha.id} L${nivel} sorteia ${familias.size} famílias e não exige nenhuma`);
        }
        // Volta: a regra exige diversidade que o gerador não consegue produzir.
        // Sem esta metade, bastaria escrever a exigência em toda ficha para o
        // gate ficar verde — e uma exigência que o nível nunca satisfaz é uma
        // coroa que nunca chega.
        if (daFicha && familias.size < daFicha.minimo) {
          semFamilias.push(`${ficha.id} L${nivel} exige ${daFicha.minimo} famílias e o gerador produz ${familias.size}`);
        }
      }
    }

    expect(semRegra, `níveis integradores sem exigência de diversidade:\n${semRegra.join("\n")}`).toEqual([]);
    expect(semFamilias, `exigências que o gerador não consegue satisfazer:\n${semFamilias.join("\n")}`).toEqual([]);
  });

  it("uma família repetida NÃO compra a coroa; a diversidade exigida SIM", { timeout: 300000 }, () => {
    const encontrados = integradores();
    // Se a varredura não achar nível integrador nenhum, este teste passaria
    // calado sem exercitar nada — e é justamente o motor que ele existe para
    // provar. A classe tem testemunhas medidas; zero aqui é medição quebrada.
    expect(encontrados.length, "a varredura não achou nível integrador nenhum").toBeGreaterThan(5);

    for (const { id, nivel, familias } of encontrados) {
      const regra = generateRegisteredFichaQuestion(id, nivel).masteryRule!;
      const tentativa = (dia: string, familia: string) => ({
        durationMs: 20_000,
        helpUsed: false,
        isReview: false,
        practiceDay: dia,
        evidencias: [familia],
        masteryRule: regra,
      });
      const dias = ["2026-08-10", "2026-08-12", "2026-08-14"];

      // Caminho A: acerta de sobra, em sessões espaçadas, sempre na MESMA
      // família. É o caminho que a CLASS-008 descreve, e ele não pode coroar.
      let teimoso = noUltimoNivel();
      for (const dia of dias) {
        for (let i = 0; i < regra.de; i += 1) {
          teimoso = applyJourneyAnswer(teimoso, true, false, tentativa(dia, familias[0])).progress;
        }
      }
      expect(teimoso.masteryEvidence?.evidenciaDaFicha, `${id} L${nivel}: uma família só deu evidência da ficha`).toBe(false);
      expect(teimoso.dom, `${id} L${nivel}: uma família só comprou a coroa`).not.toBe(true);

      // Caminho B: o mesmo esforço, com a segunda família aparecendo.
      let diverso = noUltimoNivel();
      for (const dia of dias) {
        for (let i = 0; i < regra.de; i += 1) {
          diverso = applyJourneyAnswer(diverso, true, false, tentativa(dia, familias[i % familias.length])).progress;
        }
      }
      expect(diverso.masteryEvidence?.evidenciaDaFicha, `${id} L${nivel}: a diversidade não deu a evidência da ficha`).toBe(true);
    }
  });

  it("a casca emite a família junto das outras evidências da resposta certa", () => {
    // O elo que faltava era este: sem ele, o requisito viaja até o motor e
    // nunca recebe uma família para contar — a coroa não chegaria nunca, que é
    // o defeito espelhado do que a classe veio corrigir.
    const { id, nivel } = integradores()[0];
    const q = generateRegisteredFichaQuestion(id, nivel);
    expect(q.evidenciaDeFamilia, `${id} L${nivel} sem etiqueta de família`).toBeDefined();
    expect(evidenciasDaResposta(undefined, q)).toContain(q.evidenciaDeFamilia);
    expect(evidenciasDaResposta({ evidencias: ["outra-coisa"] }, q))
      .toEqual(expect.arrayContaining([q.evidenciaDeFamilia!, "outra-coisa"]));
  });

  it("a família de uma ficha não compra a diversidade de outra", () => {
    // O prefixo é por competência de propósito. Com um prefixo global, uma
    // criança que alternasse entre duas COMPETÊNCIAS satisfaria a diversidade
    // de ambas sem ter alternado dentro de nenhuma.
    const [uma, outra] = integradores().slice(0, 2);
    expect(uma, "faltam níveis integradores para comparar").toBeDefined();
    const regra = generateRegisteredFichaQuestion(uma.id, uma.nivel).masteryRule!;
    let progresso = noUltimoNivel();
    for (const dia of ["2026-08-10", "2026-08-12"]) {
      for (let i = 0; i < regra.de; i += 1) {
        const familia = i === 0 ? evidenciaDeFamilia(outra.id, "qualquer") : uma.familias[0];
        progresso = applyJourneyAnswer(progresso, true, false, {
          durationMs: 20_000, helpUsed: false, isReview: false, practiceDay: dia,
          evidencias: [familia], masteryRule: regra,
        }).progress;
      }
    }
    expect(progresso.masteryEvidence?.evidenciaDaFicha, `${uma.id}: a família de ${outra.id} comprou a diversidade`).toBe(false);
  });
});
