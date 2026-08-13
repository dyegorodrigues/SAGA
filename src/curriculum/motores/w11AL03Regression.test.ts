import { afterEach, describe, expect, it } from "vitest";
import type { Progress } from "../../types";
import {
  COMPOSER_CANARIES,
  enableComposerCanary,
  rollbackComposerCanary,
} from "./composerCanary";
import { getTrackById } from "./curriculum";
import { applyJourneyAnswer } from "./progressEngine";
import {
  construirSkipCountF30Spec,
} from "../procedimentos/skipCountContract";
import { resolucaoTerminaNaResposta } from "../procedimentos/resolutionProcedure";

/**
 * W11 — AL.03 / F30, regression-first.
 *
 * A fonte normativa pede contagem por saltos com retirada progressiva dos
 * andaimes: 2 em 2 na reta, 10 em 10 na reta, 5 em 5 compondo reta +
 * Quadrado100, sequência escrita sem manipulável e início deslocado mental.
 * Hoje AL.03 ainda é legado e o L5 legado conta para trás; este teste liga
 * temporariamente a MESMA porta de canário de produção e fixa o contrato que a
 * implementação registrada/inativa deve satisfazer antes de qualquer promoção.
 */
const CANARIOS_ORIGINAIS = [...COMPOSER_CANARIES];

type ApoioF30 = "reta-arcos" | "reta" | "reta-quadrado100" | "sequencia" | "mental";
interface SkipCountF30Spec {
  nivel: number;
  salto: number;
  inicio: number;
  sequencia: number[];
  resposta: number;
  apoio: ApoioF30;
  limite: number;
  mostrarReta: boolean;
  mostrarQuadrado100: boolean;
}

function questao(nivel: number) {
  return getTrackById("AL.03")!.gen(nivel);
}

function spec(nivel: number): SkipCountF30Spec {
  return questao(nivel).uiProps as SkipCountF30Spec;
}

function sorteio(...valores: number[]) {
  let indice = 0;
  return () => valores[Math.min(indice++, valores.length - 1)] ?? 0;
}

function progressoL5(): Progress {
  return {
    lvl: 5,
    maxLvl: 5,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 0,
    tot: 0,
    bank: [],
    mast: 0,
  };
}

