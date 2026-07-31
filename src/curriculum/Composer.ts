import { FichaCompetencia } from "./schema";
import { Option, Question } from "../types";
import {
  FichaAnswer,
  FichaEvaluate,
  FichaUiProps,
  normalizeFichaTutorial,
  parseComposerParams,
} from "./fichaQuestionContract";

const EMOJIS = ["🍎", "🦴", "🥕", "🐟", "🧀", "🏈", "⚽", "🚗", "🐶", "🐱"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numericOptions(answer: number, min: number, max: number) {
  const candidates = [answer, answer - 1, answer + 1, answer - 2, answer + 2]
    .filter(value => value >= min && value <= max);
  const values = [...new Set(candidates)].slice(0, Math.min(3, max - min + 1));
  return values
    .map(value => ({ label: String(value), value }))
    .sort(() => Math.random() - 0.5);
}

export class Composer {
  /**
   * Generates a concrete question instance from a Ficha's micro-competence.
   */
  static generate(ficha: FichaCompetencia, lvl: number, microId?: string): Question {
    let micro = microId ? ficha.micros.find(m => m.id === microId) : null;
    if (!micro) {
      if (microId) console.warn(`Micro ${microId} not found in Ficha ${ficha.id}, falling back to first micro.`);
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
      kind: kind === "intruso_math" ? "plain" : kind,
      prompt: promptOverride || params.audio_prompt || "Responda:",
      audioPrompt: promptOverride || params.audio_prompt,
      tutorial: normalizeFichaTutorial(params.tutorial),
      excecaoCPA: ficha.excecaoCPA,
      uiProps,
      evaluate,
      answer,
      options,
      big,
      n,
      emoji,
    };
  }
}
