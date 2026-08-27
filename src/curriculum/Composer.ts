import { FichaCompetencia, FichaDistrator } from "./schema";
import { Option, Question } from "../types";
import {
  FichaAnswer,
  FichaEvaluate,
  FichaUiProps,
  normalizeFichaTutorial,
  parseComposerParams,
} from "./fichaQuestionContract";
import { arrayAnswer, arrayOptions, fitsArrayDimension } from "../components/primitives/arrayProcedure";
import {
  additiveOptions,
  knownTerms,
  solveAdditive,
  structuresForLevel,
  unknownSlotsForLevel,
} from "./procedimentos/additiveProcedure";
import { buildNarrative } from "./procedimentos/additiveNarrative";
import { buildStoryBarsSpec } from "./procedimentos/storyBarsContract";
import { evidenciaDeFamilia } from "./procedimentos/familiaIntegradora";
import { construirTabuadaSpec } from "./procedimentos/tabuadaContract";
import {
  OUTRO_FATOR_MAX,
  PADRAO_DA_TABUADA,
  ehPergunavelComDiagnostico,
  tabuadasDoNivel,
} from "./procedimentos/tabuadaProcedure";
import { construirDecomposicaoSpec } from "./procedimentos/decomposicaoContract";
import {
  OUTRO_FATOR_MAX as DECOMP_FATOR_MAX,
  OUTRO_FATOR_MIN as DECOMP_FATOR_MIN,
  ehPergunavelComDiagnostico as decomposicaoDiagnostica,
  ehPorDecomposicao,
  tabuadasDoNivel as tabuadasDecompostasDoNivel,
} from "./procedimentos/decomposicaoProcedure";
import { construirAncoraSpec } from "./procedimentos/ancoraContract";
import {
  OUTRO_FATOR_MAX as ANCORA_FATOR_MAX,
  OUTRO_FATOR_MIN as ANCORA_FATOR_MIN,
  ehPergunavelComDiagnostico as ancoraDiagnostica,
  ehTabuadaDificil,
  tabuadasDoNivel as tabuadasDificeisDoNivel,
} from "./procedimentos/ancoraProcedure";
import { apoioDisponivel, construirFamiliaSpec } from "./procedimentos/familiaContract";
import {
  FATOR_MAX,
  FATOR_MIN,
  VerticeOculto,
  contasDeApoio,
  ehPergunavelComDiagnostico as familiaDiagnostica,
  produto as produtoDaFamilia,
  produtoMaximoDoNivel,
  verticesDoNivel,
} from "./procedimentos/familiaProcedure";
import { construirAreaSpec } from "./procedimentos/areaContract";
import { TEMAS, construirPareamentoSpec } from "./procedimentos/pareamentoContract";
import { cenasDoNivel as pareamentoCenasDoNivel, desfechoDe } from "./procedimentos/pareamentoProcedure";
import { construirTouchCountSpec } from "./procedimentos/touchCountContract";
import { ModoDeContagem } from "./procedimentos/touchCountProcedure";
import { EmojiRowSpec, chaveDaPeca, construirEmojiRowSpec } from "./procedimentos/emojiRowContract";
import { MisconceptionTag } from "../constants/misconceptions";
import { ModoDaFileira, diagnosticarPadrao } from "./procedimentos/emojiRowProcedure";
import { construirClassificacaoSpec } from "./procedimentos/classificacaoContract";
import { construirAudioChoiceSpec } from "./procedimentos/audioChoiceContract";
import { construirProducaoSpec } from "./procedimentos/producaoContract";
import { construirPosicaoSpec } from "./procedimentos/posicaoContract";
import { construirFormaSpec } from "./procedimentos/formaContract";
import { construirGrandezaSpec } from "./procedimentos/grandezaContract";
import { construirMedidasSpec } from "./procedimentos/medidasContract";
import { construirMolduraSpec } from "./procedimentos/tenFrameContract";
import { ModoDaMoldura } from "./procedimentos/tenFrameProcedure";
import { soaParecido } from "./procedimentos/audioChoiceProcedure";
import { contasDoNivel as areaContasDoNivel } from "./procedimentos/areaProcedure";
import { construirDeslocamentoSpec } from "./procedimentos/deslocamentoContract";
import {
  ehPergunavelComDiagnostico as deslocamentoDiagnostica,
  multiplicadoresDoNivel,
  numeroMaximoDoNivel,
} from "./procedimentos/deslocamentoProcedure";
import { fisherYates } from "../utils/shuffle";