describe("W11 AL.03 — contagem por saltos F30", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS_ORIGINAIS) COMPOSER_CANARIES.add(id);
  });

  it("antes da promoção continua servido pelo legado", () => {
    rollbackComposerCanary("AL.03");
    expect(getTrackById("AL.03")?.generatorSource).toBe("legacy");
  });

  it("pode ser ligado pela porta de canário e usa kind especializado local", () => {
    expect(() => enableComposerCanary("AL.03")).not.toThrow();
    expect(getTrackById("AL.03")?.generatorSource).toBe("composer");
    expect(questao(1).kind).toBe("skip-count-f30");
  });

  it("cumpre a escada F30 sem criar uma segunda reta", () => {
    enableComposerCanary("AL.03");

    expect(spec(1)).toMatchObject({ nivel: 1, salto: 2, inicio: 0, apoio: "reta-arcos", limite: 10, mostrarReta: true, mostrarQuadrado100: false });
    expect(spec(2)).toMatchObject({ nivel: 2, salto: 10, inicio: 0, apoio: "reta", limite: 100, mostrarReta: true, mostrarQuadrado100: false });
    expect(spec(3)).toMatchObject({ nivel: 3, salto: 5, inicio: 0, apoio: "reta-quadrado100", limite: 50, mostrarReta: true, mostrarQuadrado100: true });
    expect(spec(4)).toMatchObject({ nivel: 4, apoio: "sequencia", limite: 100, mostrarReta: false, mostrarQuadrado100: false });

    const l5 = spec(5);
    expect(l5).toMatchObject({ nivel: 5, apoio: "mental", limite: 100, mostrarReta: false, mostrarQuadrado100: false });
    expect(l5.inicio).toBeGreaterThan(0);
  });

  it("generaliza além de 2/5/10 e materializa o exemplo canônico 3 em 3 a partir de 6", () => {
    const l4 = construirSkipCountF30Spec(4, sorteio(0.13, 0));
    expect(l4).toMatchObject({ nivel: 4, salto: 3, inicio: 0, apoio: "sequencia" });

    const l5 = construirSkipCountF30Spec(5, sorteio(0.13, 0.27, 0));
    expect(l5).toMatchObject({ nivel: 5, salto: 3, inicio: 6, apoio: "mental" });
    expect(l5.sequencia.slice(0, 3)).toEqual([6, 9, 12]);
  });

  it("gera progressão ascendente uniforme e resposta calculada do próprio item", () => {
    enableComposerCanary("AL.03");
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      for (let tentativa = 0; tentativa < 30; tentativa += 1) {
        const q = questao(nivel);
        const s = q.uiProps as SkipCountF30Spec;
        expect(s.sequencia.length).toBeGreaterThanOrEqual(3);
        if (nivel >= 4) expect(s.salto).toBeGreaterThanOrEqual(2);
        if (nivel >= 4) expect(s.salto).toBeLessThanOrEqual(10);
        for (let i = 1; i < s.sequencia.length; i += 1) {
          expect(s.sequencia[i] - s.sequencia[i - 1]).toBe(s.salto);
        }
        expect(s.resposta).toBe(s.sequencia.at(-1)! + s.salto);
        expect(s.resposta).toBeLessThanOrEqual(s.limite);
        expect(q.answer).toBe(s.resposta);
        expect(q.evaluate?.(q.answer)).toBe(true);
        expect(q.evaluate?.(Number(q.answer) + 1)).toBe(false);
      }
    }
  });

  it("nasce sob R0-A: resolução declarativa termina na resposta e cobre misconceptions canônicas", () => {
    enableComposerCanary("AL.03");
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = questao(nivel);
      expect(q.resolucao).toBeDefined();
      expect(resolucaoTerminaNaResposta(q.resolucao!, q.answer)).toBe(true);
      for (const passo of q.resolucao!.passos) for (const tag of passo.corrige ?? []) tags.add(String(tag));
    }
    expect(tags).toEqual(new Set(["PERDE_O_SALTO", "SALTO_DUPLO", "SO_DEZENAS", "NAO_PARTE_DE"]));
  });

  it("preserva 3/3 em 2 sessões, exige dois saltos e impede RT de comprar a coroa", () => {
    enableComposerCanary("AL.03");
    const q = questao(5);
    expect(q.masteryRule).toEqual({
      acertos: 3,
      de: 3,
      sessoes: 2,
      evidenciasDistintas: {
        prefixo: "contagem-saltos-passo-",
        minimo: 2,
        descricao: "Demonstrar pelo menos dois saltos diferentes.",
      },
    });
    expect(q.rt_max_s).toBe(8);
    expect(q.evaluate?.(q.answer)).toBe(true);

    const tentativa = (dia: string, salto: number, durationMs: number) => ({
      durationMs,
      targetRtMs: 8000,
      helpUsed: false,
      isReview: false,
      practiceDay: dia,
      evidencias: [`contagem-saltos-passo-${salto}`],
      masteryRule: q.masteryRule,
    });

    // Seis acertos instantâneos, em duas datas, mas todos no mesmo salto: sem
    // diversidade não existe sessão madura nem coroa.
    let rapido = progressoL5();
    for (const dia of ["2026-08-10", "2026-08-12"]) {
      for (let i = 0; i < 3; i += 1) {
        rapido = applyJourneyAnswer(rapido, true, false, tentativa(dia, 2, 100)).progress;
      }
    }
    expect(rapido.masteryEvidence?.fluencyStreak).toBe(3);
    expect(rapido.masteryEvidence?.evidenciaDaFicha).toBe(false);
    expect(rapido.masteryEvidence?.passedSessionDays).toEqual([]);
    expect(rapido.dom).not.toBe(true);

    // O caminho lento, ao demonstrar dois saltos, amadurece a primeira sessão;
    // uma segunda sessão espaçada coroa mesmo com RT acima do alvo.
    let diverso = progressoL5();
    for (let i = 0; i < 3; i += 1) {
      diverso = applyJourneyAnswer(diverso, true, false, tentativa("2026-08-10", 2, 20_000)).progress;
    }
    diverso = applyJourneyAnswer(diverso, true, false, tentativa("2026-08-10", 5, 20_000)).progress;
    expect(diverso.masteryEvidence?.passedSessionDays).toEqual(["2026-08-10"]);
    expect(diverso.masteryEvidence?.fluencyStreak).toBe(0);

    for (let i = 0; i < 3; i += 1) {
      diverso = applyJourneyAnswer(diverso, true, false, tentativa("2026-08-12", 3, 20_000)).progress;
    }
    expect(diverso.masteryEvidence?.passedSessionDays).toEqual(["2026-08-10", "2026-08-12"]);
    expect(diverso.masteryEvidence?.fluencyStreak).toBe(0);
    expect(diverso.dom).toBe(true);
  });
});
