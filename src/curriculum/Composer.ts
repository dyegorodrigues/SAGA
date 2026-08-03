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
  return values
    .map(value => ({ label: String(value), value }))
    .sort(() => Math.random() - 0.5);
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
          options.sort(() => Math.random() - 0.5);
        } else {
          evaluate = (ans) => true; answer = target; options = [{ label: "Continuar 👍", value: target }];
        }
        break;
      }
        
      case "numberline": {
        const start = params.start || 0;
        const end = params.end || 10;
        const jump = params.jump_size || 1;
        const current = randomInt(start, end - jump);
        const next = current + jump;
        
        uiProps = {
          start,
          end,
          interactive: true,
          startPos: current, showJumps: [{from: current, to: next}]
        };
        evaluate = (ans) => ans === next;
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
        options = [
          { label: String(target), value: target },
          { label: String(target + 1), value: target + 1 },
          { label: String(target - 1 >= 0 ? target - 1 : target + 2), value: target - 1 >= 0 ? target - 1 : target + 2 },
          { label: String(target + 2), value: target + 2 }
        ].sort(() => Math.random() - 0.5);
        break;
      }
        
      case "bond": {
        const maxSum = params.soma_max || 10;
        const whole = Math.floor(Math.random() * (maxSum - 2)) + 2;
        const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
        const part2 = whole - part1;
        
        if (params.interactive === "whole") {
          uiProps = { whole: '?', part1, part2, interactivePart: 'whole' };
          evaluate = (ans) => ans === whole;
          answer = whole;
        } else {
          const hide1 = Math.random() > 0.5;
          uiProps = { whole, part1: hide1 ? '?' : part1, part2: hide1 ? part2 : '?', interactivePart: hide1 ? 'part1' : 'part2' };
          evaluate = (ans) => ans === (hide1 ? part1 : part2);
          answer = hide1 ? part1 : part2;
        }
        
        // Options for number bonds
        options = [];
        const wrong1 = answer + 1;
        const wrong2 = Math.max(1, answer - 1);
        options.push({ label: String(answer), value: answer });
        options.push({ label: String(wrong1), value: wrong1 });
        if(wrong2 !== answer && wrong2 !== wrong1) options.push({ label: String(wrong2), value: wrong2 });
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
          options.sort(() => Math.random() - 0.5);
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
        options = [answer, `${initialHours}:${String(initialMinutes).padStart(2, "0")}`, `${targetHours}:${String((targetMinutes + 15) % 60).padStart(2, "0")}`]
          .filter((value, index, values) => values.indexOf(value) === index)
          .map(value => ({ label: value, value }))
          .sort(() => Math.random() - 0.5);
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
        options = arrayOptions({ rows, cols, answerMode }).sort(() => Math.random() - 0.5);
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
        options = additiveOptions(situation).sort(() => Math.random() - 0.5);
        uiProps = buildStoryBarsSpec(situation, narrative, lvl);
        evaluate = candidate => candidate === answer;
        promptOverride = narrative.question;
        break;
      }

      case "plain": {
        if (typeof params.dezenas_max === "number") {
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
          const jump = params.jump_size || 1;
          const current = randomInt(params.start, params.end - jump);
          answer = current + jump;
          big = String(current);
          uiProps = { text: String(current) };
          options = numericOptions(answer, params.start, params.end);
          evaluate = (ans) => ans === answer;
          promptOverride = "Qual número vem depois?";
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
        options = [{label: A, value: A}, {label: B, value: B}].sort(() => Math.random() - 0.5);
        evaluate = (ans) => ans === intruder;
        answer = intruder;
        break;
      }
      
      default:
        throw new Error(`Primitiva ${kind} ainda não possui builder no Composer (${ficha.id}/${micro.id}).`);
    }

    return {
      howto: ficha.howto,
      explain: ficha.explain,
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