const EMOJIS = ["🍎", "🦴", "🥕", "🐟", "🧀", "🏈", "⚽", "🚗", "🐶", "🐱"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStep(min: number, max: number, step: number): number {
  const first = Math.ceil(min / step) * step;
  const last = Math.floor(max / step) * step;
  if (first > last) throw new Error("Intervalo sem valor compatível com operand_step.");
  return first + randomInt(0, Math.floor((last - first) / step)) * step;
}

function hasVerticalRegroup(top: number, bottom: number, operation: "+" | "-"): boolean {
  if (operation === "+") return (top % 10) + (bottom % 10) >= 10;
  return top % 10 < bottom % 10;
}

function hasDoubleAdditionRegroup(top: number, bottom: number): boolean {
  const unitCarry = (top % 10) + (bottom % 10) >= 10 ? 1 : 0;
  return unitCarry === 1
    && (Math.floor(top / 10) % 10) + (Math.floor(bottom / 10) % 10) + unitCarry >= 10;
}

function verticalOperands(params: ReturnType<typeof parseComposerParams>, context: string) {
  const requestedOperation = params.operation ?? "+";
  const topMin = params.top_min ?? 10;
  const topMax = params.top_max ?? 99;
  const bottomMin = params.bottom_min ?? 1;
  const bottomMax = params.bottom_max ?? 9;
  if (topMin > topMax || bottomMin > bottomMax) {
    throw new Error(`Intervalo vertical inválido em ${context}.`);
  }
  if (params.require_regroup && params.forbid_regroup) {
    throw new Error(`Conta vertical não pode exigir e proibir reagrupamento em ${context}.`);
  }
  if (params.require_double_regroup && requestedOperation !== "+") {
    throw new Error(`Reagrupamento duplo exige adição em ${context}.`);
  }
  const step = params.operand_step ?? 1;
  if (!Number.isInteger(step) || step <= 0) {
    throw new Error(`operand_step inválido em ${context}.`);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const operation = requestedOperation === "mixed"
      ? (Math.random() < 0.5 ? "+" : "-")
      : requestedOperation;
    const top = randomStep(topMin, topMax, step);
    const bottom = randomStep(bottomMin, bottomMax, step);
    if (operation === "-" && bottom > top) continue;
    if (params.require_regroup && !hasVerticalRegroup(top, bottom, operation)) continue;
    if (params.require_double_regroup && !hasDoubleAdditionRegroup(top, bottom)) continue;
    if (params.forbid_regroup && hasVerticalRegroup(top, bottom, operation)) continue;
    const result = operation === "+" ? top + bottom : top - bottom;
    if (params.result_max !== undefined && result > params.result_max) continue;
    return { top, bottom, operation };
  }
  throw new Error(`Não foi possível gerar conta vertical com os parâmetros de ${context}.`);
}

function numericOptions(answer: number, min: number, max: number) {
  const candidates = [answer, answer - 1, answer + 1, answer - 2, answer + 2]
    .filter(value => value >= min && value <= max);
  const values = [...new Set(candidates)].slice(0, Math.min(3, max - min + 1));
  return fisherYates(values
    .map(value => ({ label: String(value), value })));
}

/**
 * A hipótese que uma alternativa da fileira carrega — §6 das fichas JD1, JD2 e F52.
 *
 * Fica aqui, e não em `tagNumericDistractors`, porque duas das três tags **não
 * são regras sobre o valor**: `CHUTE_SEGURO` fala da POSIÇÃO na tela e
 * `COPIA_ULTIMO` fala da peça anterior à lacuna. O parser de `"n+1"` não tem
 * como expressá-las, e forçá-las ali produziria tag errada em silêncio.
 *
 * A ordem é a armadilha §6.8: do mais específico ao mais genérico. Com
 * `OFF_BY_ONE` na frente, ele engoliria `CHUTE_SEGURO` toda vez que a
 * alternativa central caísse a um do alvo.
 */
function tagDaAlternativa(
  spec: EmojiRowSpec,
  valor: number | string,
): string | undefined {
  if (valor === spec.resposta) return undefined;

  if (spec.modo === "padrao") {
    // Delegado ao procedimento: a regra de diagnóstico mora num lugar só. Com a
    // cópia aqui, o `SO_UM_ATRIBUTO` do crescente alternado existiria no
    // procedimento e nunca chegaria à alternativa — tag testada e nunca emitida.
    if (!spec.sequencia) return undefined;
    return diagnosticarPadrao({
      resposta: String(valor),
      correta: String(spec.resposta),
      anterior: chaveDaPeca(spec.sequencia.anterior),
      unidade: spec.sequencia.unidade,
    });
  }

  if (valor === spec.central) return MisconceptionTag.CHUTE_SEGURO;
  if (typeof valor === "number" && typeof spec.resposta === "number"
    && Math.abs(valor - spec.resposta) === 1) {
    return MisconceptionTag.OFF_BY_ONE;
  }
  return undefined;
}

/**
 * A hipótese que uma alternativa do ouvir-e-escolher carrega — §6 da F05.
 *
 * Fica aqui pelo mesmo motivo do `tagDaAlternativa` da fileira: `NAO_ESCUTOU`
 * fala da POSIÇÃO na tela e `CONFUSAO_FONOLOGICA` fala do SOM. O parser de
 * `"n+1"` não expressa nenhuma das duas.
 *
 * A ordem importa: o par fonológico vem antes do vizinho numérico, porque 6 e 7
 * são as duas coisas ao mesmo tempo — e a aula de quem não distinguiu o som não
 * é a mesma de quem não reconheceu o símbolo.
 */
function tagDaEscuta(spec: { alvo: number; alternativas: number[] }, valor: number): string | undefined {
  if (valor === spec.alvo) return undefined;
  if (soaParecido(valor, spec.alvo)) return MisconceptionTag.CONFUSAO_FONOLOGICA;
  // ⚠️ Divergência declarada F05 §4×§6: como o áudio toca automaticamente
  // ANTES de as opções aparecerem, estar na primeira posição não prova que a
  // criança "não escutou". Essa hipótese exige estado temporal e é emitida por
  // audioChoiceRuntime, nunca por uma Option estática do Composer.
  if (Math.abs(valor - spec.alvo) === 1) return MisconceptionTag.CONFUNDE_VIZINHO;
  return undefined;
}

function tagNumericDistractors(
  options: Option[] | undefined,
  answer: FichaAnswer,
  distractors: FichaDistrator[] | undefined,
): Option[] | undefined {
  if (!options || typeof answer !== "number" || !distractors?.length) return options;
  const taggedValues = new Map<number, string>();
  for (const distractor of distractors) {
    const match = distractor.regra.trim().match(/^n\s*([+-])\s*(\d+)$/);
    if (!match) continue;
    const delta = Number(match[2]) * (match[1] === "+" ? 1 : -1);
    taggedValues.set(answer + delta, distractor.tag);
  }
  return options.map(option => {
    const tag = typeof option.value === "number" ? taggedValues.get(option.value) : undefined;
    return tag ? { ...option, misconception: tag } : option;
  });
}

export class Composer {
  /**
   * Generates a concrete question instance from a Ficha's micro-competence.
   */
  static generate(ficha: FichaCompetencia, lvl: number, microId?: string): Question {
    const selectedMicroId = microId ?? ficha.niveis?.[lvl]?.micro;
    let micro = selectedMicroId ? ficha.micros.find(m => m.id === selectedMicroId) : null;
    if (!micro) {
      if (selectedMicroId) console.warn(`Micro ${selectedMicroId} not found in Ficha ${ficha.id}, falling back to first micro.`);
      micro = ficha.micros[0];
    }

    if (!micro) {
      throw new Error(`Ficha ${ficha.id} não possui microcompetências.`);
    }

    // O nível é a fonte da representação CPA efetiva. O builder precisa usar a
    // mesma primitiva retornada, nunca o primeiro kind histórico da micro.
    const kind = ficha.niveis?.[lvl]?.primitiva ?? micro.kinds[0];
    const params = parseComposerParams(micro.params, `${ficha.id}/${micro.id}`);

    let uiProps: FichaUiProps;
    let evaluate: FichaEvaluate;
    let answer: FichaAnswer;
    let options: Option[] | undefined;

    let big: string | undefined = undefined;
    let n: number | undefined;
    let emoji: string | undefined;
    let promptOverride: string | undefined;
    /**
     * CLASS-008: a família que ESTA tentativa exercitou, quando o nível reúne
     * mais de uma. Quem sabe qual foi é o sorteio logo abaixo; sem gravá-la
     * aqui, a regra de domínio não tem como exigir variedade e o nível
     * integrador coroa quem demonstrou uma família só.
     */
    let familia: string | undefined;
    let vTop: number | undefined;
    let vBot: number | undefined;
    let vOp: "+" | "-" | undefined;

    // A simple factory that delegates to specific kind builders based on params
    switch (kind) {
      case "emojirow": {
        const min = params.n_min || 1;
        const max = params.n_max || 5;
        const target = randomInt(min, max);
        emoji = EMOJIS[randomInt(0, EMOJIS.length - 1)];
        n = target;
        
        uiProps = {
          emoji,
          n: target,
          flashDurationMs: params.flash_ms,
          interactiveCount: params.interactive_count
        };
        
        if (params.interactive_count) {
          evaluate = (count) => count === target;
          answer = target;
        } else if (params.flash_ms) {
          uiProps.targetNumber = target;
          evaluate = (ans) => ans === target;
          answer = target;
          // Generate multiple choice options for flash
          options = [];
          const wrong1 = target + 1 > max ? target - 1 : target + 1;
          const wrong2 = target - 1 < min ? target + 2 : target - 1;
          options.push({ label: String(target), value: target });
          if(wrong1 >= min && wrong1 <= max && wrong1 !== target) options.push({ label: String(wrong1), value: wrong1 });
          if(wrong2 >= min && wrong2 <= max && wrong2 !== target && wrong2 !== wrong1) options.push({ label: String(wrong2), value: wrong2 });
          options = fisherYates(options);
        } else {
          evaluate = (ans) => true; answer = target; options = [{ label: "Continuar 👍", value: target }];
        }
        break;
      }
        
      case "numberline": {
        const start = params.start ?? 0;
        const end = params.end ?? 10;
        const jump = params.jump_size ?? 1;
        if (!Number.isInteger(start) || !Number.isInteger(end) || !Number.isInteger(jump) || jump === 0 || start >= end) {
          throw new Error(`Intervalo/salto inválido na reta de ${ficha.id}/${micro.id}.`);
        }
        const currentMin = jump > 0 ? start : start - jump;
        const currentMax = jump > 0 ? end - jump : end;
        if (currentMin > currentMax) {
          throw new Error(`Salto ${jump} não cabe na reta ${start}..${end} de ${ficha.id}/${micro.id}.`);
        }
        const current = randomInt(currentMin, currentMax);
        const next = current + jump;

        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current,
          showJumps: [{ from: current, to: next }],
        };
        evaluate = ans => Number(ans) === next;
        answer = next;
        big = String(current);
        options = numericOptions(answer, start, end);
        break;
      }
      
      case "tenframe": {
        const min = params.n_min || 1;
        const max = params.n_max || 10;
        const target = randomInt(min, max);
        n = target;
        
        uiProps = {
          n: target,
          flashDurationMs: params.flash_ms,
          moldura: params.moldura || 10
        };
        
        evaluate = (ans) => ans === target;
        answer = target;
        options = fisherYates([
          { label: String(target), value: target },
          { label: String(target + 1), value: target + 1 },
          { label: String(target - 1 >= 0 ? target - 1 : target + 2), value: target - 1 >= 0 ? target - 1 : target + 2 },
          { label: String(target + 2), value: target + 2 }
        ]);
        break;
      }
        
      case "bond": {
        const maxSum = params.soma_max || 10;
        const minWhole = Math.max(2, Math.min(params.whole_min || 2, maxSum));
        const whole = params.whole_fixed ?? randomInt(minWhole, maxSum);
        if (!Number.isInteger(whole) || whole < 2 || whole > maxSum) {
          throw new Error(`Todo invalido no NumberBond de ${ficha.id}/${micro.id}.`);
        }
        const part1 = randomInt(1, whole - 1);
        const part2 = whole - part1;

        if (params.interactive === "whole") {
          uiProps = { whole: '?', part1, part2 };
          evaluate = (ans) => ans === whole;
          answer = whole;
          options = numericOptions(whole, Math.max(1, whole - 2), whole + 2);
        } else {
          const hide1 = Math.random() > 0.5;
          const visible = hide1 ? part2 : part1;
          uiProps = {
            whole,
            part1: hide1 ? '?' : part1,
            part2: hide1 ? part2 : '?',
          };
          evaluate = (ans) => ans === (hide1 ? part1 : part2);
          answer = hide1 ? part1 : part2;

          const candidatos: Option[] = [
            { label: String(answer), value: answer },
            ...(visible !== answer ? [{
              label: String(visible), value: visible,
              misconception: MisconceptionTag.REPETE_A_PARTE,
            }] : []),
            ...(whole !== answer && whole !== visible ? [{
              label: String(whole), value: whole,
              misconception: MisconceptionTag.RESPONDE_O_TODO,
            }] : []),
            { label: String(Number(answer) + 1), value: Number(answer) + 1, misconception: MisconceptionTag.OFF_BY_ONE },
            ...(Number(answer) > 1 ? [{
              label: String(Number(answer) - 1), value: Number(answer) - 1,
              misconception: MisconceptionTag.OFF_BY_ONE,
            }] : []),
          ];
          options = fisherYates(candidatos
            .filter((opcao, indice) => candidatos.findIndex(item => String(item.value) === String(opcao.value)) === indice)
            .slice(0, 4));
        }
        break;
      }
      
      case "draggroup": {
        const min = params.n_min || 3;
        const max = params.n_max || 5;
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        const sobra = params.tem_sobra ? Math.floor(Math.random() * 2) + 1 : 0;
        
        
        const pairs = [
          { s: "🍎", d: "🐰" },
          { s: "🦴", d: "🐶" },
          { s: "🥕", d: "🐎" },
          { s: "🐟", d: "🐱" },
          { s: "🧀", d: "🐭" }
        ];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        uiProps = {
          sourceCount: target + sobra,
          destCount: target,
          sourceEmoji: pair.s,
          destEmoji: pair.d
        };
  
        evaluate = (ans) => ans === target;
        answer = target;
        break;
      }
      
      case "scattered": {
        const min = params.n_min || 1;
        const max = params.n_max || 10;
        const target = randomInt(min, max);
        emoji = EMOJIS[randomInt(0, EMOJIS.length - 1)];
        n = target;
        
        uiProps = {
          emoji,
          n: target,
          ordered: false,
          flashDurationMs: params.flash_ms,
          interactiveCount: params.interactive_count
        };
        
        if (params.interactive_count) {
          evaluate = (count) => count === target;
          answer = target;
        } else if (params.flash_ms) {
          uiProps.targetNumber = target;
          evaluate = (ans) => ans === target;
          answer = target;
          options = [];
          const wrong1 = target + 1 > max ? target - 1 : target + 1;
          const wrong2 = target - 1 < min ? target + 2 : target - 1;
          options.push({ label: String(target), value: target });
          if(wrong1 >= min && wrong1 <= max && wrong1 !== target) options.push({ label: String(wrong1), value: wrong1 });
          if(wrong2 >= min && wrong2 <= max && wrong2 !== target && wrong2 !== wrong1) options.push({ label: String(wrong2), value: wrong2 });
          options = fisherYates(options);
        } else {
          evaluate = (ans) => true; answer = target; options = [{ label: "Continuar 👍", value: target }];
        }
        break;
      }

      case "tens": {
        const dezenas = randomInt(1, params.dezenas_max || 5);
        const unidades = randomInt(0, params.unidades_max || 9);
        answer = dezenas * 10 + unidades;
        uiProps = { dezenas, unidades };
        options = numericOptions(answer, Math.max(10, answer - 2), answer + 2);
        evaluate = (ans) => ans === answer;
        break;
      }

      case "relogio": {
        const initialHours = randomInt(1, 12);
        const initialMinutes = params.apenas_horas_exatas
          ? 0
          : [0, 15, 30, 45][randomInt(0, 3)];
        const advance = params.interativo ? (params.minutos_step || 15) : 0;
        const totalMinutes = (initialHours % 12) * 60 + initialMinutes + advance;
        const targetHours = Math.floor(totalMinutes / 60) % 12 || 12;
        const targetMinutes = totalMinutes % 60;
        answer = `${targetHours}:${String(targetMinutes).padStart(2, "0")}`;
        uiProps = { initialHours, initialMinutes, interactive: false };
        options = fisherYates([answer, `${initialHours}:${String(initialMinutes).padStart(2, "0")}`, `${targetHours}:${String((targetMinutes + 15) % 60).padStart(2, "0")}`]
          .filter((value, index, values) => values.indexOf(value) === index)
          .map(value => ({ label: value, value })));
        evaluate = (ans) => ans === answer;
        break;
      }

      case "balanca": {
        const target = randomInt(params.peso_alvo_min || 2, params.peso_alvo_max || 8);
        const visible = randomInt(1, Math.max(1, target - 1));
        answer = target - visible;
        uiProps = {
          leftItems: [{ id: "alvo", weight: target, label: target }],
          rightItems: [{ id: "visivel", weight: visible, label: visible }],
        };
        options = numericOptions(answer, 1, Math.max(target, answer + 2));
        evaluate = (ans) => ans === answer;
        break;
      }

      case "vertical": {
        const operands = verticalOperands(params, `${ficha.id}/${micro.id}`);
        familia = operands.operation === "+" ? "adicao" : "subtracao";
        vTop = operands.top;
        vBot = operands.bottom;
        vOp = operands.operation;
        answer = vOp === "+" ? vTop + vBot : vTop - vBot;
        uiProps = {
          vTop,
          vBot,
          vOp,
          showPlaceValue: params.show_place_value,
          showRegroup: params.show_regroup,
          showAlgorithm: params.show_algorithm,
        };
        evaluate = (ans) => ans === answer;
        promptOverride = params.audio_prompt ?? `${vTop} ${vOp === "+" ? "mais" : "menos"} ${vBot}.`;
        break;
      }

      case "arraygrid": {
        const rowsMin = params.rows_min ?? 1;
        const rowsMax = params.rows_max ?? 10;
        const colsMin = params.cols_min ?? 1;
        const colsMax = params.cols_max ?? 10;
        if (![rowsMin, rowsMax, colsMin, colsMax].every(fitsArrayDimension) || rowsMin > rowsMax || colsMin > colsMax) {
          throw new Error(`Dimensões de arraygrid inválidas em ${ficha.id}/${micro.id}; use inteiros entre 1 e 10.`);
        }
        if (params.require_rotate && !params.allow_rotate) {
          throw new Error(`arraygrid não pode exigir giro sem permiti-lo em ${ficha.id}/${micro.id}.`);
        }
        const rows = randomInt(rowsMin, rowsMax);
        const cols = randomInt(colsMin, colsMax);
        const answerMode = params.answer_mode ?? "total";
        answer = arrayAnswer({ rows, cols, answerMode });
        options = fisherYates(arrayOptions({ rows, cols, answerMode }));
        uiProps = {
          rows, cols, answerMode,
          allowRotate: params.allow_rotate ?? false,
          requireRotate: params.require_rotate ?? false,
          areaMode: params.area_mode ?? false,
          showEquation: params.show_equation ?? false,
        };
        evaluate = candidate => candidate === answer;
        promptOverride = answerMode === "equation"
          ? "Qual expressão representa este arranjo?"
          : "Quantos quadradinhos há no arranjo?";
        break;
      }
        
      case "storypanel": {
        const wholeMax = params.result_max ?? 10;
        if (!Number.isInteger(wholeMax) || wholeMax < 2 || wholeMax > 20) {
          throw new Error(`result_max inválido para storypanel em ${ficha.id}/${micro.id}; use inteiro entre 2 e 20.`);
        }
        const estruturas = structuresForLevel(lvl);
        const structure = estruturas[randomInt(0, estruturas.length - 1)];
        const posicoes = unknownSlotsForLevel(lvl, structure);
        const unknown = posicoes[randomInt(0, posicoes.length - 1)];

        // A tripla nasce do todo para baixo, garantindo partes positivas e soma
        // coerente. Triplas em que a resposta coincide com um número visível são
        // descartadas: nelas, repetir um dado da história acertaria por acaso e o
        // distrator REPETE_DADO deixaria de diagnosticar qualquer coisa.
        let situation = { structure, part1: 1, part2: 1, whole: 2, unknown };
        for (let tentativa = 0; tentativa < 60; tentativa += 1) {
          const whole = randomInt(2, wholeMax);
          const part1 = randomInt(1, whole - 1);
          situation = { structure, part1, part2: whole - part1, whole, unknown };
          const [visivelA, visivelB] = knownTerms(situation);
          const resposta = solveAdditive(situation);
          if (resposta !== visivelA && resposta !== visivelB) break;
        }

        const narrative = buildNarrative(situation, {
          subjectIndex: randomInt(0, 7),
          partnerIndex: randomInt(0, 7),
          objectIndex: randomInt(0, 5),
        });

        answer = solveAdditive(situation);
        options = fisherYates(additiveOptions(situation));
        uiProps = buildStoryBarsSpec(situation, narrative, lvl);
        evaluate = candidate => candidate === answer;
        promptOverride = narrative.question;
        break;
      }

      case "tabuada": {
        // Sorteia entre as multiplicações que o nível autoriza E que ainda
        // diagnosticam: ×1 traz a resposta escrita no enunciado, e nas tabuadas
        // pequenas somar pode coincidir com multiplicar. Filtrar antes de
        // sortear é mais honesto que sortear e repetir até dar certo — a lista
        // é pequena e conhecida.
        const tabuadas = tabuadasDoNivel(lvl);
        const candidatas = tabuadas.flatMap(tabuada =>
          Array.from({ length: OUTRO_FATOR_MAX }, (_, i) => ({ tabuada, vezes: i + 1 })))
          .filter(ehPergunavelComDiagnostico);
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem multiplicação com valor diagnóstico.`);
        }

        const situacao = candidatas[randomInt(0, candidatas.length - 1)];
        familia = `tabuada-${situacao.tabuada}`;
        const spec = construirTabuadaSpec(situacao, lvl, PADRAO_DA_TABUADA[situacao.tabuada]);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "decomposicao": {
        // Mesma disciplina de N4.03: filtrar antes de sortear. No nível 5 entram
        // tabuadas que não se decompõem (×2, ×5, ×10) — para essas vale o
        // critério de N4.03, e reusá-lo evita dois conjuntos de regras que
        // envelheceriam em separado.
        const candidatas = tabuadasDecompostasDoNivel(lvl).flatMap(tabuada =>
          Array.from({ length: DECOMP_FATOR_MAX - DECOMP_FATOR_MIN + 1 },
            (_, i) => ({ tabuada, vezes: i + DECOMP_FATOR_MIN }))
            .filter(c => ehPorDecomposicao(c.tabuada)
              ? decomposicaoDiagnostica({ tabuada: c.tabuada, vezes: c.vezes })
              : ehPergunavelComDiagnostico({ tabuada: c.tabuada as never, vezes: c.vezes })));
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem multiplicação com valor diagnóstico.`);
        }

        const escolha = candidatas[randomInt(0, candidatas.length - 1)];
        familia = `tabuada-${escolha.tabuada}`;
        const spec = construirDecomposicaoSpec(escolha.tabuada, escolha.vezes, lvl);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "ancora": {
        const candidatas = tabuadasDificeisDoNivel(lvl).flatMap(tabuada =>
          Array.from({ length: ANCORA_FATOR_MAX - ANCORA_FATOR_MIN + 1 },
            (_, i) => ({ tabuada, vezes: i + ANCORA_FATOR_MIN }))
            // Difícil passa pelo critério da âncora; já dominada só precisa não
            // trazer a resposta escrita no enunciado.
            .filter(c => ehTabuadaDificil(c.tabuada)
              ? ancoraDiagnostica({ tabuada: c.tabuada, vezes: c.vezes })
              : c.vezes > 1 && c.tabuada * c.vezes !== c.tabuada + c.vezes));
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem multiplicação com valor diagnóstico.`);
        }

        const escolha = candidatas[randomInt(0, candidatas.length - 1)];
        familia = `tabuada-${escolha.tabuada}`;
        const spec = construirAncoraSpec(escolha.tabuada, escolha.vezes, lvl);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "familia": {
        const teto = produtoMaximoDoNivel(lvl);
        const candidatas: { a: number; b: number; vertice: VerticeOculto }[] = [];
        for (let a = FATOR_MIN; a <= FATOR_MAX; a += 1) {
          for (let b = FATOR_MIN; b <= FATOR_MAX; b += 1) {
            if (produtoDaFamilia({ a, b }) > teto) continue;
            for (const vertice of verticesDoNivel(lvl)) {
              if (!familiaDiagnostica({ a, b }, vertice)) continue;
              // Nível que promete apoio precisa TER apoio: famílias de fatores
              // iguais não sobram frase nenhuma depois do filtro, e cairiam com
              // andaime alto numa tela idêntica à do nível 4.
              if (contasDeApoio(lvl) > 0 && apoioDisponivel({ a, b }, vertice) === 0) continue;
              candidatas.push({ a, b, vertice });
            }
          }
        }
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem família com valor diagnóstico.`);
        }

        const escolha = candidatas[randomInt(0, candidatas.length - 1)];
        const spec = construirFamiliaSpec({ a: escolha.a, b: escolha.b }, escolha.vertice, lvl);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "deslocamento": {
        // O teto do número por nível existe para o MATERIAL caber: onde ele
        // aparece, treze peças na tela viram ruído em vez de apoio.
        const tetoDoNumero = numeroMaximoDoNivel(lvl);
        const candidatas = multiplicadoresDoNivel(lvl).flatMap(multiplicador =>
          Array.from({ length: tetoDoNumero - 10 }, (_, i) => ({ numero: i + 11, multiplicador })))
          .filter(deslocamentoDiagnostica);
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem conta com valor diagnóstico.`);
        }

        const escolha = candidatas[randomInt(0, candidatas.length - 1)];
        const spec = construirDeslocamentoSpec(escolha, lvl);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "pareamento": {
        // Ficha de PRODUÇÃO (F07): a criança distribui, não escolhe. A única
        // escolha é a pergunta do "sobrou?", cujas opções vêm do procedimento —
        // e nenhuma delas é um número, que é a regra dura desta ficha.
        const cenas = pareamentoCenasDoNivel(lvl);
        const cena = cenas[randomInt(0, cenas.length - 1)];
        const tema = TEMAS[randomInt(0, TEMAS.length - 1)];
        const spec = construirPareamentoSpec(cena, lvl, tema);

        answer = desfechoDe(cena);
        options = spec.respostas.map(r => ({ value: r.desfecho, label: r.rotulo }));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = spec.enunciado;
        break;
      }

      case "touchcount": {
        // Fichas F01 (N1.04, cardinalidade) e F27 (N1.02, sequência oral).
        //
        // A ficha diz o MODO; o Composer não adivinha pelo id da competência.
        // Adivinhar funcionaria hoje, com dois nós, e apagaria em silêncio o
        // dia em que uma terceira competência usar a primitiva.
        // Sem padrão silencioso. A ficha F27 declara `modo: "ritmico"` e a
        // chave foi descartada por `parseComposerParams`: o canhão de balões
        // desenhou peixinhos, e um `?? "toque"` fez o defeito parecer normal.
        // Faltando o modo, isto QUEBRA — barulho na hora certa vale mais que
        // uma tela plausível e errada.
        if (params.modo !== "toque" && params.modo !== "ritmico") {
          throw new Error(
            `${ficha.id}/${micro.id}: primitiva touchcount exige params.modo `
            + `"toque" ou "ritmico" — recebido ${JSON.stringify(params.modo)}.`,
          );
        }
        const modo: ModoDeContagem = params.modo;
        const spec = construirTouchCountSpec(modo, lvl, Math.random);

        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => Number(candidate) === answer;
        promptOverride = spec.enunciado;

        // O modo rítmico não tem alternativas: a criança dispara e a voz
        // conta junto. Fabricar um teclado aqui trocaria uma competência ORAL
        // por uma de leitura de numeral — que é outra ficha (N1.06).
        // `undefined`, não `[]`: o rítmico não tem alternativa nenhuma. Um array
        // vazio é truthy — passa pelos `if (q.options)` do app e do contrato
        // como se houvesse alternativas, e some com a resposta em vez de dizer
        // que ela não se escolhe.
        options = modo === "ritmico"
          ? undefined
          : Array.from({ length: spec.tecladoAte }, (_, k) => k + 1)
            .map(n => ({ value: n, label: String(n) }));
        break;
      }

      case "fileira": {
        // Fichas JD1 (N1.03, olhômetro), JD2 (N1.08, mão relâmpago) e F52
        // (AL.02, padrões) — os três modos da escada do `EmojiRow`.
        //
        // A ficha diz o MODO, igual ao `touchcount`, e pelo mesmo motivo:
        // deduzir pelo id da competência funcionaria com três nós e apagaria em
        // silêncio o dia em que um quarto usasse a primitiva. Faltando o modo,
        // isto QUEBRA — barulho na hora certa vale mais que uma tela plausível
        // e errada, que foi como o canhão da F27 desenhou peixinhos.
        const MODOS: ModoDaFileira[] = ["plain", "flash", "flash-mao", "padrao"];
        if (!MODOS.includes(params.modo as ModoDaFileira)) {
          throw new Error(
            `${ficha.id}/${micro.id}: primitiva fileira exige params.modo em `
            + `${JSON.stringify(MODOS)} — recebido ${JSON.stringify(params.modo)}.`,
          );
        }
        const modo = params.modo as ModoDaFileira;
        const spec = construirEmojiRowSpec(modo, lvl, Math.random);

        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = spec.enunciado;

        // As alternativas saem NA ORDEM DO SPEC, sem embaralhar. No relance a
        // ordem é numérica e a do meio é a que a tag `CHUTE_SEGURO` observa:
        // embaralhar aqui apagaria o diagnóstico que a §6 das duas fichas pede.
        options = spec.alternativas.map(a => {
          const tag = tagDaAlternativa(spec, a.valor);
          return {
            value: a.valor,
            label: a.rotulo,
            ...(tag ? { misconception: tag, tag } : {}),
          };
        });
        break;
      }

      case "audiochoice": {
        // Ficha F05 (N1.06). A pergunta é o SOM: o alvo não aparece escrito em
        // lugar nenhum além das alternativas. É a única competência do app que
        // não depende de leitura, e o gerador antigo a resolvia lendo — ele
        // imprimia "🔊 TRÊS" na tela.
        const spec = construirAudioChoiceSpec(lvl, Math.random);
        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => Number(candidate) === answer;
        promptOverride = spec.enunciado;
        // As alternativas saem NA ORDEM DO SPEC. Embaralhar aqui destruiria a
        // tag `NAO_ESCUTOU` da §6, que é uma hipótese sobre a POSIÇÃO.
        options = spec.alternativas.map(v => ({
          value: v,
          label: String(v),
          ...(tagDaEscuta(spec, v) ? { misconception: tagDaEscuta(spec, v)!, tag: tagDaEscuta(spec, v)! } : {}),
        }));
        break;
      }

      case "classificacao": {
        // Ficha F51 (AL.01). Ficha de PRODUÇÃO: a criança separa, não escolhe.
        // A única escolha é o nível 5 — "por que estas estão juntas?" —, cujas
        // alternativas são CRITÉRIOS, nunca peças.
        const spec = construirClassificacaoSpec(lvl, Math.random);
        uiProps = spec;

        if (spec.forma === "descobrir") {
          answer = spec.resposta!;
          options = spec.alternativas!.map(a => ({ value: a.valor, label: a.rotulo }));
          evaluate = candidate => candidate === answer;
        } else {
          // Nos níveis 1 a 4 não há alternativa: quem julga é o palco, que
          // recusa a peça no laço errado (§4, "empurrada de volta") e só
          // termina quando tudo está no lugar. Fabricar alternativas aqui
          // devolveria a múltipla escolha que esta ficha existe para tirar do
          // caminho — e foi exatamente ela que a AL.01 servia até agora.
          //
          // O que o Radar recebe não vem do valor: vem da AÇÃO, lida em
          // `answerPolicy` a partir das tentativas recusadas.
          answer = "separado";
          options = undefined;
          evaluate = candidate => candidate === "separado" || candidate === true;
        }
        promptOverride = spec.enunciado;
        break;
      }

      case "shapecanvas": {
        // Duas fichas nomeiam o `ShapeCanvas`, em modos diferentes:
        //   F47 (GE.01) — modo CENA: um referencial e dois objetos
        //   F48 (GE.02) — modo FORMAS: 3 a 4 figuras em contêineres idênticos
        //
        // A ficha diz o modo; o Composer não adivinha pelo id da competência.
        // Adivinhar funcionaria hoje, com duas fichas, e apagaria em silêncio o
        // dia em que uma terceira usar a primitiva. Faltando o modo, isto
        // QUEBRA — é a mesma regra do `touchcount`, e ela existe porque um
        // `?? padrão` já fez o canhão de balões desenhar peixinhos.
        if (params.modo !== "cena" && params.modo !== "formas") {
          throw new Error(
            `${ficha.id}/${micro.id}: primitiva shapecanvas exige params.modo `
            + `"cena" ou "formas" — recebido ${JSON.stringify(params.modo)}.`,
          );
        }

        if (params.modo === "formas") {
          // A resposta é a FIGURA que ela toca. O gerador antigo dava dois
          // emojis como alternativas — e emoji não gira, então a única coisa
          // que esta ficha ensina não tinha como ser exercitada.
          const spec = construirFormaSpec(lvl, Math.random);
          answer = spec.resposta;
          uiProps = spec;
          evaluate = candidate => String(candidate) === String(answer);
          promptOverride = spec.enunciado;
          options = undefined;
          break;
        }

        // Modo cena. A resposta é o objeto que a criança toca — não existe
        // alternativa. O gerador antigo fabricava as palavras "Em cima" e
        // "Embaixo" como botões, e era isso que transformava a primeira
        // geometria do currículo num exercício de leitura.
        const spec = construirPosicaoSpec(lvl, Math.random);
        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = spec.enunciado;
        options = undefined;
        break;
      }

      case "moldura": {
        // Três fichas, uma moldura: F02 (N1.08, "quantas você vê?"), JD3
        // (N1.11, "quantos faltam?") e JD5 (N1.10, "quantos escondidos?").
        //
        // A ficha diz o MODO; o Composer não adivinha pelo id. Faltando o modo,
        // isto QUEBRA — a mesma regra do `touchcount` e do `shapecanvas`, e ela
        // existe porque um `?? padrão` já fez o canhão desenhar peixinhos.
        if (params.modo !== "contar" && params.modo !== "faltam" && params.modo !== "escondidos") {
          throw new Error(
            `${ficha.id}/${micro.id}: primitiva moldura exige params.modo `
            + `"contar", "faltam" ou "escondidos" — recebido ${JSON.stringify(params.modo)}.`,
          );
        }
        const fonteA = params.source_level ?? lvl;
        const fonteB = params.source_level_alt;
        for (const fonte of [fonteA, fonteB].filter((v): v is number => v !== undefined)) {
          if (!Number.isInteger(fonte) || fonte < 1 || fonte > 5) {
            throw new Error(`${ficha.id}/${micro.id}: source_level da moldura deve estar entre 1 e 5.`);
          }
        }
        // Quando há dois degraus, esta micro é um fade de andaime: o mesmo
        // conceito aparece ora com a estrutura anterior, ora sem ela.
        const nivelDaMoldura = fonteB !== undefined && Math.random() < 0.5 ? fonteB : fonteA;
        const spec = construirMolduraSpec(params.modo as ModoDaMoldura, nivelDaMoldura, Math.random);
        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => Number(candidate) === answer;
        promptOverride = spec.enunciado;
        // As alternativas moram no palco: o diagnóstico depende do que a CENA
        // mostrava (quantas cheias, se o vazio estava disperso, quantas a tampa
        // cobriu), e isso não cabe no valor de uma alternativa da barra.
        options = undefined;
        break;
      }

      case "grandeza": {
        // Ficha F49 (GM.01). A resposta é QUAL objeto — não uma palavra, e não
        // uma alternativa. O nó não tinha gerador nenhum: caía no fallback.
        const spec = construirGrandezaSpec(lvl, Math.random);
        answer = spec.resposta;
        uiProps = spec;
        evaluate = candidate => Number(candidate) === answer;
        promptOverride = spec.enunciado;
        options = undefined;
        break;
      }

      case "medidas": {
        // F50/GM.12. Um único kind compõe as DUAS primitivas que a ficha nomeia:
        // Balanca nos degraus de massa e Recipientes nos de capacidade.
        const spec = construirMedidasSpec(lvl, Math.random);
        answer = spec.seriacao ? "ordenado" : spec.resposta;
        uiProps = spec;
        evaluate = candidate => spec.seriacao ? candidate === "ordenado" : Number(candidate) === spec.resposta;
        promptOverride = spec.enunciado;
        options = undefined;
        break;
      }

      case "touchplace": {
        // Ficha F04 (N1.13). Ficha de PRODUÇÃO, e a mais literal delas: a
        // resposta é a quantidade que a criança FEZ aparecer. Não há o que
        // escolher — o número já foi dado pelo enunciado.
        const spec = construirProducaoSpec(lvl, Math.random);
        answer = spec.resposta;
        uiProps = spec;
        // O valor que chega aqui é quantos objetos ficaram na cena.
        evaluate = candidate => Number(candidate) === answer;
        promptOverride = spec.enunciado;
        // `undefined`, não `[]`: um array vazio é truthy e passa pelos
        // `if (q.options)` do app como se houvesse alternativas. Teclado nesta
        // tela devolveria a múltipla escolha que a ficha existe para tirar.
        options = undefined;
        break;
      }

      case "area": {
        // As contas do nível já vêm filtradas pelo valor diagnóstico: o
        // procedimento é dono da regra, o Composer só sorteia. Sortear aqui e
        // filtrar depois deixaria a decisão pedagógica espalhada em dois lugares.
        const candidatas = areaContasDoNivel(lvl);
        if (!candidatas.length) {
          throw new Error(`Nível ${lvl} de ${ficha.id} ficou sem conta com valor diagnóstico.`);
        }

        const escolha = candidatas[randomInt(0, candidatas.length - 1)];
        const spec = construirAreaSpec(escolha, lvl);

        answer = spec.resposta;
        options = fisherYates(spec.alternativas
          .map(a => ({
            value: a.valor,
            label: String(a.valor),
            ...(a.tag ? { misconception: a.tag, tag: a.tag } : {}),
          })));
        uiProps = spec;
        evaluate = candidate => candidate === answer;
        promptOverride = `Quanto é ${spec.falado}?`;
        break;
      }

      case "plain": {
        // P22.3B: alternância de vizinhos é opt-in para JD4. Ela mede fluência
        // de um conceito já aprendido; não cria uma nova competência da Jornada.
        if (params.modo === "neighbor_alternating") {
          const start = params.start ?? 1;
          const end = params.end ?? 20;
          if (!Number.isInteger(start) || !Number.isInteger(end) || start >= end) {
            throw new Error(`Intervalo inválido para vizinhos em ${ficha.id}/${micro.id}.`);
          }
          const jump = Math.random() < 0.5 ? 1 : -1;
          const currentMin = jump > 0 ? start : start - jump;
          const currentMax = jump > 0 ? end - jump : end;
          const current = randomInt(currentMin, currentMax);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(Number(answer), start, end);
          evaluate = ans => Number(ans) === answer;
          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";
        } else if (params.modo === "ordering") {
          const start = params.start ?? 1;
          const end = params.end ?? 10;
          if (!Number.isInteger(start) || !Number.isInteger(end) || end - start + 1 < 4) {
            throw new Error(`Intervalo inválido para ordenação em ${ficha.id}/${micro.id}.`);
          }
          const count = randomInt(3, 4);
          const first = randomInt(start, end - count + 1);
          const ascending = Array.from({ length: count }, (_, index) => first + index);
          const correct = ascending.join(" → ");
          const reversed = [...ascending].reverse();
          const swapped = [...ascending];
          [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
          const rotated = [...ascending.slice(1), ascending[0]];
          const sequences = Array.from(new Set(
            [ascending, reversed, swapped, rotated].map(sequence => sequence.join(" → ")),
          ));
          const shuffled = fisherYates([...ascending]);
          answer = correct;
          big = shuffled.join("   ");
          uiProps = { text: big };
          options = fisherYates(sequences.map(sequence => ({
            label: sequence,
            value: sequence,
            ...(sequence === correct ? {} : { misconception: MisconceptionTag.ORDEM_ERRADA }),
          })));
          evaluate = ans => String(ans) === correct;
          promptOverride = String(params.audio_prompt ?? "Coloque os números do menor para o maior.");
        } else if (params.complemento_dez) {
          const parte = randomInt(1, 9);
          answer = 10 - parte;
          uiProps = { text: `${parte} + □ = 10` };
          const candidatos: Option[] = [
            { label: String(answer), value: answer },
            ...(parte !== answer ? [{
              label: String(parte), value: parte,
              misconception: MisconceptionTag.REPETE_A_PARTE,
            }] : []),
            { label: "10", value: 10, misconception: MisconceptionTag.RESPONDE_O_TODO },
            { label: String(Number(answer) + 1), value: Number(answer) + 1, misconception: MisconceptionTag.OFF_BY_ONE },
            ...(Number(answer) > 1 ? [{
              label: String(Number(answer) - 1), value: Number(answer) - 1,
              misconception: MisconceptionTag.OFF_BY_ONE,
            }] : []),
          ];
          options = fisherYates(candidatos
            .filter((opcao, indice) => candidatos.findIndex(item => String(item.value) === String(opcao.value)) === indice)
            .slice(0, 4));
          evaluate = ans => Number(ans) === answer;
          promptOverride = `${parte} mais quanto dá dez?`;
        } else if (typeof params.dezenas_max === "number") {
          const dezenas = randomInt(1, params.dezenas_max);
          const unidades = randomInt(0, params.unidades_max || 9);
          answer = dezenas * 10 + unidades;
          uiProps = { text: `${dezenas} dezenas + ${unidades} unidades = ?` };
          options = numericOptions(answer, Math.max(10, answer - 2), answer + 2);
          evaluate = (ans) => ans === answer;
          promptOverride = "Qual número foi formado?";
        } else if (params.apenas_horas_exatas || params.interativo) {
          const hours = randomInt(1, 12);
          const minutes = params.interativo ? (params.minutos_step || 15) : 0;
          answer = `${hours}:${String(minutes).padStart(2, "0")}`;
          uiProps = {
            text: params.interativo
              ? `${hours}:00 + ${minutes} minutos = ?`
              : `Ponteiro pequeno no ${hours}; grande no 12`,
          };
          options = [answer, `${hours}:00`, `${hours === 12 ? 1 : hours + 1}:00`]
            .filter((value, index, values) => values.indexOf(value) === index)
            .map(value => ({ label: value, value }));
          evaluate = (ans) => ans === answer;
          promptOverride = "Que horas são?";
        } else if (typeof params.peso_alvo_min === "number") {
          const target = randomInt(params.peso_alvo_min, params.peso_alvo_max || 8);
          const visible = randomInt(1, Math.max(1, target - 1));
          answer = target - visible;
          uiProps = { text: `${target} = ${visible} + ?` };
          options = numericOptions(answer, 1, Math.max(target, answer + 2));
          evaluate = (ans) => ans === answer;
          promptOverride = "Quanto falta para ficar igual?";
        } else if (typeof params.start === "number" && typeof params.end === "number") {
          const jump = params.jump_size ?? 1;
          if (!Number.isInteger(jump) || jump === 0 || params.start >= params.end) {
            throw new Error(`Intervalo/salto inválido no plain de ${ficha.id}/${micro.id}.`);
          }
          const currentMin = jump > 0 ? params.start : params.start - jump;
          const currentMax = jump > 0 ? params.end - jump : params.end;
          if (currentMin > currentMax) {
            throw new Error(`Salto ${jump} não cabe no intervalo ${params.start}..${params.end} de ${ficha.id}/${micro.id}.`);
          }
          const current = randomInt(currentMin, currentMax);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = ans => Number(ans) === answer;
          promptOverride = jump < 0 ? "Qual número vem antes?" : "Qual número vem depois?";
        } else if (typeof params.n_min === "number" && typeof params.n_max === "number") {
          answer = randomInt(params.n_min, params.n_max);
          const shown = Array.from({ length: Math.max(1, answer - 1) }, (_, index) => index + 1);
          uiProps = { text: `${shown.join(" · ")} · ?` };
          options = numericOptions(answer, params.n_min, params.n_max);
          evaluate = (ans) => ans === answer;
          promptOverride = "Continue a contagem. Qual número vem agora?";
        } else if (typeof params.big === "string") {
          uiProps = { text: params.big };
          answer = params.answer;
          options = params.options;
          evaluate = (ans) => ans === answer;
        } else {
          throw new Error(`Primitiva plain sem parâmetros compatíveis em ${ficha.id}/${micro.id}.`);
        }
        break;
      }
      
      case "intruso_math": {
        const pairs = [
          ["🔴", "🔵"],
          ["🍎", "🍌"],
          ["🚗", "🚕"],
          ["🐶", "🐱"],
          ["🌞", "🌙"],
          ["⭐", "💠"]
        ];
        const [A, B] = pairs[Math.floor(Math.random() * pairs.length)];
        
        const intruder = Math.random() > 0.5 ? A : B;
        const normal = intruder === A ? B : A;

        const len = Math.floor(Math.random() * 2) + 4; // 4 or 5
        const intruderPos = Math.floor(Math.random() * len);
        
        let seq = [];
        for (let i = 0; i < len; i++) {
          seq.push(i === intruderPos ? intruder : normal);
        }
        
        uiProps = { text: seq.join(" ") };
        options = fisherYates([{label: A, value: A}, {label: B, value: B}]);
        evaluate = (ans) => ans === intruder;
        answer = intruder;
        break;
      }
      
      default:
        throw new Error(`Primitiva ${kind} ainda não possui builder no Composer (${ficha.id}/${micro.id}).`);
    }

    return {
      // A micro pode sobrescrever a fala quando a competência é servida por
      // mais de uma ficha e as §7 delas se contradizem — é o caso do N1.08
      // (F02 manda "continue contando"; JD2 proíbe dizer "conte").
      howto: params.howto ?? ficha.howto,
      explain: params.explain ?? ficha.explain,
      // P13: a condição da §9 viaja na questão até o motor de maestria.
      ...(micro.dominio?.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
      ...(micro.dominio?.gateAntesDeAvancar
        ? { gateEvidenceBeforeAdvance: micro.dominio.gateAntesDeAvancar.evidencia }
        : {}),
      ...(familia ? { evidenciaDeFamilia: evidenciaDeFamilia(ficha.id, familia) } : {}),
      ...(micro.dominio ? {
        masteryRule: {
          acertos: micro.dominio.acertos,
          de: micro.dominio.de,
          sessoes: micro.dominio.sessoes,
          // CLASS-008: a exigência de diversidade de família também viaja. Este
          // serializador copiava três campos e deixava `evidenciasDistintas`
          // para trás — a ficha pedia duas famílias, a questão chegava ao motor
          // sem pedir nada, e o nível integrador coroava quem fez uma só.
          ...(micro.dominio.evidenciasDistintas
            ? { evidenciasDistintas: micro.dominio.evidenciasDistintas }
            : {}),
        },
      } : {}),
      rt_max_s: ficha.niveis?.[lvl]?.rt_alvo
        ? ficha.niveis[lvl].rt_alvo! / 1000
        : undefined,
      kind: kind === "intruso_math" ? "plain" : kind === "arraygrid" ? "array" : kind === "storypanel" ? "story-bars" : kind,
      prompt: promptOverride || params.audio_prompt || "Responda:",
      audioPrompt: promptOverride || params.audio_prompt,
      tutorial: normalizeFichaTutorial(params.tutorial),
      excecaoCPA: ficha.excecaoCPA,
      uiProps,
      evaluate,
      answer,
      options: tagNumericDistractors(options, answer, ficha.distratores),
      big,
      n,
      emoji,
      vTop,
      vBot,
      vOp,
    };
  }
}
