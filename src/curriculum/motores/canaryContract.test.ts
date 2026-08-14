import { afterEach, describe, expect, it } from "vitest";
import { geradorLegadoDe, getTrackById } from "./curriculum";
import { applyJourneyAnswer } from "./progressEngine";
import { trackMisconception } from "./radarEngine";
import { COMPOSER_CANARIES, rollbackComposerCanary, enableComposerCanary, generateRegisteredFichaQuestion } from "./composerCanary";
import { N3_01 } from "../fichas/jornada/N3.01";
import { N3_02 } from "../fichas/jornada/N3.02";
import { N3_03 } from "../fichas/jornada/N3.03";
import { N3_09 } from "../fichas/jornada/N3.09";
import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_01 } from "../fichas/jornada/N4.01";
import { N4_03 } from "../fichas/jornada/N4.03";
import { N4_04 } from "../fichas/jornada/N4.04";
import { N4_07 } from "../fichas/jornada/N4.07";
import { N4_06 } from "../fichas/jornada/N4.06";
import { N4_08 } from "../fichas/jornada/N4.08";
import { N4_09 } from "../fichas/jornada/N4.09";
import { N5_01 } from "../fichas/jornada/N5.01";
import { N1_03 } from "../fichas/jornada/N1.03";
import { N1_05 } from "../fichas/jornada/N1.05";
import { N1_07 } from "../fichas/jornada/N1.07";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_09 } from "../fichas/jornada/N1.09";
import { N1_10 } from "../fichas/jornada/N1.10";
import { N1_11 } from "../fichas/jornada/N1.11";
import { N1_12 } from "../fichas/jornada/N1.12";
import { N2_01 } from "../fichas/jornada/N2.01";
import { N2_02 } from "../fichas/jornada/N2.02";
import { N2_03 } from "../fichas/jornada/N2.03";
import { AL_01 } from "../fichas/jornada/AL.01";
import { AL_02 } from "../fichas/jornada/AL.02";
import { AL_03 } from "../fichas/jornada/AL.03";
import { AL_04 } from "../fichas/jornada/AL.04";
import { N1_04 } from "../fichas/jornada/N1.04";
import { N1_06 } from "../fichas/jornada/N1.06";
import { N1_13 } from "../fichas/jornada/N1.13";
import { GE_01 } from "../fichas/jornada/GE.01";
import { GE_02 } from "../fichas/jornada/GE.02";
import { GE_03 } from "../fichas/jornada/GE.03";
import { GM_01 } from "../fichas/jornada/GM.01";
import { GM_02 } from "../fichas/jornada/GM.02";
import { GM_05 } from "../fichas/jornada/GM.05";
import { GM_12 } from "../fichas/jornada/GM.12";
import { N1_02 } from "../fichas/jornada/N1.02";
import { N1_01 } from "../fichas/jornada/N1.01";
import { Progress, Question } from "../../types";
import { FichaCompetencia } from "../schema";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";

const REGISTRO: Record<string, FichaCompetencia> = {
  "N3.01": N3_01,
  "N3.02": N3_02,
  "N3.03": N3_03,
  "N3.09": N3_09,
  "N3.10": N3_10,
  "N4.01": N4_01,
  "N4.03": N4_03,
  "N4.04": N4_04,
  "N4.07": N4_07,
  "N4.06": N4_06,
  "N4.08": N4_08,
  "N4.09": N4_09,
  "N5.01": N5_01,
  "N1.03": N1_03,
  "N1.05": N1_05,
  "N1.07": N1_07,
  "N1.08": N1_08,
  "N1.09": N1_09,
  "N1.10": N1_10,
  "N1.11": N1_11,
  "AL.01": AL_01,
  "AL.03": AL_03,
  "AL.04": AL_04,
  "N1.01": N1_01,
  "N1.02": N1_02,
  "N1.04": N1_04,
  "N1.06": N1_06,
  "N1.13": N1_13,
  "GE.01": GE_01,
  "GE.02": GE_02,
  "GM.01": GM_01,
  "GM.02": GM_02,
  "GM.12": GM_12,
  "N2.01": N2_01,
  "N2.02": N2_02,
  "N2.03": N2_03,
  "N1.12": N1_12,
  "GM.05": GM_05,
  "AL.02": AL_02,
  "GE.03": GE_03,
};

