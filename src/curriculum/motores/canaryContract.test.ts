import { afterEach, describe, expect, it } from "vitest";
import { Composer } from "../Composer";
import { geradorLegadoDe, getTrackById } from "./curriculum";
import { applyJourneyAnswer } from "./progressEngine";
import { trackMisconception } from "./radarEngine";
import { COMPOSER_CANARIES, rollbackComposerCanary, enableComposerCanary } from "./composerCanary";
import { N3_09 } from "../fichas/jornada/N3.09";
import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_03 } from "../fichas/jornada/N4.03";
import { N4_04 } from "../fichas/jornada/N4.04";
import { N4_07 } from "../fichas/jornada/N4.07";
import { N4_06 } from "../fichas/jornada/N4.06";
import { N4_08 } from "../fichas/jornada/N4.08";
import { N1_03 } from "../fichas/jornada/N1.03";
import { N1_07 } from "../fichas/jornada/N1.07";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_10 } from "../fichas/jornada/N1.10";
import { AL_01 } from "../fichas/jornada/AL.01";
import { AL_02 } from "../fichas/jornada/AL.02";
import { N1_04 } from "../fichas/jornada/N1.04";
import { N1_06 } from "../fichas/jornada/N1.06";
import { N1_02 } from "../fichas/jornada/N1.02";
import { N1_01 } from "../fichas/jornada/N1.01";
import { Progress, Question } from "../../types";
import { FichaCompetencia } from "../schema";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";

/**
 * Contrato do canário — o padrão que TODO nó promovido precisa cumprir.
 *
 * Este arquivo existe porque N3.10 foi promovido com nove verificações e N3.09,
 * promovido antes, tinha apenas paridade. Dois canários em produção com padrões
 * diferentes é dívida silenciosa: o mais fraco só aparece quando quebra.
 *
 * A suíte **enumera `COMPOSER_CANARIES`** em vez de listar nós à mão. Promover
 * um nó novo sem registrar seu legado e sua ficha aqui falha imediatamente, de
 * modo que o padrão não depende de alguém lembrar de aplicá-lo.
 */

/**
 * Cada canário declara APENAS sua ficha.
 *
 * O gerador legado não é declarado: é descoberto em `geradorLegadoDe`. Declarar
 * seria uma chance de declarar errado, e um legado errado faria a paridade
 * comparar a ficha nova com a coisa errada — passando sem verificar nada.
 *
 * A distinção que isso revela: nem toda promoção substitui algo.
 * - **Substituição** — o nó tinha gerador próprio. Paridade faz sentido.
 * - **Estreia** — o nó caía no placeholder "Em construção!". Paridade não quer
 *   dizer nada; o que importa é que ele deixou de ser um placeholder.
 *
 * Os 46 nós ainda em fallback são todos estreias. O contrato original só previa
 * substituição porque os dois primeiros canários por acaso eram desse tipo.
 */
