import { afterEach, describe, expect, it } from "vitest";
import { Composer } from "../../Composer";
import { N3_10 } from "./N3.10";
import { gN3_10 } from "../../../utils/generators";
import { getTrackById } from "../../motores/curriculum";
import { applyJourneyAnswer } from "../../motores/progressEngine";
import { trackMisconception } from "../../motores/radarEngine";
import {
  COMPOSER_CANARIES,
  rollbackComposerCanary,
} from "../../motores/composerCanary";
import { Progress } from "../../../types";
import { misconceptionForAnswer, shouldRenderQuestionOptions } from "../../../components/gameloop/answerPolicy";

/**
 * Observabilidade do canário de N3.10 — o restante do Andar 4.
 *
 * A paridade já provou que o caminho autoral não regride. Falta provar que
 * promover o nó não quebra o que fica em volta: progresso salvo, telemetria,
 * caminho da Jornada e tratamento de erro.
 */

const progressoInicial = (): Progress => ({ lvl: 1, mast: 0, streak: 0 } as Progress);

describe("canário de N3.10 — saves, telemetria, Jornada e erro", () => {
  afterEach(() => {
    COMPOSER_CANARIES.clear();
    COMPOSER_CANARIES.add("N3.09");
    COMPOSER_CANARIES.add("N3.10");
  });

  describe("saves", () => {
    it("o progresso é indexado pelo id do nó, que a promoção não altera", () => {
      const antes = getTrackById("N3.10");
      rollbackComposerCanary("N3.10");
      const depois = getTrackById("N3.10");

      // Trocar o gerador não pode renomear a competência, senão o save órfã.
      expect(antes?.id).toBe("N3.10");
      expect(depois?.id).toBe("N3.10");
      expect(antes?.graphId).toBe(depois?.graphId);
      expect(antes?.prereqs).toEqual(depois?.prereqs);
    });

    it("um progresso salvo antes da promoção continua válido depois dela", () => {
      const salvo = { ...progressoInicial(), lvl: 3, mast: 2, maxLvl: 3 } as Progress;

      const resultado = applyJourneyAnswer(salvo, true, false);

      expect(resultado.progress.lvl).toBeGreaterThanOrEqual(3);
      expect(resultado.progress.maxLvl).toBeGreaterThanOrEqual(3);
      // O motor de progresso não conhece a origem do gerador, e é assim que deve
      // permanecer: promover um canário não pode exigir migração de save.
      expect(Object.keys(resultado.progress)).not.toContain("generatorSource");
    });

    it("o nível salvo é honrado pelo gerador autoral", () => {
      for (const lvl of [1, 3, 5]) {
        const q = getTrackById("N3.10")?.gen(lvl);
        expect(q, `nível ${lvl}`).toBeDefined();
        expect(q?.kind, `nível ${lvl}`).toBe("story-bars");
      }
    });
  });

  describe("telemetria", () => {
    it("a resposta errada carrega tag de misconception para o Radar", () => {
      const q = Composer.generate(N3_10, 3);
      const errada = (q.options ?? []).find(o => o.value !== q.answer && o.misconception);
      expect(errada, "alternativa errada com tag").toBeDefined();

      const tag = misconceptionForAnswer(q, errada!.value);
      expect(tag).toBeTruthy();
      expect(typeof tag).toBe("string");
    });

    it("a resposta certa não gera diagnóstico", () => {
      const q = Composer.generate(N3_10, 3);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
    });

    it("a tag emitida é aceita pelo Radar sem erro", () => {
      const q = Composer.generate(N3_10, 3);
      const errada = (q.options ?? []).find(o => o.value !== q.answer && o.misconception);
      const tag = misconceptionForAnswer(q, errada!.value)!;

      const progresso = progressoInicial();
      expect(() => trackMisconception(progresso, tag)).not.toThrow();
    });

    it("o legado não oferece diagnóstico, e é isso que a promoção melhora", () => {
      const legado = gN3_10(3);
      const comTag = (legado.options ?? []).filter(o => o.misconception);
      expect(comTag).toHaveLength(0);
    });
  });

  describe("Jornada", () => {
    it("N3.10 aparece na Jornada com o caminho autoral ligado", () => {
      const track = getTrackById("N3.10");
      expect(track).toBeDefined();
      expect(track?.generatorSource).toBe("composer");
      expect(track?.contentStatus).toBe("explicit");
    });

    it("a questão traz tudo que o GameLoop exige para montar a tela", () => {
      for (const lvl of [1, 2, 3, 4, 5]) {
        const q = Composer.generate(N3_10, lvl);
        expect(q.kind, `L${lvl}`).toBe("story-bars");
        expect(q.uiProps, `L${lvl}`).toBeDefined();
        expect(q.prompt, `L${lvl}`).toBeTruthy();
        expect(q.options?.length, `L${lvl}`).toBeGreaterThan(1);
        expect(typeof q.evaluate, `L${lvl}`).toBe("function");
      }
    });

    it("as alternativas são exibidas: a barra é leitura, não a interação", () => {
      const q = Composer.generate(N3_10, 3);
      // Diferente de vertical e array, aqui a primitiva não substitui as opções.
      expect(shouldRenderQuestionOptions(q)).toBe(true);
    });
  });

  describe("observação de erro", () => {
    it("errar não avança o nível e permite continuar na mesma questão", () => {
      const salvo = { ...progressoInicial(), lvl: 2, mast: 1 } as Progress;
      // Fora do aquecimento, para que a queda de nível seja possível.
      const resultado = applyJourneyAnswer(salvo, false, false);

      expect(resultado.progress.lvl).toBeLessThanOrEqual(2);
      expect(resultado.progress.mast).toBeLessThanOrEqual(1);
    });

    it("a resposta correta está presente exatamente uma vez em cada nível", () => {
      for (const lvl of [1, 2, 3, 4, 5]) {
        for (let i = 0; i < 40; i += 1) {
          const q = Composer.generate(N3_10, lvl);
          const certas = (q.options ?? []).filter(o => o.value === q.answer);
          expect(certas, `L${lvl}`).toHaveLength(1);
        }
      }
    });

    it("nenhuma alternativa é negativa, o que confundiria a criança", () => {
      for (const lvl of [1, 2, 3, 4, 5]) {
        for (let i = 0; i < 40; i += 1) {
          const q = Composer.generate(N3_10, lvl);
          for (const o of q.options ?? []) {
            expect(Number(o.value), `L${lvl}`).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    it("o gerador não entra em laço infinito nem lança em 500 amostras", () => {
      expect(() => {
        for (let i = 0; i < 500; i += 1) Composer.generate(N3_10, (i % 5) + 1);
      }).not.toThrow();
    });
  });
});