const CANARIOS = [...COMPOSER_CANARIES];
const progressoInicial = (): Progress => ({ lvl: 1, mast: 0, streak: 0 } as Progress);

describe("contrato do canário do Composer", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    for (const id of CANARIOS) COMPOSER_CANARIES.add(id);
  });

  it("todo canário ativo está registrado neste contrato", () => {
    const semRegistro = CANARIOS.filter(id => !REGISTRO[id]);
    expect(semRegistro, "promover um nó exige declarar aqui sua ficha").toEqual([]);
  });

  describe.each(CANARIOS)("%s", id => {
    const legado = geradorLegadoDe(id);
    const ehEstreia = legado === undefined;
    const gerarAutoral = (lvl: number): Question => generateRegisteredFichaQuestion(id, lvl);

    it("é servido pelo Composer com proveniência observável", () => {
      expect(getTrackById(id)?.generatorSource).toBe("composer");
      expect(getTrackById(id)?.contentStatus).toBe("explicit");
    });

    it("o rollback devolve o nó ao que havia antes, e a reativação o traz de volta", () => {
      rollbackComposerCanary(id);
      expect(getTrackById(id)?.generatorSource).toBe(ehEstreia ? "fallback" : "legacy");
      enableComposerCanary(id);
      expect(getTrackById(id)?.generatorSource).toBe("composer");
    });

    it("a ficha autoral produz questão utilizável nos cinco níveis", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 20; i += 1) {
          const autoral = gerarAutoral(lvl);
          expect(autoral.evaluate?.(autoral.answer), `${id} autoral L${lvl}`).toBe(true);
          expect(autoral.isFallback, `${id} L${lvl} devolveu placeholder`).toBeFalsy();
          expect(autoral.answer, `${id} autoral L${lvl}: sem gabarito`).not.toBeUndefined();
          expect(String(autoral.answer ?? "").length, `${id} autoral L${lvl}: gabarito vazio`).toBeGreaterThan(0);
          if (autoral.options?.length) {
            expect(autoral.options.map(o => String(o.value)), `${id} autoral L${lvl}: gabarito fora das alternativas`).toContain(String(autoral.answer));
          }
          if (typeof autoral.answer === "number") expect(autoral.answer, `${id} autoral L${lvl}`).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it(ehEstreia ? "estreia: o nó deixou de ser placeholder" : "paridade: o gerador legado continua produzindo questão válida", () => {
      if (ehEstreia) {
        rollbackComposerCanary(id);
        expect(getTrackById(id)?.gen(1).isFallback, `${id} não era placeholder antes`).toBe(true);
        enableComposerCanary(id);
        expect(getTrackById(id)?.gen(1).isFallback).toBeFalsy();
        return;
      }
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        const antigo = legado!(lvl);
        expect(antigo.answer, `${id} legado L${lvl}`).toBeDefined();
        expect(antigo.isFallback, `${id} legado L${lvl} é placeholder`).toBeFalsy();
      }
    });

    it("saves: a promoção não altera id, graphId nem pré-requisitos", () => {
      const antes = getTrackById(id);
      rollbackComposerCanary(id);
      const depois = getTrackById(id);
      expect(antes?.id).toBe(id);
      expect(depois?.id).toBe(id);
      expect(antes?.graphId).toBe(depois?.graphId);
      expect(antes?.prereqs).toEqual(depois?.prereqs);
    });

    it("saves: um progresso salvo continua válido após a promoção", () => {
      const salvo = { ...progressoInicial(), lvl: 3, mast: 2, maxLvl: 3 } as Progress;
      const resultado = applyJourneyAnswer(salvo, true, false);
      expect(resultado.progress.maxLvl).toBeGreaterThanOrEqual(3);
    });

    it("telemetria: a resposta certa não gera diagnóstico", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        const q = gerarAutoral(lvl);
        expect(misconceptionForAnswer(q, q.answer), `${id} L${lvl}`).toBeUndefined();
      }
    });

    it("telemetria: quando há tag, o Radar a aceita sem erro", () => {
      const progresso = progressoInicial();
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 10; i += 1) {
          const q = gerarAutoral(lvl);
          const errada = (q.options ?? []).find(o => o.value !== q.answer && o.misconception);
          if (!errada) continue;
          const tag = misconceptionForAnswer(q, errada.value);
          expect(tag, `${id} L${lvl}`).toBeTruthy();
          expect(() => trackMisconception(progresso, tag!)).not.toThrow();
        }
      }
    });

    it("Jornada: a questão traz tudo que o GameLoop exige", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        const q = gerarAutoral(lvl);
        expect(q.kind, `${id} L${lvl}`).toBeTruthy();
        expect(q.uiProps, `${id} L${lvl}`).toBeDefined();
        expect(q.prompt, `${id} L${lvl}`).toBeTruthy();
        expect(typeof q.evaluate, `${id} L${lvl}`).toBe("function");
      }
    });

    it("erro: a resposta correta aparece exatamente uma vez quando há alternativas", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 30; i += 1) {
          const q = gerarAutoral(lvl);
          if (!q.options?.length) continue;
          expect(q.options.filter(o => o.value === q.answer), `${id} L${lvl}`).toHaveLength(1);
        }
      }
    });

    it("a superfície de resposta respeita o contrato de cada palco", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 40; i += 1) {
          const q = gerarAutoral(lvl);
          if (!q.options) continue;
          const teclado = (q.uiProps as { tecladoAte?: number } | undefined)?.tecladoAte;
          if (q.kind === "emojirow-riscar-f15") {
            expect(teclado, `${id} L${lvl}: teto do teclado autoral`).toBe(10);
            expect(typeof q.answer, `${id} L${lvl}: resposta do teclado`).toBe("number");
            expect(Number(q.answer), `${id} L${lvl}: resposta abaixo de zero`).toBeGreaterThanOrEqual(0);
            expect(Number(q.answer), `${id} L${lvl}: resposta acima do teclado`).toBeLessThanOrEqual(teclado!);
            expect(new Set(q.options.map(o => o.value)).size, `${id} L${lvl}: diagnósticos duplicados`).toBe(q.options.length);
            expect(q.options.map(o => o.value), `${id} L${lvl}: diagnóstico sem gabarito`).toContain(q.answer);
            continue;
          }
          if (typeof teclado === "number" && teclado > 0) {
            expect(q.options.length, `${id} L${lvl}: teclado fora do escopo`).toBe(teclado);
            expect(q.options.map(o => o.value), `${id} L${lvl}: teclado sem a resposta`).toContain(q.answer);
            continue;
          }
          expect(q.options.length, `${id} L${lvl}: ${q.options.length} opções`).toBeLessThanOrEqual(4);
          expect(q.options.length, `${id} L${lvl}`).toBeGreaterThanOrEqual(2);
        }
      }
    });

    it("erro: nenhuma alternativa numérica é negativa", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 30; i += 1) {
          const q = gerarAutoral(lvl);
          for (const o of q.options ?? []) if (typeof o.value === "number") expect(o.value, `${id} L${lvl}`).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it("erro: 500 amostras sem laço infinito nem exceção", () => {
      expect(() => { for (let i = 0; i < 500; i += 1) gerarAutoral((i % 5) + 1); }).not.toThrow();
    });
  });
});