const REGISTRO: Record<string, FichaCompetencia> = {
  "N3.09": N3_09,
  "N3.10": N3_10,
  "N4.03": N4_03,
  "N4.04": N4_04,
  "N4.07": N4_07,
  "N4.06": N4_06,
  "N4.08": N4_08,

  // Bloco F0. Estes seis já eram servidos por ficha em produção, mas por fora
  // do mecanismo — chamavam `Composer.generate` de dentro do gerador legado.
  // Regularizá-los os traz, pela primeira vez, para debaixo deste contrato.
  "N1.03": N1_03,
  "N1.07": N1_07,
  "N1.08": N1_08,
  "N1.10": N1_10,
  "AL.01": AL_01,

  // A ativação do bloco F0: as quatro que passaram o intervalo inteiro
  // desligadas, escritas nos passos 0 a 2 e olhadas print a print.
  //   N1.01 pareamento (F07) · N1.02 canhão (F27)
  //   N1.04 contar tocando (F01) · AL.02 padrões (F52)
  "N1.01": N1_01,
  "N1.02": N1_02,
  "N1.04": N1_04,
  "N1.06": N1_06,
  "AL.02": AL_02,
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
    expect(
      semRegistro,
      "promover um nó exige declarar aqui sua ficha e seu gerador legado",
    ).toEqual([]);
  });

  describe.each(CANARIOS)("%s", id => {
    const ficha = REGISTRO[id];
    const legado = geradorLegadoDe(id);
    const ehEstreia = legado === undefined;

    it("é servido pelo Composer com proveniência observável", () => {
      expect(getTrackById(id)?.generatorSource).toBe("composer");
      expect(getTrackById(id)?.contentStatus).toBe("explicit");
    });

    it("o rollback devolve o nó ao que havia antes, e a reativação o traz de volta", () => {
      rollbackComposerCanary(id);
      // Numa substituição volta o gerador legado; numa estreia volta o
      // placeholder. Nos dois casos o que importa é que SAI do Composer.
      expect(getTrackById(id)?.generatorSource).toBe(ehEstreia ? "fallback" : "legacy");

      enableComposerCanary(id);
      expect(getTrackById(id)?.generatorSource).toBe("composer");
    });

    it("a ficha autoral produz questão utilizável nos cinco níveis", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 20; i += 1) {
          const autoral = Composer.generate(ficha, lvl);
          expect(autoral.evaluate?.(autoral.answer), `${id} autoral L${lvl}`).toBe(true);
          expect(autoral.isFallback, `${id} L${lvl} devolveu placeholder`).toBeFalsy();

          // "Utilizável" era verificado como `Number(answer) >= 0`, o que
          // supunha que todo canário é aritmético — verdade enquanto os sete
          // primeiros eram contas. AL.01 é classificação: a resposta é o emoji
          // intruso, e `Number("🚗")` é NaN. N1.01 será "sobra"/"exato"/"falta".
          //
          // O que a asserção realmente queria dizer é o que está escrito agora:
          // a resposta existe e a criança consegue escolhê-la. É mais forte que
          // a versão numérica — esta pega gabarito fora das alternativas, que
          // aquela deixava passar.
          expect(autoral.answer, `${id} autoral L${lvl}: sem gabarito`)
            .not.toBeUndefined();
          expect(String(autoral.answer ?? "").length, `${id} autoral L${lvl}: gabarito vazio`)
            .toBeGreaterThan(0);
          if (autoral.options?.length) {
            expect(
              autoral.options.map(o => String(o.value)),
              `${id} autoral L${lvl}: gabarito fora das alternativas`,
            ).toContain(String(autoral.answer));
          }
          if (typeof autoral.answer === "number") {
            expect(autoral.answer, `${id} autoral L${lvl}`).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    it(ehEstreia
      ? "estreia: o nó deixou de ser placeholder"
      : "paridade: o gerador legado continua produzindo questão válida", () => {
      if (ehEstreia) {
        // Não há com o que comparar. O que se verifica é que o rollback devolve
        // ao placeholder — e portanto que a promoção trocou algo de verdade.
        rollbackComposerCanary(id);
        expect(getTrackById(id)?.gen(1).isFallback,
          `${id} não era placeholder antes: isto deveria ser substituição, não estreia`).toBe(true);
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
        const q = Composer.generate(ficha, lvl);
        expect(misconceptionForAnswer(q, q.answer), `${id} L${lvl}`).toBeUndefined();
      }
    });

    it("telemetria: quando há tag, o Radar a aceita sem erro", () => {
      const progresso = progressoInicial();
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 10; i += 1) {
          const q = Composer.generate(ficha, lvl);
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
        const q = Composer.generate(ficha, lvl);
        expect(q.kind, `${id} L${lvl}`).toBeTruthy();
        expect(q.uiProps, `${id} L${lvl}`).toBeDefined();
        expect(q.prompt, `${id} L${lvl}`).toBeTruthy();
        expect(typeof q.evaluate, `${id} L${lvl}`).toBe("function");
      }
    });

    it("erro: a resposta correta aparece exatamente uma vez quando há alternativas", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 30; i += 1) {
          const q = Composer.generate(ficha, lvl);
          if (!q.options?.length) continue;
          const certas = q.options.filter(o => o.value === q.answer);
          expect(certas, `${id} L${lvl}`).toHaveLength(1);
        }
      }
    });

    it("a tela nunca oferece mais de quatro alternativas", () => {
      // §9.1 do cânone: 3 a 4 opções tocáveis. Cinco apareceram de verdade em
      // N4.07 e só a captura de tela mostrou — excesso de escolha vira ruído
      // para quem tem 8 anos, não dificuldade. A guarda vale para TODO canário,
      // presente e futuro, em vez de ficar só na ficha que errou.
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 40; i += 1) {
          const q = Composer.generate(ficha, lvl);
          if (!q.options) continue;

          // Teclado não é leque de alternativas. O cânone §9.1 fixa "3 a 4
          // opções tocáveis" para o kind `plain` — escolher entre distratores —
          // e lista `count` ("tocar objetos 1 a 1") como mecânica distinta. A
          // F01 §5 manda um teclado 1-3, 1-5 ou 1-10, escalado ao escopo: com
          // quatro teclas, chutar acertaria em 25% e a cardinalidade deixaria de
          // ser observável.
          //
          // Isto NÃO é isenção: o teclado troca uma guarda por outra igualmente
          // estrita — ele tem de bater exatamente com o escopo que a ficha
          // declarou, e conter a resposta.
          const teclado = (q.uiProps as { tecladoAte?: number } | undefined)?.tecladoAte;
          if (typeof teclado === "number" && teclado > 0) {
            expect(q.options.length, `${id} L${lvl}: teclado fora do escopo`).toBe(teclado);
            expect(q.options.map(o => o.value), `${id} L${lvl}: teclado sem a resposta`)
              .toContain(q.answer);
            continue;
          }

          expect(q.options.length, `${id} L${lvl}: ${q.options.length} opções`)
            .toBeLessThanOrEqual(4);
          expect(q.options.length, `${id} L${lvl}`).toBeGreaterThanOrEqual(2);
        }
      }
    });

    it("erro: nenhuma alternativa numérica é negativa", () => {
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 30; i += 1) {
          const q = Composer.generate(ficha, lvl);
          for (const o of q.options ?? []) {
            if (typeof o.value !== "number") continue;
            expect(o.value, `${id} L${lvl}`).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    it("erro: 500 amostras sem laço infinito nem exceção", () => {
      expect(() => {
        for (let i = 0; i < 500; i += 1) Composer.generate(ficha, (i % 5) + 1);
      }).not.toThrow();
    });
  });
});
