import { afterEach, describe, expect, it } from "vitest";
import { geradorLegadoDe, getTrackById } from "./curriculum";
import { applyJourneyAnswer } from "./progressEngine";
import { trackMisconception } from "./radarEngine";
import { COMPOSER_CANARIES, rollbackComposerCanary, enableComposerCanary, generateRegisteredFichaQuestion } from "./composerCanary";
import { JOURNEY_FICHAS } from "../fichas";
import { Progress, Question } from "../../types";
import { FichaCompetencia } from "../schema";
import { misconceptionForAnswer } from "../../components/gameloop/answerPolicy";

/**
 * O contrato não mantém uma segunda lista manual de fichas: o catálogo de
 * Jornada é a autoridade. Assim toda promoção ainda precisa estar registrada,
 * mas uma onda nova não cria dívida de bookkeeping paralela ao catálogo.
 */
const REGISTRO: Record<string, FichaCompetencia> = Object.fromEntries(
  JOURNEY_FICHAS.map(ficha => [ficha.id, ficha]),
);

const CANARIOS = [...COMPOSER_CANARIES];
const progressoInicial = (): Progress => ({ lvl: 1, mast: 0, streak: 0 } as Progress);

/**
 * O piso numérico de cada canário sai da ficha, não de uma lista de exceções
 * mantida aqui.
 *
 * O contrato exigia `>= 0` de todo número em qualquer nó. Isso valeu enquanto
 * o currículo inteiro vivia nos naturais: ali um negativo na tela só podia ser
 * gerador estourando um limite. A F84 ensina o sinal, e a mesma regra passou a
 * recusar `-3` — que é o gabarito correto de N7.01 no L1.
 *
 * A saída não é remover a regra nem abrir exceção por id: é perguntar à ficha
 * qual conjunto ela ensina. Quem não declara nada continua nos naturais, então
 * os outros canários seguem protegidos exatamente como antes, e um gerador que
 * comece a produzir negativos por engano ainda quebra o contrato.
 */
const pisoNumericoDe = (id: string): number => (REGISTRO[id]?.dominioNumerico === "inteiros" ? -Infinity : 0);

/**
 * Trocar sinal por conjunto não pode virar cheque em branco: onde o negativo é
 * permitido, o contrato ainda exige inteiro finito. `NaN`, `Infinity` e frações
 * continuam sendo defeito de gerador em qualquer ficha da Jornada.
 */
const exigirInteiroFinito = (valor: number, contexto: string) => {
  expect(Number.isFinite(valor), `${contexto}: número não finito`).toBe(true);
  expect(Number.isInteger(valor), `${contexto}: número não inteiro`).toBe(true);
};

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
          if (typeof autoral.answer === "number") {
            exigirInteiroFinito(autoral.answer, `${id} autoral L${lvl}`);
            expect(autoral.answer, `${id} autoral L${lvl}`).toBeGreaterThanOrEqual(pisoNumericoDe(id));
          }
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
          if (q.kind === "reta-completa-f84") {
            // O palco onde o negativo é conteúdo é também onde o contrato
            // precisa ser mais específico: perdido o `>= 0` genérico, quem
            // segura um gerador fora de eixo é a própria reta desenhada.
            const reta = q.uiProps as { inicio: number; fim: number; pontos: number[]; modo: string };
            const comprimento = reta.fim - reta.inicio;
            expect(reta.inicio, `${id} L${lvl}: reta não alcança o negativo`).toBeLessThan(0);
            expect(reta.fim, `${id} L${lvl}: reta não alcança o positivo`).toBeGreaterThan(0);
            for (const ponto of reta.pontos) {
              expect(ponto, `${id} L${lvl}: ponto fora da reta`).toBeGreaterThanOrEqual(reta.inicio);
              expect(ponto, `${id} L${lvl}: ponto fora da reta`).toBeLessThanOrEqual(reta.fim);
            }
            if (reta.modo === "localizar" || reta.modo === "comparar-negativos") {
              // Posição: o gabarito é um lugar na reta, e precisa caber nela.
              expect(Number(q.answer), `${id} L${lvl}: gabarito à esquerda da reta`).toBeGreaterThanOrEqual(reta.inicio);
              expect(Number(q.answer), `${id} L${lvl}: gabarito à direita da reta`).toBeLessThanOrEqual(reta.fim);
            } else if (reta.modo === "distancia" || reta.modo === "modulo") {
              // Distância: aqui o sinal continua proibido no gabarito — medida
              // negativa é erro, mesmo numa ficha que ensina negativos.
              expect(Number(q.answer), `${id} L${lvl}: distância negativa`).toBeGreaterThanOrEqual(0);
              expect(Number(q.answer), `${id} L${lvl}: distância maior que a reta`).toBeLessThanOrEqual(comprimento);
            } else {
              // Ordenação: a resposta é a sequência crescente dos pontos.
              const ordem = String(q.answer).split(",").map(Number);
              expect(ordem, `${id} L${lvl}: ordem sem todos os pontos`).toHaveLength(reta.pontos.length);
              expect([...ordem].sort((a, b) => a - b), `${id} L${lvl}: ordem não é crescente`).toEqual(ordem);
              expect([...ordem].sort((a, b) => a - b), `${id} L${lvl}: ordem não usa os pontos da reta`)
                .toEqual([...reta.pontos].sort((a, b) => a - b));
            }
            for (const o of q.options) {
              if (typeof o.value !== "number") continue;
              expect(Math.abs(o.value), `${id} L${lvl}: alternativa fora da escala da reta`).toBeLessThanOrEqual(comprimento);
            }
            expect(q.options.map(o => String(o.value)), `${id} L${lvl}: alternativas sem o gabarito`).toContain(String(q.answer));
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

    it("erro: nenhuma alternativa numérica sai do conjunto que a ficha ensina", () => {
      const piso = pisoNumericoDe(id);
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        for (let i = 0; i < 30; i += 1) {
          const q = gerarAutoral(lvl);
          for (const o of q.options ?? []) {
            if (typeof o.value !== "number") continue;
            exigirInteiroFinito(o.value, `${id} L${lvl}`);
            expect(o.value, `${id} L${lvl}`).toBeGreaterThanOrEqual(piso);
          }
        }
      }
    });

    it("erro: 500 amostras sem laço infinito nem exceção", () => {
      expect(() => { for (let i = 0; i < 500; i += 1) gerarAutoral((i % 5) + 1); }).not.toThrow();
    });
  });
});
